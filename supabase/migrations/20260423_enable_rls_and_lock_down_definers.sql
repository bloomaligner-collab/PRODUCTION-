-- 20260423_enable_rls_and_lock_down_definers.sql
--
-- Purpose: close the 44 ERROR-level advisor findings from the
-- 2026-04-23 security audit.
--
--   • All 45 public tables had RLS disabled AND zero policies.
--     With the anon key in config.js (public by design), this
--     meant anyone on the internet could SELECT/INSERT/UPDATE/
--     DELETE every table via the PostgREST endpoint.
--   • 4 views (bloom_aligners, inventory_lots_enriched_view,
--     inventory_reorder_dashboard_view, production_events_view)
--     were SECURITY DEFINER and would bypass the RLS we're
--     enabling.
--   • 17 trigger/utility functions had mutable search_path.
--
-- Model used: "authenticated = trusted" (Option A). Preserves the
-- exact behaviour the app has today for logged-in users. Tighter
-- role-based policies can be layered on top per table later.
--
-- Pre-auth username→email resolution (index.html login flow) is
-- handled by the SECURITY DEFINER RPC lookup_login_email created
-- below — anon can no longer SELECT from public.employees.

-- ============================================================
-- 1. LOGIN LOOKUP RPC
-- ============================================================
CREATE OR REPLACE FUNCTION public.lookup_login_email(p_username text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT email
  FROM public.employees
  WHERE lower(username) = lower(p_username)
    AND COALESCE(is_active, true) = true
  LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.lookup_login_email(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.lookup_login_email(text) TO anon, authenticated;

-- ============================================================
-- 2. ENABLE RLS + BASE "AUTHENTICATED = TRUSTED" POLICY
-- ============================================================
DO $$
DECLARE
  t text;
  tbls text[] := ARRAY[
    'bloom_aligner_details','bloom_case_history','bloom_case_snapshots','bloom_cases',
    'bloom_imports','bloom_sync_log','bom','customer_feedback','employees',
    'internal_audits','inventory_batch_consumption','inventory_items',
    'inventory_locations','inventory_lots','inventory_requisitions',
    'inventory_stock_history','inventory_suppliers','machine_consumable_loads',
    'machine_lot_assignments','machine_maintenance_log','machines',
    'material_consumption_log','material_yield_rules','non_conformity_reports',
    'notification_log','notification_settings','order_step_tracking',
    'outsourced_orders','page_access','production_completion_log',
    'production_entries','production_lots','production_materials',
    'production_parameters','production_records','production_reminders',
    'quality_controls','requisition_lines','requisitions','role_templates',
    'step_machines','suppliers','system_settings','time_sessions','traceability'
  ];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      t || '_authenticated_all', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      t || '_authenticated_all', t
    );
  END LOOP;
END $$;

-- ============================================================
-- 3. RECREATE 4 VIEWS AS SECURITY INVOKER
-- ============================================================
ALTER VIEW public.bloom_aligners                   SET (security_invoker = true);
ALTER VIEW public.inventory_lots_enriched_view     SET (security_invoker = true);
ALTER VIEW public.inventory_reorder_dashboard_view SET (security_invoker = true);
ALTER VIEW public.production_events_view           SET (security_invoker = true);

-- ============================================================
-- 4. PIN search_path ON 17 FUNCTIONS
-- ============================================================
ALTER FUNCTION public.get_fefo_lot(uuid)                SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_requisition_ref()        SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_requisition_no()         SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_lot_number()             SET search_path = public, pg_temp;
ALTER FUNCTION public.auto_traceability_on_production() SET search_path = public, pg_temp;
ALTER FUNCTION public.auto_quality_flag_on_partial()    SET search_path = public, pg_temp;
ALTER FUNCTION public.auto_create_production_lot()      SET search_path = public, pg_temp;
ALTER FUNCTION public.auto_log_traceability()           SET search_path = public, pg_temp;
ALTER FUNCTION public.auto_flag_quality()               SET search_path = public, pg_temp;
ALTER FUNCTION public.update_machine_running_hours()    SET search_path = public, pg_temp;
ALTER FUNCTION public.update_consumable_on_production() SET search_path = public, pg_temp;
ALTER FUNCTION public.reset_hours_on_maintenance()      SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_nc_number()              SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_feedback_no()            SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_auto_requisitions()      SET search_path = public, pg_temp;
ALTER FUNCTION public.sync_lot_available_qty()          SET search_path = public, pg_temp;
ALTER FUNCTION public.sync_inventory_item_name()        SET search_path = public, pg_temp;
