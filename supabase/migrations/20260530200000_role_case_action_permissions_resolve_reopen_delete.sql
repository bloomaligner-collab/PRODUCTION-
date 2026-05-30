-- 20260530200000_role_case_action_permissions_resolve_reopen_delete.sql
--
-- Extends the per-role case permissions (after can_close_cases) with
-- resolve / reopen / delete. ADDITIVE model: these GRANT access on top of the
-- existing owner/admin rules — a flagged non-owner gains the ability; nobody
-- who could already act loses it. Delete also becomes role-grantable.
--
--   · role_templates.can_resolve_cases / can_reopen_cases / can_delete_cases
--   · cw_user_has_case_perm(p_perm) — generic: full-access tiers, or any held
--     role (primary/custom/extra) flagged for that perm. p_perm ∈
--     ('close','resolve','reopen','delete').
--   · cw_can_delete_case() — thin wrapper for the delete perm.
--   · cf_delete policy now: cw_is_manager() OR a role flagged can_delete.
--   · cf_enforce_edit_owner() gains GRANT-only resolve/reopen branches (never
--     block an owner); the strict close-gate is unchanged.
--
-- Applied to the live project on 2026-05-30.

ALTER TABLE public.role_templates
  ADD COLUMN IF NOT EXISTS can_resolve_cases boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_reopen_cases  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_delete_cases  boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.cw_user_has_case_perm(p_perm text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_prole text; v_role text; v_extra_raw jsonb; v_extra jsonb := '[]'::jsonb;
  v_held text[];
BEGIN
  IF private.is_manager() THEN RETURN true; END IF;
  SELECT lower(coalesce(custom_role, role)), lower(role), extra_roles
    INTO v_prole, v_role, v_extra_raw
    FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
  IF v_prole IS NULL THEN RETURN false; END IF;

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

  v_held := ARRAY[v_prole, v_role]
            || COALESCE((SELECT array_agg(lower(x)) FROM jsonb_array_elements_text(v_extra) AS t(x)), ARRAY[]::text[]);

  RETURN EXISTS (
    SELECT 1 FROM public.role_templates rt
    WHERE lower(rt.name) = ANY(v_held)
      AND CASE p_perm
            WHEN 'close'   THEN rt.can_close_cases
            WHEN 'resolve' THEN rt.can_resolve_cases
            WHEN 'reopen'  THEN rt.can_reopen_cases
            WHEN 'delete'  THEN rt.can_delete_cases
            ELSE false
          END
  );
END $$;
REVOKE EXECUTE ON FUNCTION public.cw_user_has_case_perm(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.cw_user_has_case_perm(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.cw_can_delete_case()
RETURNS boolean LANGUAGE sql STABLE
SET search_path TO 'public', 'pg_temp'
AS $$ SELECT public.cw_user_has_case_perm('delete') $$;
REVOKE EXECUTE ON FUNCTION public.cw_can_delete_case() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.cw_can_delete_case() TO authenticated;

DROP POLICY IF EXISTS cf_delete ON public.customer_feedback;
CREATE POLICY cf_delete ON public.customer_feedback
  FOR DELETE TO authenticated
  USING (public.cw_is_manager() OR public.cw_user_has_case_perm('delete'));

CREATE OR REPLACE FUNCTION public.cf_enforce_edit_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE v_name text; v_is_mgr boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;

  -- Close-gate (strict): closing requires close permission, regardless of owner.
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

  -- (a2) Resolve by a flagged role (additive grant).
  IF NEW.status = 'resolved' AND OLD.status IS DISTINCT FROM 'resolved'
     AND public.cw_user_has_case_perm('resolve') THEN
    RETURN NEW;
  END IF;

  -- (a3) Reopen by a flagged role (additive grant).
  IF (OLD.status IN ('resolved','closed')) AND (NEW.status IN ('open','in_progress'))
     AND public.cw_user_has_case_perm('reopen') THEN
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
