-- ═════════════════════════════════════════════════════════════════
-- Cedarwings Customer Feedback Module — Supabase schema bootstrap
-- ═════════════════════════════════════════════════════════════════
-- Paste this whole file into the SQL editor of the TARGET Supabase
-- project. Idempotent: safe to re-run. Creates only what's missing.
-- ═════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────
-- 1. employees — lightweight HR table the notifier resolves against
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.employees (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  username            TEXT UNIQUE,
  email               TEXT,
  phone               TEXT,
  whatsapp_phone      TEXT,
  role                TEXT DEFAULT 'employee',            -- 'manager' / 'employee'
  custom_role         TEXT,                               -- e.g. 'quality_control'
  extra_roles         JSONB DEFAULT '[]'::jsonb,          -- additional role keys
  is_active           BOOLEAN NOT NULL DEFAULT true,
  auth_user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notification_prefs  JSONB NOT NULL DEFAULT '{"email": true, "whatsapp": true, "sms": true}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS employees_name_idx        ON public.employees (lower(name));
CREATE INDEX IF NOT EXISTS employees_auth_user_idx   ON public.employees (auth_user_id);


-- ─────────────────────────────────────────────────────────────────
-- 2. customer_feedback — the register itself
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.customer_feedback (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_no            TEXT,
  received_date          DATE,
  type                   TEXT,     -- 'complaint' | 'feedback' | 'suggestion' | 'warranty' | 'inquiry' | 'return' | 'service_request'
  category               TEXT,     -- 'product_quality' | 'delivery' | 'fitting' | 'packaging' | 'communication' | 'documentation' | 'traceability' | 'billing' | 'other'
  customer_name          TEXT,
  doctor                 TEXT,
  case_id                TEXT,
  order_no               TEXT,
  severity               TEXT DEFAULT 'medium',  -- 'low' | 'medium' | 'high' | 'critical'
  status                 TEXT DEFAULT 'open',    -- 'open' | 'in_progress' | 'resolved' | 'closed'
  description            TEXT,
  notes                  TEXT,                   -- root cause
  resolution             TEXT,
  assigned_to            TEXT,                   -- direct name OR 'role:xxx'
  received_by            TEXT,                   -- creator
  resolved_at            TIMESTAMPTZ,
  last_viewed_by         TEXT,
  last_viewed_at         TIMESTAMPTZ,
  last_edited_by         TEXT,
  last_edited_at         TIMESTAMPTZ,
  notification_seen_by   TEXT,
  notification_seen_at   TIMESTAMPTZ,
  follow_up_date         DATE,
  follow_up_note         TEXT,
  follow_up_assignee     TEXT,
  follow_up_done_at      TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS customer_feedback_status_idx   ON public.customer_feedback (status);
CREATE INDEX IF NOT EXISTS customer_feedback_assigned_idx ON public.customer_feedback (assigned_to);
CREATE INDEX IF NOT EXISTS customer_feedback_date_idx     ON public.customer_feedback (received_date DESC);


-- ─────────────────────────────────────────────────────────────────
-- 3. system_settings — key/value store for Brevo + Twilio config
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.system_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────────
-- 4. notification_log — every email / WhatsApp / SMS attempt
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notification_log (
  id           BIGSERIAL PRIMARY KEY,
  sent_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type         TEXT,
  channel      TEXT,       -- 'email' | 'whatsapp' | 'sms'
  recipient    TEXT,
  subject      TEXT,
  message      TEXT,
  status       TEXT,       -- 'sent' | 'failed'
  error_msg    TEXT
);
CREATE INDEX IF NOT EXISTS notification_log_time_idx ON public.notification_log (sent_at DESC);


-- ─────────────────────────────────────────────────────────────────
-- 5. notification_settings — per-manager notification routing
--    (used by brevo.js's CW_Notify.notifyAll)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name    TEXT,
  email            TEXT,
  whatsapp_phone   TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  events           JSONB DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────────
-- 6. user_views — per-user saved-filter presets for any page
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  page        TEXT NOT NULL,
  name        TEXT NOT NULL,
  filters     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS user_views_user_page_idx ON public.user_views (user_id, page, created_at);

CREATE OR REPLACE FUNCTION public.user_views_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$ BEGIN NEW.updated_at := NOW(); RETURN NEW; END; $$;
DROP TRIGGER IF EXISTS user_views_updated_at ON public.user_views;
CREATE TRIGGER user_views_updated_at
  BEFORE UPDATE ON public.user_views
  FOR EACH ROW EXECUTE FUNCTION public.user_views_set_updated_at();


-- ─────────────────────────────────────────────────────────────────
-- 7. audit_log — ISO 13485 §4.2.5 traceability of mutations
--    (optional but strongly recommended for regulated workflows)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id           BIGSERIAL PRIMARY KEY,
  at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_uid    UUID,
  actor_email  TEXT,
  actor_role   TEXT,
  table_name   TEXT NOT NULL,
  record_pk    TEXT,
  op           TEXT NOT NULL CHECK (op IN ('INSERT','UPDATE','DELETE')),
  old_data     JSONB,
  new_data     JSONB
);
CREATE INDEX IF NOT EXISTS audit_log_at_idx    ON public.audit_log (at DESC);
CREATE INDEX IF NOT EXISTS audit_log_table_idx ON public.audit_log (table_name, at DESC);

CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  pk_val       TEXT;
  caller_email TEXT;
  caller_role  TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    pk_val := COALESCE((to_jsonb(OLD)->>'id'),(to_jsonb(OLD)->>'key'),(to_jsonb(OLD)->>'case_id'));
  ELSE
    pk_val := COALESCE((to_jsonb(NEW)->>'id'),(to_jsonb(NEW)->>'key'),(to_jsonb(NEW)->>'case_id'));
  END IF;
  SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();
  SELECT role  INTO caller_role  FROM public.employees WHERE auth_user_id = auth.uid() LIMIT 1;
  INSERT INTO public.audit_log (actor_uid, actor_email, actor_role, table_name, record_pk, op, old_data, new_data)
  VALUES (auth.uid(), caller_email, caller_role, TG_TABLE_NAME, pk_val, TG_OP,
          CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
          CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END);
  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END; $$;

DROP TRIGGER IF EXISTS audit_trigger ON public.customer_feedback;
CREATE TRIGGER audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.customer_feedback
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();


-- ─────────────────────────────────────────────────────────────────
-- 8. is_manager() — RLS helper for manager-only operations
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.auth_user_id = auth.uid()
      AND COALESCE(e.is_active, true) = true
      AND e.role = 'manager'
  )
$$;
REVOKE EXECUTE ON FUNCTION public.is_manager() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_manager() TO authenticated;


-- ─────────────────────────────────────────────────────────────────
-- 9. lookup_login_email() — pre-auth username → email resolver
--    Used by index.html's login flow so users can type a short
--    username instead of their email.
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.lookup_login_email(p_username text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT email
    FROM public.employees
   WHERE lower(username) = lower(p_username)
     AND COALESCE(is_active, true) = true
   LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.lookup_login_email(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.lookup_login_email(text) TO anon, authenticated;
