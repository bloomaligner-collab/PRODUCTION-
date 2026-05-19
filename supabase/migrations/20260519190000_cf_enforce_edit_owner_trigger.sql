-- 20260519190000_cf_enforce_edit_owner_trigger.sql
--
-- Hard-enforce (DB-level, can't be bypassed from the client) that only
-- the complaint creator, the assignee (person or role member), or a
-- manager may edit a complaint's content — WITHOUT breaking the
-- "Take over" feature. A plain restrictive RLS UPDATE policy would
-- block take-over (a non-owner reassigning the case to themselves) and
-- block the follow-up owner from marking their follow-up done, so this
-- is done with a BEFORE UPDATE trigger that allows those narrow cases.
--
-- Allowed:
--   • manager / creator (OLD.received_by) / current assignee → anything
--   • a non-owner taking over (NEW.assigned_to resolves to them)
--   • the follow-up owner flipping only follow_up_done_at
--   • pure view/seen telemetry (last_viewed_*, notification_seen_*)
-- Server/service-role contexts (auth.uid() NULL) bypass.
--
-- Verified on prod (rolled-back transactions): creator/assignee edit,
-- take-over and telemetry succeed; a non-owner content edit raises
-- 42501. Applied to cvrmadmzzualqukxxlro on 2026-05-19.

CREATE OR REPLACE FUNCTION public.cw_user_matches_assignee(p_assigned_to text)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path TO 'public','pg_temp' AS $$
DECLARE v_name text; v_prole text; v_role text; v_extra_raw jsonb; v_extra jsonb:='[]'::jsonb; v_key text;
BEGIN
  IF p_assigned_to IS NULL THEN RETURN false; END IF;
  SELECT name, lower(coalesce(custom_role,role)), lower(role), extra_roles
    INTO v_name,v_prole,v_role,v_extra_raw
  FROM public.employees WHERE auth_user_id=auth.uid() LIMIT 1;
  IF v_name IS NULL THEN RETURN false; END IF;
  IF p_assigned_to NOT LIKE 'role:%' THEN RETURN p_assigned_to = v_name; END IF;
  v_key := lower(substr(p_assigned_to,6));
  IF v_key=v_prole OR v_key=v_role THEN RETURN true; END IF;
  BEGIN
    IF v_extra_raw IS NULL THEN v_extra:='[]'::jsonb;
    ELSIF jsonb_typeof(v_extra_raw)='array' THEN v_extra:=v_extra_raw;
    ELSIF jsonb_typeof(v_extra_raw)='string' THEN v_extra:=COALESCE(NULLIF(v_extra_raw #>> '{}','')::jsonb,'[]'::jsonb);
    ELSE v_extra:='[]'::jsonb; END IF;
    IF jsonb_typeof(v_extra)<>'array' THEN v_extra:='[]'::jsonb; END IF;
  EXCEPTION WHEN others THEN v_extra:='[]'::jsonb; END;
  RETURN EXISTS (SELECT 1 FROM jsonb_array_elements_text(v_extra) x WHERE lower(x)=v_key);
END $$;
REVOKE EXECUTE ON FUNCTION public.cw_user_matches_assignee(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cw_user_matches_assignee(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.cf_enforce_edit_owner()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public','pg_temp' AS $$
DECLARE v_name text; v_is_mgr boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  SELECT e.name, (e.role='manager') INTO v_name, v_is_mgr
  FROM public.employees e WHERE e.auth_user_id = auth.uid() LIMIT 1;

  IF v_is_mgr THEN RETURN NEW; END IF;
  IF v_name IS NOT NULL AND OLD.received_by IS NOT NULL AND OLD.received_by = v_name THEN RETURN NEW; END IF;
  IF public.cw_user_matches_assignee(OLD.assigned_to) THEN RETURN NEW; END IF;

  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to
     AND public.cw_user_matches_assignee(NEW.assigned_to) THEN
    RETURN NEW;
  END IF;

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
END $$;

DROP TRIGGER IF EXISTS cf_enforce_edit_owner_trg ON public.customer_feedback;
CREATE TRIGGER cf_enforce_edit_owner_trg
  BEFORE UPDATE ON public.customer_feedback
  FOR EACH ROW EXECUTE FUNCTION public.cf_enforce_edit_owner();
