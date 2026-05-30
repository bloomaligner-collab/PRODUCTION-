-- ----------------------------------------------------------------
-- Stage 2: Move SECURITY DEFINER helper functions to a 'private' schema
-- so PostgREST does not expose them via /rest/v1/rpc.
-- Public wrappers (SECURITY INVOKER) preserve the existing app contract.
-- Existing RLS policies that reference public.is_manager() continue to
-- work unchanged because PostgreSQL stores function references by OID,
-- which is preserved across ALTER FUNCTION ... SET SCHEMA.
-- ----------------------------------------------------------------

-- Create the schema. It is intentionally NOT added to PostgREST exposed schemas.
CREATE SCHEMA IF NOT EXISTS private;

-- Roles need USAGE on the schema before they can call functions inside.
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT USAGE ON SCHEMA private TO anon;

-- ---- is_manager() ---------------------------------------------------------
ALTER FUNCTION public.is_manager() SET SCHEMA private;
GRANT EXECUTE ON FUNCTION private.is_manager() TO authenticated;

-- Public wrapper (SECURITY INVOKER) so any app code calling
-- supabase.rpc('is_manager') keeps working.
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT private.is_manager()
$$;
GRANT EXECUTE ON FUNCTION public.is_manager() TO authenticated;

-- ---- lookup_login_email(text) --------------------------------------------
ALTER FUNCTION public.lookup_login_email(text) SET SCHEMA private;
GRANT EXECUTE ON FUNCTION private.lookup_login_email(text) TO anon;
GRANT EXECUTE ON FUNCTION private.lookup_login_email(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.lookup_login_email(p_username text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT private.lookup_login_email(p_username)
$$;
GRANT EXECUTE ON FUNCTION public.lookup_login_email(text) TO anon;
GRANT EXECUTE ON FUNCTION public.lookup_login_email(text) TO authenticated;
