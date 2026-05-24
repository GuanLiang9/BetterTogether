-- ============================================================
-- Migration 007: Shared Home, Character Data, Achievements
-- ============================================================

-- 1. Character data on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS character_data JSONB DEFAULT jsonb_build_object(
  'skin',       'warm',
  'hair',       'short',
  'hair_color', 'black',
  'outfit',     'default',
  'accessory',  'none'
);

-- 2. Couple/solo home
-- couple_id holds either a couple_links.id (paired users) or a profiles.id (solo user).
-- No FK so both work; RLS checks both cases.
CREATE TABLE IF NOT EXISTS couple_homes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id  UUID UNIQUE NOT NULL,
  background TEXT NOT NULL DEFAULT 'cozy',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE couple_homes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "couple_homes_access" ON couple_homes
  FOR ALL USING (
    -- solo: user owns the home directly
    couple_id = auth.uid()
    OR
    -- paired: user belongs to the couple
    couple_id IN (
      SELECT id FROM couple_links
      WHERE user_a_id = auth.uid() OR user_b_id = auth.uid()
    )
  );

-- 3. Home placements (items on the 8×6 room grid)
-- Same no-FK pattern as couple_homes for the same reason.
CREATE TABLE IF NOT EXISTS home_placements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id   UUID NOT NULL,
  item_slug   TEXT NOT NULL,
  item_emoji  TEXT NOT NULL,
  item_label  TEXT NOT NULL,
  placed_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  grid_x      INTEGER NOT NULL CHECK (grid_x >= 0 AND grid_x < 8),
  grid_y      INTEGER NOT NULL CHECK (grid_y >= 0 AND grid_y < 6),
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (couple_id, grid_x, grid_y)
);

ALTER TABLE home_placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "home_placements_access" ON home_placements
  FOR ALL USING (
    couple_id = auth.uid()
    OR
    couple_id IN (
      SELECT id FROM couple_links
      WHERE user_a_id = auth.uid() OR user_b_id = auth.uid()
    )
  );

-- 4. Achievements catalog
CREATE TABLE IF NOT EXISTS achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  icon            TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('habit','focus','couple','streak','special')),
  xp_reward       INTEGER NOT NULL DEFAULT 50,
  coin_reward     INTEGER NOT NULL DEFAULT 0,
  condition_type  TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements_read_all" ON achievements FOR SELECT USING (true);

-- 5. User achievements (earned by users)
CREATE TABLE IF NOT EXISTS user_achievements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  unlocked_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_achievements_own" ON user_achievements
  FOR ALL USING (user_id = auth.uid());

-- Partners can read each other's achievements (for display on partner page)
CREATE POLICY "user_achievements_partner_read" ON user_achievements
  FOR SELECT USING (
    user_id IN (
      SELECT CASE
        WHEN user_a_id = auth.uid() THEN user_b_id
        WHEN user_b_id = auth.uid() THEN user_a_id
      END
      FROM couple_links
      WHERE (user_a_id = auth.uid() OR user_b_id = auth.uid())
        AND status = 'active'
    )
  );

-- 6. Daily login rewards
CREATE TABLE IF NOT EXISTS daily_rewards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_date DATE NOT NULL DEFAULT CURRENT_DATE,
  streak_day  INTEGER NOT NULL DEFAULT 1,
  xp_earned   INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  claimed_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, reward_date)
);

ALTER TABLE daily_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_rewards_own" ON daily_rewards FOR ALL USING (user_id = auth.uid());

