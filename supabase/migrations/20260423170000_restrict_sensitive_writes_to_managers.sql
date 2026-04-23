-- 20260423170000_restrict_sensitive_writes_to_managers.sql
--
-- Tightens RLS on 6 tables where "any authenticated employee can
-- mutate" bypassed a business control. Read stays open (dashboards
-- need it), but writes are gated on role = 'manager'.
--
-- Background: the previous migration (20260423162240_…) enabled
-- RLS on every table with a single permissive policy
-- (USING true / WITH CHECK true) to close the anon hole without
-- breaking the app. This migration layers least-privilege writes
-- on top for the tables where mutation is a security event.

-- ============================================================
-- 1. is_manager() helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.auth_user_id = auth.uid()
      AND COALESCE(e.is_active, true) = true
      AND e.role = 'manager'
  )
$$;
REVOKE EXECUTE ON FUNCTION public.is_manager() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_manager() TO authenticated;

-- ============================================================
-- 2. Swap the broad "authenticated_all" policy for
--    (read: all authenticated) + (write: managers only)
-- ============================================================
DO $$
DECLARE
  t text;
  tbls text[] := ARRAY[
    'employees', 'suppliers', 'role_templates',
    'page_access', 'system_settings', 'notification_settings'
  ];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_authenticated_all', t);

    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true)',
      t || '_read', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_manager())',
      t || '_manager_insert', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager())',
      t || '_manager_update', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (public.is_manager())',
      t || '_manager_delete', t
    );
  END LOOP;
END $$;
