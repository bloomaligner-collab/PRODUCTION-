-- 20260518100000_chat_hardening_and_push.sql
--
-- (1) Replace the permissive chat_messages policy with real RLS so a
--     logged-in user can only READ:
--       • group messages (recipient_id NULL, case_id NULL)
--       • direct messages they sent or received
--       • case threads for cases they're assigned (person/role) — or
--         any manager.
--     INSERT is locked to sending as yourself, in a thread you may use.
--
-- (2) push_subscriptions table for Web Push (owner-only via RLS; the
--     Edge Function reads it with the service-role key).
--
-- Helpers are SECURITY DEFINER so the policies can read employees /
-- customer_feedback regardless of those tables' own RLS.

-- ── Helpers ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.cw_emp_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp AS $$
  SELECT id FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.cw_is_manager()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp AS $$
  SELECT COALESCE(
    (SELECT role = 'manager' FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1),
    false)
$$;

CREATE OR REPLACE FUNCTION public.cw_can_see_case(p_case uuid)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public, pg_temp AS $$
DECLARE
  v_name text; v_prole text; v_role text; v_extra_txt text;
  v_extra jsonb := '[]'::jsonb;
  v_assigned text; v_key text;
BEGIN
  SELECT name, lower(coalesce(custom_role, role)), lower(role), extra_roles::text
    INTO v_name, v_prole, v_role, v_extra_txt
  FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
  IF v_name IS NULL THEN RETURN false; END IF;
  IF (SELECT role = 'manager' FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1)
  THEN RETURN true; END IF;

  SELECT assigned_to INTO v_assigned FROM public.customer_feedback WHERE id = p_case;
  IF v_assigned IS NULL THEN RETURN false; END IF;

  IF v_assigned NOT LIKE 'role:%' THEN
    RETURN v_assigned = v_name;
  END IF;

  v_key := lower(substr(v_assigned, 6));
  IF v_key = v_prole OR v_key = v_role THEN RETURN true; END IF;
  BEGIN
    v_extra := COALESCE(NULLIF(v_extra_txt, '')::jsonb, '[]'::jsonb);
  EXCEPTION WHEN others THEN v_extra := '[]'::jsonb;
  END;
  RETURN EXISTS (
    SELECT 1 FROM jsonb_array_elements_text(v_extra) AS x
    WHERE lower(x) = v_key
  );
END $$;

REVOKE EXECUTE ON FUNCTION public.cw_emp_id(), public.cw_is_manager(),
  public.cw_can_see_case(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cw_emp_id(), public.cw_is_manager(),
  public.cw_can_see_case(uuid) TO authenticated;

-- ── chat_messages: strict policies ────────────────────────────────────
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chat_messages_authenticated_all ON public.chat_messages;
DROP POLICY IF EXISTS chat_messages_select ON public.chat_messages;
DROP POLICY IF EXISTS chat_messages_insert ON public.chat_messages;
DROP POLICY IF EXISTS chat_messages_modify ON public.chat_messages;

CREATE POLICY chat_messages_select ON public.chat_messages
  FOR SELECT TO authenticated
  USING (
    public.cw_is_manager()
    OR (recipient_id IS NULL AND case_id IS NULL)
    OR (case_id IS NOT NULL AND public.cw_can_see_case(case_id))
    OR (recipient_id IS NOT NULL AND
        (sender_id = public.cw_emp_id() OR recipient_id = public.cw_emp_id()))
  );

CREATE POLICY chat_messages_insert ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = public.cw_emp_id()
    AND (
      (recipient_id IS NULL AND case_id IS NULL)
      OR (case_id IS NOT NULL AND public.cw_can_see_case(case_id))
      OR (recipient_id IS NOT NULL AND case_id IS NULL)
    )
  );

CREATE POLICY chat_messages_modify ON public.chat_messages
  FOR ALL TO authenticated
  USING (public.cw_is_manager() OR sender_id = public.cw_emp_id())
  WITH CHECK (public.cw_is_manager() OR sender_id = public.cw_emp_id());

-- ── push_subscriptions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES public.employees(id) ON DELETE CASCADE,
  endpoint    text NOT NULL UNIQUE,
  p256dh      text NOT NULL,
  auth        text NOT NULL,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS push_subscriptions_emp_idx
  ON public.push_subscriptions (employee_id);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS push_subscriptions_owner ON public.push_subscriptions;
CREATE POLICY push_subscriptions_owner ON public.push_subscriptions
  FOR ALL TO authenticated
  USING (employee_id = public.cw_emp_id())
  WITH CHECK (employee_id = public.cw_emp_id());
