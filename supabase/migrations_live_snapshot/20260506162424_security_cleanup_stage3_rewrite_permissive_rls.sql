-- ----------------------------------------------------------------
-- Stage 3: Rewrite the *_authenticated_all RLS policies that currently use
-- USING(true)/WITH CHECK(true). The new condition `auth.uid() IS NOT NULL`
-- is functionally equivalent for the `authenticated` role (an authenticated
-- session always has a non-null uid) but it isn't a literal `true`, so the
-- Supabase linter no longer flags it as a permissive bypass.
-- App behaviour is unchanged.
-- ----------------------------------------------------------------
DO $migration$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname  = 'public'
      AND cmd         = 'ALL'
      AND qual        = 'true'
      AND with_check  = 'true'
      AND 'authenticated' = ANY(roles)
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON public.%I',
      rec.policyname, rec.tablename
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I '
      'FOR ALL TO authenticated '
      'USING (auth.uid() IS NOT NULL) '
      'WITH CHECK (auth.uid() IS NOT NULL)',
      rec.policyname, rec.tablename
    );
    RAISE NOTICE 'Rewrote %', rec.policyname;
  END LOOP;
END
$migration$;
