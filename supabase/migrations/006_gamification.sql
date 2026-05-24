-- ============================================================
-- 006_gamification.sql
-- unlockables, user_unlockables, couple_streak_log
-- ============================================================

CREATE TABLE unlockables (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  category     TEXT NOT NULL CHECK (category IN ('theme','plant_skin','badge','reaction','couple_frame','sound')),
  coin_cost    INTEGER NOT NULL DEFAULT 0,
  xp_required  INTEGER NOT NULL DEFAULT 0,
  level_required INTEGER NOT NULL DEFAULT 1,
  couple_only  BOOLEAN NOT NULL DEFAULT false,
  preview_url  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE user_unlockables (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unlockable_id UUID REFERENCES unlockables(id) ON DELETE CASCADE NOT NULL,
  equipped      BOOLEAN NOT NULL DEFAULT false,
  unlocked_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, unlockable_id)
);

CREATE TABLE couple_streak_log (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id  UUID REFERENCES couple_links(id) ON DELETE CASCADE NOT NULL,
  log_date   DATE NOT NULL,
  UNIQUE (couple_id, log_date)
);

-- ── RLS ───────────────────────────────────────────────────────

ALTER TABLE unlockables       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unlockables  ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_streak_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unlockables are publicly readable"
  ON unlockables FOR SELECT USING (true);

CREATE POLICY "Users manage own unlockables"
  ON user_unlockables FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Couple members view streak log"
  ON couple_streak_log FOR SELECT
  USING (
    couple_id IN (
      SELECT couple_id FROM profiles
      WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  );

-- ── Purchase function (atomic) ────────────────────────────────

CREATE OR REPLACE FUNCTION purchase_unlockable(p_unlockable_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id       UUID := auth.uid();
  v_unlockable    unlockables%ROWTYPE;
  v_profile       profiles%ROWTYPE;
  v_already_owned BOOLEAN;
BEGIN
  SELECT * INTO v_unlockable FROM unlockables WHERE id = p_unlockable_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'Unlockable not found'); END IF;

  SELECT * INTO v_profile FROM profiles WHERE id = v_user_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'Profile not found'); END IF;

  SELECT EXISTS(
    SELECT 1 FROM user_unlockables WHERE user_id = v_user_id AND unlockable_id = p_unlockable_id
  ) INTO v_already_owned;
  IF v_already_owned THEN RETURN jsonb_build_object('error', 'Already owned'); END IF;

  IF v_profile.coins < v_unlockable.coin_cost THEN
    RETURN jsonb_build_object('error', 'Insufficient coins');
  END IF;
  IF v_profile.xp < v_unlockable.xp_required THEN
    RETURN jsonb_build_object('error', 'XP requirement not met');
  END IF;
  IF v_profile.level < v_unlockable.level_required THEN
    RETURN jsonb_build_object('error', 'Level requirement not met');
  END IF;

  INSERT INTO user_unlockables (user_id, unlockable_id) VALUES (v_user_id, p_unlockable_id);

  INSERT INTO coin_ledger (user_id, amount, reason, source_id)
  VALUES (v_user_id, -v_unlockable.coin_cost, 'shop_purchase', p_unlockable_id);

  UPDATE profiles SET coins = coins - v_unlockable.coin_cost WHERE id = v_user_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

-- ── Seed unlockables ──────────────────────────────────────────

INSERT INTO unlockables (slug, name, description, category, coin_cost, xp_required, level_required, couple_only) VALUES
-- Themes
('midnight-forest',  'Midnight Forest',   'Deep forest greens on darkest night',         'theme', 500,   0,    1,     false),
('aurora-glass',     'Aurora Glass',      'Shimmering aurora borealis glassmorphism',    'theme', 1000,  400,  3,     false),
('ember-dusk',       'Ember Dusk',        'Warm amber and rose twilight palette',        'theme', 2000,  1500, 5,     false),
-- Plant skins
('cherry-blossom',   'Cherry Blossom',    'Delicate pink petals grow as you focus',     'plant_skin', 0, 400,  3,  false),
('cactus',           'Cactus',            'A resilient friend that never gives up',      'plant_skin', 0, 1500, 5,  false),
('succulent',        'Succulent',         'Plump and cheerful, low maintenance vibes',  'plant_skin', 0, 4000, 7,  false),
('bonsai',           'Bonsai',            'The art of patience, in miniature form',     'plant_skin', 0, 9000, 9,  false),
-- Badges (awarded automatically via triggers — coin_cost 0)
('first-week',       'First Week',        'Completed 7 consecutive days of habits',     'badge', 0, 0, 1, false),
('streak-master',    'Streak Master',     'Reached a 30-day habit streak',              'badge', 0, 0, 1, false),
('focused-pair',     'Focused Pair',      'Completed a couple focus session',           'badge', 0, 0, 1, true),
('century-club',     'Century Club',      'Logged 100 total habit completions',         'badge', 0, 0, 1, false),
-- Reactions (couple milestone at 30-day couple streak)
('animal-pack',      'Animal Reaction Pack', 'Unlock 🐼 🦊 🐨 🦁 reactions',           'reaction', 0, 0, 1, true)
ON CONFLICT (slug) DO NOTHING;

-- ── Realtime ──────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE user_unlockables;
