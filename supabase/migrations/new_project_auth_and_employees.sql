-- ══════════════════════════════════════════════════════════════════════
-- Cedarwings — auth + employees migration to cvrmadmzzualqukxxlro
-- Run this in Supabase SQL editor for the NEW project AFTER the schema
-- (bloom_*, bom, employees, inventory_*, etc.) is already in place.
--
-- Purpose: populate auth.users + auth.identities + employees so that
--          `imad` / `cedarwings123` and `kamal` / `cedarwings123` can
--          log in on the new project with the SAME bcrypt hashes that
--          were on the old project. Employee UUIDs and auth_user_id
--          links are preserved so nothing in business data breaks.
--
-- Prerequisites on the new project:
--   1. employees table has auth_user_id UUID column (see
--      supabase_auth_migration.sql for the ALTER if missing).
--   2. pgcrypto extension enabled (it is, by default, in Supabase).
--
-- Safe to re-run: every INSERT uses ON CONFLICT DO NOTHING / UPDATE.
-- ══════════════════════════════════════════════════════════════════════

-- ── 1. auth.users ─────────────────────────────────────────────────────
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change, email_change_token_new
) VALUES
(
  '00000000-0000-0000-0000-000000000000',
  '4d5b272b-be16-40a1-a6af-9c3eb3aa8c15',
  'authenticated', 'authenticated',
  'imad@cedarwings.local',
  '$2a$10$sUyz.O4l6T3e7XkgwnA5vOkC6YX0NsxqKswK8TVI.DbQJp45A.zqu',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"IMAD"}'::jsonb,
  now(), now(), '', '', '', ''
),
(
  '00000000-0000-0000-0000-000000000000',
  '464c762c-1c4b-4fd8-91c7-5a746236f778',
  'authenticated', 'authenticated',
  'kamal@cedarwings.local',
  '$2a$10$.jkB.iYOLPvdqvWVNFTY2.R0MZHQmkeQv009aDMV1ITLIfDVqZNnm',
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"kamal"}'::jsonb,
  now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  updated_at = now();

-- ── 2. auth.identities (required for signInWithPassword) ──────────────
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  '4d5b272b-be16-40a1-a6af-9c3eb3aa8c15',
  '{"sub":"4d5b272b-be16-40a1-a6af-9c3eb3aa8c15","email":"imad@cedarwings.local","email_verified":true}'::jsonb,
  'email',
  '4d5b272b-be16-40a1-a6af-9c3eb3aa8c15',
  now(), now(), now()
),
(
  gen_random_uuid(),
  '464c762c-1c4b-4fd8-91c7-5a746236f778',
  '{"sub":"464c762c-1c4b-4fd8-91c7-5a746236f778","email":"kamal@cedarwings.local","email_verified":true}'::jsonb,
  'email',
  '464c762c-1c4b-4fd8-91c7-5a746236f778',
  now(), now(), now()
)
ON CONFLICT (provider, provider_id) DO NOTHING;

-- ── 3. employees (link to the auth rows above) ────────────────────────
-- If employees rows don't exist yet, create them. If they do, just
-- update auth_user_id + role/page_access so profile lookup works.
INSERT INTO public.employees (
  id, name, username, role, custom_role, pin, is_active,
  page_access, extra_roles, auth_user_id, workflow_step, created_at, updated_at
) VALUES
(
  '9459e146-806c-4685-b933-465121c998f2',
  'IMAD', 'imad', 'manager', 'manager', NULL, true,
  '["all"]'::jsonb, '[]'::jsonb,
  '4d5b272b-be16-40a1-a6af-9c3eb3aa8c15',
  NULL, now(), now()
),
(
  '0105d88a-2177-4f39-9921-fcf7dce3f957',
  'kamal', 'kamal', 'employee', 'employee', NULL, true,
  '["clocking","employee_profile"]'::jsonb, '[]'::jsonb,
  '464c762c-1c4b-4fd8-91c7-5a746236f778',
  NULL, now(), now()
)
ON CONFLICT (id) DO UPDATE SET
  auth_user_id = EXCLUDED.auth_user_id,
  username     = EXCLUDED.username,
  role         = EXCLUDED.role,
  custom_role  = EXCLUDED.custom_role,
  is_active    = EXCLUDED.is_active,
  page_access  = EXCLUDED.page_access,
  updated_at   = now();

-- ── 4. Verify ─────────────────────────────────────────────────────────
SELECT e.name, e.role, e.auth_user_id, u.email,
       u.encrypted_password IS NOT NULL AS has_password
FROM public.employees e
LEFT JOIN auth.users u ON u.id = e.auth_user_id
WHERE e.name IN ('IMAD','kamal');
