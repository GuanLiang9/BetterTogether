-- Migration 002: Couple links

CREATE TABLE IF NOT EXISTS public.couple_links (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b_id        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  invite_code      TEXT UNIQUE NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','dissolved')),
  couple_xp        INTEGER NOT NULL DEFAULT 0,
  couple_level     SMALLINT NOT NULL DEFAULT 1,
  couple_streak    INTEGER NOT NULL DEFAULT 0,
  streak_last_date DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  linked_at        TIMESTAMPTZ
);

-- Add FK from profiles to couple_links
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_couple FOREIGN KEY (couple_id)
  REFERENCES public.couple_links(id) ON DELETE SET NULL;

-- Unique: each user can only be in one active couple
CREATE UNIQUE INDEX couple_links_user_a_active_idx
  ON public.couple_links(user_a_id)
  WHERE status = 'active';

CREATE UNIQUE INDEX couple_links_user_b_active_idx
  ON public.couple_links(user_b_id)
  WHERE status = 'active' AND user_b_id IS NOT NULL;

-- Trigger: when user_b_id is set (invite accepted), update linked_at and both profiles.couple_id
CREATE OR REPLACE FUNCTION public.handle_couple_link_accept()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.user_b_id IS NOT NULL AND OLD.user_b_id IS NULL THEN
    NEW.linked_at = NOW();
    NEW.status = 'active';
    UPDATE public.profiles SET couple_id = NEW.id WHERE id = NEW.user_a_id;
    UPDATE public.profiles SET couple_id = NEW.id WHERE id = NEW.user_b_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_couple_link_accept
  BEFORE UPDATE ON public.couple_links
  FOR EACH ROW EXECUTE FUNCTION public.handle_couple_link_accept();

-- RLS
ALTER TABLE public.couple_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their couple"
  ON public.couple_links FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "User can create pending couple"
  ON public.couple_links FOR INSERT
  WITH CHECK (auth.uid() = user_a_id);

CREATE POLICY "User b can accept invite (update user_b_id)"
  ON public.couple_links FOR UPDATE
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Allow partners to see each other's profile (add to migration 001 RLS)
CREATE POLICY "Partners can view each other's profile"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.couple_links cl
      WHERE cl.status = 'active'
        AND (cl.user_a_id = auth.uid() OR cl.user_b_id = auth.uid())
        AND (cl.user_a_id = profiles.id OR cl.user_b_id = profiles.id)
    )
  );
