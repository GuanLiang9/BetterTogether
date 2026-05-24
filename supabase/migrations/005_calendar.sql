-- ============================================================
-- 005_calendar.sql
-- events, reminders tables + RLS
-- ============================================================

CREATE TABLE events (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id        UUID REFERENCES couple_links(id) ON DELETE CASCADE NOT NULL,
  created_by       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  emoji            TEXT,
  starts_at        TIMESTAMPTZ NOT NULL,
  ends_at          TIMESTAMPTZ,
  all_day          BOOLEAN NOT NULL DEFAULT false,
  is_recurring     BOOLEAN NOT NULL DEFAULT false,
  recurrence_rule  TEXT,
  color            TEXT NOT NULL DEFAULT '#10b981',
  location         TEXT,
  created_at       TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE reminders (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id         UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  remind_at        TIMESTAMPTZ NOT NULL,
  target_user_ids  UUID[] NOT NULL,
  sent             BOOLEAN NOT NULL DEFAULT false,
  sent_at          TIMESTAMPTZ
);

CREATE TABLE push_subscriptions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  endpoint    TEXT UNIQUE NOT NULL,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── RLS ───────────────────────────────────────────────────────

ALTER TABLE events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- events: couple members have full access
CREATE POLICY "Couple members manage events"
  ON events FOR ALL
  USING (
    couple_id IN (
      SELECT couple_id FROM profiles
      WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  )
  WITH CHECK (
    couple_id IN (
      SELECT couple_id FROM profiles
      WHERE id = auth.uid() AND couple_id IS NOT NULL
    )
  );

-- reminders: couple members can insert; target users can select
-- Edge Function uses service_role key → bypasses RLS for UPDATE
CREATE POLICY "Couple members create reminders"
  ON reminders FOR INSERT
  WITH CHECK (
    event_id IN (
      SELECT e.id FROM events e
      JOIN profiles p ON p.couple_id = e.couple_id
      WHERE p.id = auth.uid() AND p.couple_id IS NOT NULL
    )
  );

CREATE POLICY "Target users view reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = ANY(target_user_ids));

-- push_subscriptions: own only
CREATE POLICY "Own push subscriptions"
  ON push_subscriptions FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE events;
