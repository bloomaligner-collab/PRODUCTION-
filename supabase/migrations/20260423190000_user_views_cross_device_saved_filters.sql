-- 20260423190000_user_views_cross_device_saved_filters.sql
--
-- Per-user saved filter "views" that follow the user across
-- devices. Originally stored in localStorage on the Customer
-- Feedback page; this migration moves them to Postgres so the
-- same user sees the same views on any machine where they log in.
--
-- The 'page' column namespaces views so e.g. non_conformity or
-- inventory pages can add their own saved views later without a
-- schema change.

CREATE TABLE IF NOT EXISTS public.user_views (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  page       TEXT NOT NULL,
  name       TEXT NOT NULL,
  filters    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_views_user_page_idx
  ON public.user_views (user_id, page, created_at);

-- updated_at maintained by trigger
CREATE OR REPLACE FUNCTION public.user_views_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_views_updated_at ON public.user_views;
CREATE TRIGGER user_views_updated_at
  BEFORE UPDATE ON public.user_views
  FOR EACH ROW EXECUTE FUNCTION public.user_views_set_updated_at();

-- RLS: each user sees and mutates only their own rows.
ALTER TABLE public.user_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_views_own_select ON public.user_views;
DROP POLICY IF EXISTS user_views_own_insert ON public.user_views;
DROP POLICY IF EXISTS user_views_own_update ON public.user_views;
DROP POLICY IF EXISTS user_views_own_delete ON public.user_views;

CREATE POLICY user_views_own_select ON public.user_views
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY user_views_own_insert ON public.user_views
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_views_own_update ON public.user_views
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY user_views_own_delete ON public.user_views
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
