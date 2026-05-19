-- 20260519180000_cw_can_see_case_creator_participants.sql
--
-- Widen case-discussion access (ADDITIVE — only grants more, never
-- removes): in addition to managers / the assignee (person or role
-- member), a case's chat is now visible to
--   • the complaint creator (customer_feedback.received_by), and
--   • anyone who has already posted in that case thread,
-- so a participant keeps access even after the case is reassigned.
--
-- Builds on the earlier extra_roles double-encoding fix. The
-- chat_messages read inside this SECURITY DEFINER function is safe:
-- the function is owned by a role that bypasses RLS, so it does not
-- re-enter chat_messages' policy (no recursion — verified in prod).
--
-- Applied to cvrmadmzzualqukxxlro on 2026-05-19.

CREATE OR REPLACE FUNCTION public.cw_can_see_case(p_case uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_name text; v_prole text; v_role text; v_emp uuid;
  v_extra_raw jsonb;
  v_extra jsonb := '[]'::jsonb;
  v_assigned text; v_key text;
BEGIN
  SELECT id, name, lower(coalesce(custom_role, role)), lower(role), extra_roles
    INTO v_emp, v_name, v_prole, v_role, v_extra_raw
  FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
  IF v_name IS NULL THEN RETURN false; END IF;
  IF (SELECT role = 'manager' FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1)
  THEN RETURN true; END IF;

  -- The complaint creator always retains access to its discussion.
  IF EXISTS (SELECT 1 FROM public.customer_feedback
             WHERE id = p_case AND received_by = v_name) THEN
    RETURN true;
  END IF;

  -- Anyone who has posted in this case thread keeps access, even if
  -- the case is later reassigned away from them.
  IF v_emp IS NOT NULL AND EXISTS (
       SELECT 1 FROM public.chat_messages
       WHERE case_id = p_case AND sender_id = v_emp) THEN
    RETURN true;
  END IF;

  SELECT assigned_to INTO v_assigned FROM public.customer_feedback WHERE id = p_case;
  IF v_assigned IS NULL THEN RETURN false; END IF;

  IF v_assigned NOT LIKE 'role:%' THEN
    RETURN v_assigned = v_name;
  END IF;

  v_key := lower(substr(v_assigned, 6));
  IF v_key = v_prole OR v_key = v_role THEN RETURN true; END IF;

  BEGIN
    IF v_extra_raw IS NULL THEN
      v_extra := '[]'::jsonb;
    ELSIF jsonb_typeof(v_extra_raw) = 'array' THEN
      v_extra := v_extra_raw;
    ELSIF jsonb_typeof(v_extra_raw) = 'string' THEN
      v_extra := COALESCE(NULLIF(v_extra_raw #>> '{}', '')::jsonb, '[]'::jsonb);
    ELSE
      v_extra := '[]'::jsonb;
    END IF;
    IF jsonb_typeof(v_extra) <> 'array' THEN v_extra := '[]'::jsonb; END IF;
  EXCEPTION WHEN others THEN
    v_extra := '[]'::jsonb;
  END;

  RETURN EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(v_extra) AS x
    WHERE lower(x) = v_key
  );
END $function$;
