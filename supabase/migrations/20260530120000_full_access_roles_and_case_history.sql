-- 20260530120000_full_access_roles_and_case_history.sql
--
-- Two related changes:
--
--  1. FULL DO-ALL ACCESS for the admin tiers.
--     The app's role hierarchy is super_admin > admin > manager (all meant
--     to have full access — see access.js ADMIN_TIERS / hasFullAccess()).
--     But is_manager() — the gate on every "managers only" write policy and
--     on reading audit_log — only matched the literal role 'manager', and
--     only looked at employees.role (ignoring employees.custom_role, where
--     the admin tiers are actually stored). Admins and super admins were
--     therefore blocked at the database even though the UI grants them
--     everything. We widen is_manager() to recognise manager/admin/
--     super_admin in EITHER column. Every existing policy that calls
--     is_manager() inherits this automatically.
--
--  2. CASE HISTORY visibility + accurate actor role.
--     a) audit_trigger_fn() now stamps the actor's effective tier
--        (custom_role, falling back to role) so the case timeline can show
--        e.g. "Super Admin" rather than the base role.
--     b) A new audit_log read policy lets a case's own assignee/creator/
--        participants read that case's history (not other tables, not other
--        cases) — reusing the existing cw_can_see_case() rule. Full-access
--        roles keep their broad read via is_manager().

-- ============================================================
-- 1. Widen is_manager() to the full-access tiers, both columns
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
      AND lower(COALESCE(NULLIF(e.custom_role, ''), e.role, ''))
            IN ('manager', 'admin', 'super_admin')
  );
$$;
REVOKE EXECUTE ON FUNCTION public.is_manager() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_manager() TO authenticated;

-- ============================================================
-- 2a. Capture the actor's effective tier in the audit trail
-- ============================================================
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  pk_val       TEXT;
  caller_email TEXT;
  caller_role  TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    pk_val := COALESCE(
      (to_jsonb(OLD)->>'id'),
      (to_jsonb(OLD)->>'key'),
      (to_jsonb(OLD)->>'case_id')
    );
  ELSE
    pk_val := COALESCE(
      (to_jsonb(NEW)->>'id'),
      (to_jsonb(NEW)->>'key'),
      (to_jsonb(NEW)->>'case_id')
    );
  END IF;

  SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
  -- Prefer the effective tier (custom_role) over the base role so the
  -- history can read "Super Admin" / "Admin" accurately.
  SELECT COALESCE(NULLIF(custom_role, ''), role) INTO caller_role
    FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;

  INSERT INTO public.audit_log (
    actor_uid, actor_email, actor_role,
    table_name, record_pk, op,
    old_data, new_data
  ) VALUES (
    auth.uid(), caller_email, caller_role,
    TG_TABLE_NAME, pk_val, TG_OP,
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
  );

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.audit_trigger_fn() FROM PUBLIC;

-- ============================================================
-- 2b. Let a case's participants read that case's history
-- ============================================================
-- RLS policies are OR-combined: this is additive to the existing
-- audit_log_manager_read (full-access roles). It only exposes
-- customer_feedback rows, and only for cases the caller may already see.
DROP POLICY IF EXISTS audit_log_case_participants_read ON public.audit_log;
CREATE POLICY audit_log_case_participants_read ON public.audit_log
  FOR SELECT TO authenticated
  USING (
    table_name = 'customer_feedback'
    AND record_pk IS NOT NULL
    AND public.cw_can_see_case(record_pk::uuid)
  );
