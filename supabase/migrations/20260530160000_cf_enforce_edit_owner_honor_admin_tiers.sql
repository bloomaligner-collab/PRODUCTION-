-- 20260530160000_cf_enforce_edit_owner_honor_admin_tiers.sql
--
-- Bugfix: super admins (and admins) were blocked from editing / resolving
-- customer_feedback cases at the DATABASE level.
--
-- The cf_enforce_edit_owner() guard trigger gate-kept on a hardcoded
-- `e.role = 'manager'` check, so it only recognised the literal legacy
-- manager role. Users on the newer access tiers (admin / super_admin, stored
-- in employees.role) failed every branch and hit:
--   "Only the creator, the assignee or a manager can edit this complaint."
-- even though the UI (cwFullAccess / hasFullAccess) grants them full access.
--
-- Fix: gate on private.is_manager(), which already returns true for
-- manager / admin / super_admin. Every other branch of the trigger is
-- unchanged. Applied to the live project on 2026-05-30.
CREATE OR REPLACE FUNCTION public.cf_enforce_edit_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE v_name text; v_is_mgr boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  SELECT e.name INTO v_name
  FROM public.employees e WHERE e.auth_user_id = auth.uid() LIMIT 1;
  v_is_mgr := private.is_manager();

  IF v_is_mgr THEN RETURN NEW; END IF;
  IF v_name IS NOT NULL AND OLD.received_by IS NOT NULL AND OLD.received_by = v_name THEN RETURN NEW; END IF;
  IF public.cw_user_matches_assignee(OLD.assigned_to) THEN RETURN NEW; END IF;

  -- (a) Take over: assignment now points to this user.
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to
     AND public.cw_user_matches_assignee(NEW.assigned_to) THEN
    RETURN NEW;
  END IF;

  -- (b) Follow-up owner flipping only the follow-up done flag.
  IF (public.cw_user_matches_assignee(OLD.follow_up_assignee)
      OR (OLD.follow_up_assignee IS NOT NULL AND OLD.follow_up_assignee = v_name))
     AND NEW.follow_up_done_at IS DISTINCT FROM OLD.follow_up_done_at
     AND NEW.received_date  IS NOT DISTINCT FROM OLD.received_date
     AND NEW.type           IS NOT DISTINCT FROM OLD.type
     AND NEW.category       IS NOT DISTINCT FROM OLD.category
     AND NEW.customer_name  IS NOT DISTINCT FROM OLD.customer_name
     AND NEW.description    IS NOT DISTINCT FROM OLD.description
     AND NEW.severity       IS NOT DISTINCT FROM OLD.severity
     AND NEW.status         IS NOT DISTINCT FROM OLD.status
     AND NEW.assigned_to    IS NOT DISTINCT FROM OLD.assigned_to
     AND NEW.resolution     IS NOT DISTINCT FROM OLD.resolution
     AND NEW.notes          IS NOT DISTINCT FROM OLD.notes THEN
    RETURN NEW;
  END IF;

  -- (c) Pure view/seen telemetry (no business field changed).
  IF  NEW.received_date      IS NOT DISTINCT FROM OLD.received_date
  AND NEW.type               IS NOT DISTINCT FROM OLD.type
  AND NEW.category           IS NOT DISTINCT FROM OLD.category
  AND NEW.customer_name      IS NOT DISTINCT FROM OLD.customer_name
  AND NEW.doctor             IS NOT DISTINCT FROM OLD.doctor
  AND NEW.case_id            IS NOT DISTINCT FROM OLD.case_id
  AND NEW.order_no           IS NOT DISTINCT FROM OLD.order_no
  AND NEW.severity           IS NOT DISTINCT FROM OLD.severity
  AND NEW.status             IS NOT DISTINCT FROM OLD.status
  AND NEW.description        IS NOT DISTINCT FROM OLD.description
  AND NEW.notes              IS NOT DISTINCT FROM OLD.notes
  AND NEW.resolution         IS NOT DISTINCT FROM OLD.resolution
  AND NEW.assigned_to        IS NOT DISTINCT FROM OLD.assigned_to
  AND NEW.resolved_at        IS NOT DISTINCT FROM OLD.resolved_at
  AND NEW.follow_up_date     IS NOT DISTINCT FROM OLD.follow_up_date
  AND NEW.follow_up_note     IS NOT DISTINCT FROM OLD.follow_up_note
  AND NEW.follow_up_assignee IS NOT DISTINCT FROM OLD.follow_up_assignee
  AND NEW.follow_up_done_at  IS NOT DISTINCT FROM OLD.follow_up_done_at
  AND NEW.received_by        IS NOT DISTINCT FROM OLD.received_by THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Only the creator, the assignee or a manager can edit this complaint.'
    USING errcode = '42501';
END $function$;
