-- ============================================================
-- 004_focus_sessions.sql
-- focus_sessions, couple_focus_sessions + XP award trigger
-- ============================================================

CREATE TABLE focus_sessions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  couple_id         UUID REFERENCES couple_links(id) ON DELETE SET NULL,
  duration_mins     INTEGER NOT NULL,
  actual_mins       INTEGER,
  mode              TEXT NOT NULL DEFAULT 'pomodoro'
                      CHECK (mode IN ('pomodoro', 'freeform')),
  status            TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'completed', 'abandoned')),
  plant_stage       INTEGER NOT NULL DEFAULT 0,
  xp_earned         INTEGER NOT NULL DEFAULT 0,
  coins_earned      INTEGER NOT NULL DEFAULT 0,
  started_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  ended_at          TIMESTAMPTZ,
  couple_session_id UUID
);

CREATE TABLE couple_focus_sessions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id     UUID REFERENCES couple_links(id) ON DELETE CASCADE NOT NULL,
  initiated_by  UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  duration_mins INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'waiting'
                  CHECK (status IN ('waiting', 'active', 'completed')),
  started_at    TIMESTAMPTZ,
  ended_at      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add FK now that couple_focus_sessions exists
ALTER TABLE focus_sessions
  ADD CONSTRAINT fk_focus_sessions_couple_session
  FOREIGN KEY (couple_session_id)
  REFERENCES couple_focus_sessions(id) ON DELETE SET NULL;

-- ── XP trigger on session completion ─────────────────────────

CREATE OR REPLACE FUNCTION handle_focus_session_complete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_xp    INTEGER := 0;
  v_coins INTEGER := 0;
  v_mins  INTEGER;
BEGIN
  -- Only fire on status change to 'completed'
  IF NEW.status <> 'completed' OR OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  v_mins := COALESCE(NEW.actual_mins, 0);

  -- Minimum 5 minutes to earn rewards
  IF v_mins < 5 THEN
    RETURN NEW;
  END IF;

  -- Base XP proportional to time
  IF v_mins >= 50 THEN
    v_xp := 70; v_coins := 15;
  ELSIF v_mins >= 25 THEN
    v_xp := 30; v_coins := 6;
  ELSE
    -- 5–24 mins: scale linearly
    v_xp    := ROUND(v_mins * 1.2);
    v_coins := ROUND(v_mins * 0.25);
  END IF;

  -- Couple session bonus
  IF NEW.couple_session_id IS NOT NULL THEN
    v_xp    := v_xp + 50;
    v_coins := v_coins + 10;
  END IF;

  -- Award XP / coins
  PERFORM award_xp_and_coins(NEW.user_id, v_xp, v_coins, 'focus_complete', NEW.id);

  -- Store what was earned on the session row
  NEW.xp_earned    := v_xp;
  NEW.coins_earned := v_coins;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_focus_session_complete
  BEFORE UPDATE ON focus_sessions
  FOR EACH ROW EXECUTE FUNCTION handle_focus_session_complete();

-- ── RLS ───────────────────────────────────────────────────────

ALTER TABLE focus_sessions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own focus sessions"
  ON focus_sessions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Partner reads couple focus sessions"
  ON focus_sessions FOR SELECT
  USING (
    couple_id IS NOT NULL AND couple_id IN (
      SELECT couple_id FROM profiles WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  );

CREATE POLICY "Couple members access couple_focus_sessions"
  ON couple_focus_sessions FOR ALL
  USING (
    couple_id IN (
      SELECT couple_id FROM profiles WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id FROM profiles WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  );

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE focus_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE couple_focus_sessions;
