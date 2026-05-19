-- 20260519073000_protect_customer_feedback_delete.sql
--
-- INCIDENT 2026-05-19 07:19 UTC: a customer_service employee
-- (non-manager) used the bulk-delete to remove ALL 19
-- customer_feedback cases; chat_messages.case_id ON DELETE CASCADE
-- then wiped the per-case chat too. Cases were rebuilt from
-- public.audit_log.old_data.
--
-- Fix: customer_feedback keeps the "authenticated = trusted" model
-- for read/create/update, but DELETE is now manager-only so staff
-- can no longer wipe the register. Applied to cvrmadmzzualqukxxlro.

ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS customer_feedback_authenticated_all ON public.customer_feedback;
DROP POLICY IF EXISTS cf_select ON public.customer_feedback;
DROP POLICY IF EXISTS cf_insert ON public.customer_feedback;
DROP POLICY IF EXISTS cf_update ON public.customer_feedback;
DROP POLICY IF EXISTS cf_delete ON public.customer_feedback;

CREATE POLICY cf_select ON public.customer_feedback
  FOR SELECT TO authenticated USING (true);
CREATE POLICY cf_insert ON public.customer_feedback
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY cf_update ON public.customer_feedback
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY cf_delete ON public.customer_feedback
  FOR DELETE TO authenticated USING (public.cw_is_manager());
