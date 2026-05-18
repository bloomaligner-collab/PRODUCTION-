-- 20260518000000_chat_messages.sql
--
-- Team Chat feature. One flat table backs three thread kinds:
--
--   • recipient_id IS NULL  AND case_id IS NULL  → group "All Team"
--   • recipient_id = <emp>                       → 1:1 direct message
--   • case_id = <feedback>  (recipient_id NULL)  → per-case discussion
--     thread embedded in customer_feedback.html, so the whole team
--     can talk on a specific case.
--
-- Follows the project's "authenticated = trusted" RLS model (see
-- 20260423162240_enable_rls_and_lock_down_definers.sql). The browser
-- client filters DM threads in the query; RLS only enforces that the
-- caller is a logged-in user, matching every other table in this app.
--
-- Added to the supabase_realtime publication so chat.html receives
-- INSERT events and appends incoming messages live.

-- ── 1. TABLE ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  recipient_id uuid          REFERENCES public.employees(id) ON DELETE CASCADE,
  case_id      uuid          REFERENCES public.customer_feedback(id) ON DELETE CASCADE,
  body         text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- case_id may be added separately if the table predates this migration
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS case_id uuid REFERENCES public.customer_feedback(id) ON DELETE CASCADE;

-- Group feed: only true group messages (no DM, no case thread)
CREATE INDEX IF NOT EXISTS chat_messages_group_idx
  ON public.chat_messages (created_at)
  WHERE recipient_id IS NULL AND case_id IS NULL;

-- DM threads: either direction between two employees
CREATE INDEX IF NOT EXISTS chat_messages_dm_idx
  ON public.chat_messages (sender_id, recipient_id, created_at);

-- Per-case discussion thread
CREATE INDEX IF NOT EXISTS chat_messages_case_idx
  ON public.chat_messages (case_id, created_at)
  WHERE case_id IS NOT NULL;

-- ── 2. RLS (authenticated = trusted, same as every other table) ───────
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS chat_messages_authenticated_all ON public.chat_messages;
CREATE POLICY chat_messages_authenticated_all
  ON public.chat_messages
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── 3. REALTIME ───────────────────────────────────────────────────────
-- Idempotent: ALTER PUBLICATION ... ADD TABLE errors if already a
-- member, so guard with the catalog check.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END $$;
