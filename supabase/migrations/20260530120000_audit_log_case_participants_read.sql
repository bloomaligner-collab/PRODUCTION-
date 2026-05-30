-- 20260530120000_audit_log_case_participants_read.sql
--
-- Surfaces the per-case activity history (built in customer_feedback.html
-- from the append-only audit_log) to a case's own people.
--
-- Context (verified against the live database):
--   • private.is_manager() already matches role IN ('manager','admin',
--     'super_admin'), so full-access roles can already READ audit_log via
--     the existing audit_log_manager_read policy — and the admin tiers
--     already have full "do-all" write access. Nothing to change there.
--   • audit_trigger_fn() already stamps employees.role, which holds the
--     access tier (e.g. 'super_admin'), so the history already labels the
--     actor's tier correctly. Nothing to change there either.
--
-- The only gap: a case's assignee / creator / participants who are NOT a
-- full-access role cannot read their own case's history. This adds a second,
-- additive SELECT policy for exactly that, reusing the existing
-- cw_can_see_case() visibility rule.
--
-- Safety: audit_log holds rows for many tables; some have non-UUID primary
-- keys. RLS quals are not guaranteed to short-circuit, so the record_pk is
-- only cast to uuid when it actually looks like one (otherwise NULL, and
-- cw_can_see_case(NULL) returns false). This keeps audit_log reads from
-- ever erroring for other tables.

DROP POLICY IF EXISTS audit_log_case_participants_read ON public.audit_log;
CREATE POLICY audit_log_case_participants_read ON public.audit_log
  FOR SELECT TO authenticated
  USING (
    table_name = 'customer_feedback'
    AND public.cw_can_see_case(
      (CASE
         WHEN record_pk ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
         THEN record_pk
       END)::uuid
    )
  );
