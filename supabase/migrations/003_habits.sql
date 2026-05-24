-- ============================================================
-- 003_habits.sql
-- habits, habit_completions, habit_streaks + XP/streak triggers
-- ============================================================

-- ── Tables ───────────────────────────────────────────────────

CREATE TABLE habits (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  couple_id     UUID REFERENCES couple_links(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  icon          TEXT,
  color         TEXT NOT NULL DEFAULT '#10b981',
  frequency     TEXT NOT NULL DEFAULT 'daily'
                  CHECK (frequency IN ('daily', 'weekdays', 'custom')),
  frequency_days INTEGER[],
  is_shared     BOOLEAN NOT NULL DEFAULT false,
  target_count  INTEGER NOT NULL DEFAULT 1,
  xp_reward     INTEGER NOT NULL DEFAULT 15,
  coin_reward   INTEGER NOT NULL DEFAULT 3,
  archived      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE habit_completions (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id       UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE NOT NULL,
  completed_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(habit_id, user_id, completed_date)
);

CREATE TABLE habit_streaks (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id         UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak   INTEGER NOT NULL DEFAULT 0,
  longest_streak   INTEGER NOT NULL DEFAULT 0,
  last_completed   DATE,
  UNIQUE(habit_id, user_id)
);

-- ── Helper functions ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION get_streak_multiplier(streak_count INTEGER)
RETURNS NUMERIC LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF streak_count >= 90 THEN RETURN 2.0;
  ELSIF streak_count >= 60 THEN RETURN 1.75;
  ELSIF streak_count >= 30 THEN RETURN 1.5;
  ELSIF streak_count >= 14 THEN RETURN 1.25;
  ELSIF streak_count >= 7  THEN RETURN 1.15;
  ELSE RETURN 1.0;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_level_from_xp(p_xp INTEGER)
RETURNS INTEGER LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF    p_xp >= 13000 THEN RETURN 10;
  ELSIF p_xp >=  8000 THEN RETURN 9;
  ELSIF p_xp >=  5500 THEN RETURN 8;
  ELSIF p_xp >=  4000 THEN RETURN 7;
  ELSIF p_xp >=  2500 THEN RETURN 6;
  ELSIF p_xp >=  1500 THEN RETURN 5;
  ELSIF p_xp >=   800 THEN RETURN 4;
  ELSIF p_xp >=   400 THEN RETURN 3;
  ELSIF p_xp >=   150 THEN RETURN 2;
  ELSE RETURN 1;
  END IF;
END;
$$;

-- award_xp_and_coins: append-only ledger + profile totals
-- SECURITY DEFINER so the trigger (running as table owner) can INSERT into ledgers
CREATE OR REPLACE FUNCTION award_xp_and_coins(
  p_user_id  UUID,
  p_xp       INTEGER,
  p_coins    INTEGER,
  p_reason   TEXT,
  p_source_id UUID DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO xp_ledger   (user_id, amount, reason, source_id)
  VALUES (p_user_id, p_xp,    p_reason, p_source_id);
  INSERT INTO coin_ledger (user_id, amount, reason, source_id)
  VALUES (p_user_id, p_coins, p_reason, p_source_id);

  UPDATE profiles
  SET xp    = xp    + p_xp,
      coins = coins + p_coins
  WHERE id = p_user_id;
END;
$$;

-- ── Habit completion trigger ──────────────────────────────────

CREATE OR REPLACE FUNCTION handle_habit_completion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_habit       habits%ROWTYPE;
  v_streak      habit_streaks%ROWTYPE;
  v_new_streak  INTEGER;
  v_xp          INTEGER;
BEGIN
  SELECT * INTO v_habit FROM habits WHERE id = NEW.habit_id;

  -- Ensure streak row exists
  INSERT INTO habit_streaks (habit_id, user_id)
  VALUES (NEW.habit_id, NEW.user_id)
  ON CONFLICT (habit_id, user_id) DO NOTHING;

  SELECT * INTO v_streak
  FROM habit_streaks
  WHERE habit_id = NEW.habit_id AND user_id = NEW.user_id;

  -- Compute new streak
  IF v_streak.last_completed IS NULL
     OR v_streak.last_completed < (NEW.completed_date - INTERVAL '1 day') THEN
    v_new_streak := 1;
  ELSIF v_streak.last_completed = NEW.completed_date THEN
    v_new_streak := v_streak.current_streak; -- same-day duplicate
  ELSE
    v_new_streak := v_streak.current_streak + 1;
  END IF;

  UPDATE habit_streaks
  SET current_streak = v_new_streak,
      longest_streak = GREATEST(longest_streak, v_new_streak),
      last_completed = NEW.completed_date
  WHERE habit_id = NEW.habit_id AND user_id = NEW.user_id;

  -- XP with streak multiplier; shared habit gets +5
  v_xp := ROUND(v_habit.xp_reward * get_streak_multiplier(v_new_streak))
          + CASE WHEN v_habit.is_shared THEN 5 ELSE 0 END;

  PERFORM award_xp_and_coins(
    NEW.user_id, v_xp, v_habit.coin_reward, 'habit_complete', NEW.habit_id
  );

  -- Streak milestone bonuses
  IF v_new_streak = 7 THEN
    PERFORM award_xp_and_coins(NEW.user_id, 100, 20, 'streak_7', NEW.habit_id);
  ELSIF v_new_streak = 30 THEN
    PERFORM award_xp_and_coins(NEW.user_id, 500, 100, 'streak_30', NEW.habit_id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_habit_completion_insert
  AFTER INSERT ON habit_completions
  FOR EACH ROW EXECUTE FUNCTION handle_habit_completion();

-- ── XP change → level recalc ──────────────────────────────────

CREATE OR REPLACE FUNCTION handle_xp_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.xp <> OLD.xp THEN
    NEW.level := get_level_from_xp(NEW.xp);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_xp_change
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_xp_change();

-- Also need ledger tables (if not created in 001) ─────────────
CREATE TABLE IF NOT EXISTS xp_ledger (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount     INTEGER NOT NULL,
  reason     TEXT NOT NULL,
  source_id  UUID,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS coin_ledger (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount     INTEGER NOT NULL,
  reason     TEXT NOT NULL,
  source_id  UUID,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── RLS ───────────────────────────────────────────────────────

ALTER TABLE habits            ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_streaks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_ledger         ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_ledger       ENABLE ROW LEVEL SECURITY;

-- habits
CREATE POLICY "Own habits full access"
  ON habits FOR ALL
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Partner reads shared habits"
  ON habits FOR SELECT
  USING (
    is_shared = true AND couple_id IS NOT NULL AND couple_id IN (
      SELECT couple_id FROM profiles WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  );

-- habit_completions
CREATE POLICY "Own completions full access"
  ON habit_completions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partner reads shared habit completions"
  ON habit_completions FOR SELECT
  USING (
    habit_id IN (
      SELECT h.id FROM habits h
      JOIN profiles p ON p.id = auth.uid()
      WHERE h.is_shared = true AND h.couple_id = p.couple_id AND p.couple_id IS NOT NULL
    )
  );

-- habit_streaks
CREATE POLICY "Own streaks full access"
  ON habit_streaks FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partner reads shared habit streaks"
  ON habit_streaks FOR SELECT
  USING (
    habit_id IN (
      SELECT h.id FROM habits h
      JOIN profiles p ON p.id = auth.uid()
      WHERE h.is_shared = true AND h.couple_id = p.couple_id AND p.couple_id IS NOT NULL
    )
  );

-- ledgers: read own; no client INSERT/UPDATE/DELETE
CREATE POLICY "Own ledger read"
  ON xp_ledger FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Own coin ledger read"
  ON coin_ledger FOR SELECT
  USING (user_id = auth.uid());

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE habit_completions;
ALTER PUBLICATION supabase_realtime ADD TABLE habit_streaks;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
