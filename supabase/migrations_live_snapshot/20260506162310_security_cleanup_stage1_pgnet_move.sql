-- Move pg_net to the 'extensions' schema
-- The cron job 'bloom-sync-every-minute' will keep working because pg_net always
-- creates its functions in the 'net' schema regardless of the extension's home schema.
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION pg_net WITH SCHEMA extensions;

-- Revoke EXECUTE on audit_trigger_fn from API-facing roles.
-- Triggers fire automatically and don't need EXECUTE grants on their function.
REVOKE EXECUTE ON FUNCTION public.audit_trigger_fn() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.audit_trigger_fn() FROM anon;
REVOKE EXECUTE ON FUNCTION public.audit_trigger_fn() FROM authenticated;
