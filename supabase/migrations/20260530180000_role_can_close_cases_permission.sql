-- 20260530180000_role_can_close_cases_permission.sql
--
-- Per-role "can close customer-feedback cases" permission, configured in
-- role setup (roles.html → "Can close cases" toggle).
--
--   · role_templates.can_close_cases — boolean per role template.
--   · cw_can_close_case() — true for full-access tiers (manager/admin/
--     super_admin via private.is_manager()) OR any role the user holds
--     (primary, custom, or extra_roles) flagged can_close_cases.
--   · cf_enforce_edit_owner() gains a close-gate: a transition INTO status
--     'closed' is allowed only when cw_can_close_case() is true, enforced
--     regardless of ownership — so a non-flagged creator/assignee is blocked,
--     and a flagged non-owner is allowed. All other edit branches unchanged.
--
-- Applied to the live project on 2026-05-30.

ALTER TABLE public.role_templates
  ADD COLUMN IF NOT EXISTS can_close_cases boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.cw_can_close_case()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_prole text; v_role text; v_extra_raw jsonb; v_extra jsonb := '[]'::jsonb;
BEGIN
  IF private.is_manager() THEN RETURN true; END IF;   -- manager/admin/super_admin
  SELECT lower(coalesce(custom_role, role)), lower(role), extra_roles
    INTO v_prole, v_role, v_extra_raw
    FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
  IF v_prole IS NULL THEN RETURN false; END IF;

  -- Primary / custom role flagged?
  IF EXISTS (SELECT 1 FROM public.role_templates rt
             WHERE rt.can_close_cases = true
               AND lower(rt.name) IN (v_prole, v_role)) THEN
    RETURN true;
  END IF;

  -- extra_roles (jsonb array, possibly double-encoded legacy string).
  BEGIN
    IF v_extra_raw IS NULL THEN v_extra := '[]'::jsonb;
    ELSIF jsonb_typeof(v_extra_raw) = 'array'  THEN v_extra := v_extra_raw;
    ELSIF jsonb_typeof(v_extra_raw) = 'string' THEN
      v_extra := COALESCE(NULLIF(v_extra_raw #>> '{}', '')::jsonb, '[]'::jsonb);
    ELSE v_extra := '[]'::jsonb;
    END IF;
    IF jsonb_typeof(v_extra) <> 'array' THEN v_extra := '[]'::jsonb; END IF;
  EXCEPTION WHEN others THEN v_extra := '[]'::jsonb;
  END;

  RETURN EXISTS (
    SELECT 1 FROM public.role_templates rt
    JOIN jsonb_array_elements_text(v_extra) AS x(rolename) ON lower(x.rolename) = lower(rt.name)
    WHERE rt.can_close_cases = true
  );
END $$;
REVOKE EXECUTE ON FUNCTION public.cw_can_close_case() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.cw_can_close_case() TO authenticated;

CREATE OR REPLACE FUNCTION public.cf_enforce_edit_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE v_name text; v_is_mgr boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;

  -- Close-gate: transitioning a case INTO 'closed' requires close permission,
  -- regardless of ownership. Blocks non-flagged owners and allows flagged
  -- non-owners to close.
  IF (OLD.status IS DISTINCT FROM 'closed') AND (NEW.status = 'closed') THEN
    IF public.cw_can_close_case() THEN
      RETURN NEW;
    ELSE
      RAISE EXCEPTION 'You do not have permission to close cases. Ask an admin to grant your role the close-case permission.'
        USING errcode = '42501';
    END IF;
  END IF;

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
