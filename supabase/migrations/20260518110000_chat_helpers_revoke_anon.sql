-- 20260518110000_chat_helpers_revoke_anon.sql
--
-- Lock the chat RLS helper functions to signed-in users only
-- (clears the "anon can execute SECURITY DEFINER function" advisor).
-- Applied to cvrmadmzzualqukxxlro on 2026-05-18.

REVOKE EXECUTE ON FUNCTION public.cw_emp_id() FROM anon;
REVOKE EXECUTE ON FUNCTION public.cw_is_manager() FROM anon;
REVOKE EXECUTE ON FUNCTION public.cw_can_see_case(uuid) FROM anon;