-- 7. Seed furniture unlockables
INSERT INTO unlockables (slug, name, description, category, coin_cost, xp_required, level_required, is_active)
VALUES
  ('furniture_couch',     'Cozy Couch',     'A soft place to relax together',   'furniture', 50,  0, 1, true),
  ('furniture_table',     'Coffee Table',   'Perfect for morning coffee',        'furniture', 30,  0, 1, true),
  ('furniture_bookshelf', 'Bookshelf',      'Fill it with your shared stories',  'furniture', 40,  0, 1, true),
  ('furniture_plant',     'Potted Plant',   'A little green life',               'furniture', 25,  0, 1, true),
  ('furniture_bed',       'Cozy Bed',       'Sweet dreams, together',            'furniture', 60,  0, 2, true),
  ('furniture_tv',        'TV Set',         'Movie nights incoming',             'furniture', 80,  0, 2, true),
  ('furniture_rug',       'Fluffy Rug',     'Warms up any room',                 'furniture', 35,  0, 1, true),
  ('furniture_lamp',      'Desk Lamp',      'Late night study buddy',            'furniture', 20,  0, 1, true),
  ('furniture_window',    'Garden Window',  'Let the sunshine in',               'furniture', 45,  0, 2, true),
  ('furniture_cat',       'House Cat',      'A purring companion',               'furniture', 100, 0, 3, true),
  ('furniture_dog',       'Puppy',          'Loyal and full of energy',          'furniture', 100, 0, 3, true),
  ('furniture_piano',     'Mini Piano',     'Fill the home with music',          'furniture', 120, 0, 4, true),
  ('furniture_fireplace', 'Fireplace',      'Warm evenings together',            'furniture', 150, 0, 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 8. Seed character outfit unlockables
INSERT INTO unlockables (slug, name, description, category, coin_cost, xp_required, level_required, is_active)
VALUES
  ('outfit_knight',    'Knight Armor',   'For your inner warrior',        'outfit', 75,  0, 2, true),
  ('outfit_wizard',    'Wizard Robe',    'Ancient arcane wisdom',         'outfit', 75,  0, 2, true),
  ('outfit_space',     'Space Suit',     'To infinity and beyond',        'outfit', 100, 0, 3, true),
  ('outfit_chef',      'Chef Coat',      'Master of the kitchen',         'outfit', 75,  0, 2, true),
  ('outfit_astro',     'Astronaut',      'Stargazing in style',           'outfit', 100, 0, 3, true),
  ('outfit_ninja',     'Ninja Suit',     'Swift and silent',              'outfit', 90,  0, 3, true),
  ('outfit_royal',     'Royal Robes',    'Fit for royalty',               'outfit', 150, 0, 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 9. Seed achievements
INSERT INTO achievements (slug, name, description, icon, category, xp_reward, coin_reward, condition_type, condition_value)
VALUES
  ('first_habit',    'First Step',         'Complete your first habit',           '🌱', 'habit',  50,   10,  'habits_completed', 1),
  ('habits_10',      'Getting Consistent', 'Complete 10 habits total',            '🔥', 'habit',  100,  20,  'habits_completed', 10),
  ('habits_100',     'Habit Machine',      'Complete 100 habits total',           '⚡', 'habit',  500,  100, 'habits_completed', 100),
  ('streak_7',       'Week Warrior',       'Maintain a 7-day streak',             '🗓️', 'streak', 150,  30,  'max_streak',       7),
  ('streak_30',      'Habit Master',       'Maintain a 30-day streak',            '💎', 'streak', 500,  100, 'max_streak',       30),
  ('streak_100',     'Iron Will',          'Maintain a 100-day streak',           '🏆', 'streak', 2000, 400, 'max_streak',       100),
  ('focus_1h',       'Deep Diver',         'Focus for 1 hour total',              '🎯', 'focus',  75,   15,  'focus_minutes',    60),
  ('focus_10h',      'Flow State',         'Focus for 10 hours total',            '🌊', 'focus',  300,  60,  'focus_minutes',    600),
  ('focus_100h',     'Monk Mode',          'Focus for 100 hours total',           '🧘', 'focus',  1500, 300, 'focus_minutes',    6000),
  ('couple_link',    'Better Together',    'Link with your partner',              '💑', 'couple', 100,  25,  'couple_days',      1),
  ('couple_7d',      'Growing Together',   'Stay linked for 7 days',              '🌿', 'couple', 200,  40,  'couple_days',      7),
  ('couple_30d',     'Rooted Together',    'Stay linked for 30 days',             '🌳', 'couple', 400,  80,  'couple_days',      30),
  ('first_reaction', 'Sending Love',       'Send your first reaction',            '💝', 'couple', 25,   5,   'reactions_sent',   1),
  ('reactions_50',   'Love Language',      'Send 50 reactions',                   '💌', 'couple', 150,  30,  'reactions_sent',   50),
  ('home_first',     'Nesting',            'Place your first home item',          '🏡', 'special', 50,  10,  'home_items',       1),
  ('home_full',      'Interior Designer',  'Fill 10 spots in your home',          '🛋️', 'special', 200, 50,  'home_items',       10),
  ('login_7',        'Early Bird',         'Log in 7 days in a row',              '☀️', 'special', 100, 20,  'login_streak',     7),
  ('login_30',       'Devoted',            'Log in 30 days in a row',             '🌟', 'special', 400, 80,  'login_streak',     30),
  ('level_5',        'Rising Star',        'Reach level 5',                       '⭐', 'special', 200, 50,  'level',            5),
  ('level_10',       'Legend',             'Reach the maximum level',             '👑', 'special', 1000, 200, 'level',           10)
ON CONFLICT (slug) DO NOTHING;
