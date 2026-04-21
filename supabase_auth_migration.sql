-- ══════════════════════════════════════════════════════════════════════
-- Cedarwings — migrate employee login to Supabase Auth
-- Run AFTER the previous migration (bom_qty_basis_migration.sql)
-- Project: onjbwhkmmtqnymhjnplw
-- ══════════════════════════════════════════════════════════════════════

-- 1. Link employees to auth.users
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Create app-auth users (separate from dashboard users).
--    Synthetic emails <username>@cedarwings.local so users still type their username.
DO $$
DECLARE
  imad_auth_id UUID;
  kamal_auth_id UUID;
BEGIN
  SELECT id INTO imad_auth_id FROM auth.users WHERE email = 'imad@cedarwings.local';
  IF imad_auth_id IS NULL THEN
    imad_auth_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token,
      email_change, email_change_token_new
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      imad_auth_id,
      'authenticated', 'authenticated',
      'imad@cedarwings.local',
      crypt('cedarwings123', gen_salt('bf', 10)),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"IMAD"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), imad_auth_id,
      jsonb_build_object('sub', imad_auth_id::text, 'email', 'imad@cedarwings.local', 'email_verified', true),
      'email', imad_auth_id::text,
      now(), now(), now()
    );
  END IF;
  UPDATE public.employees SET auth_user_id = imad_auth_id WHERE name = 'IMAD';

  SELECT id INTO kamal_auth_id FROM auth.users WHERE email = 'kamal@cedarwings.local';
  IF kamal_auth_id IS NULL THEN
    kamal_auth_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token,
      email_change, email_change_token_new
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      kamal_auth_id,
      'authenticated', 'authenticated',
      'kamal@cedarwings.local',
      crypt('cedarwings123', gen_salt('bf', 10)),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"kamal"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), kamal_auth_id,
      jsonb_build_object('sub', kamal_auth_id::text, 'email', 'kamal@cedarwings.local', 'email_verified', true),
      'email', kamal_auth_id::text,
      now(), now(), now()
    );
  END IF;
  UPDATE public.employees SET auth_user_id = kamal_auth_id WHERE name = 'kamal';
END $$;

-- 3. Drop plaintext password column (bcrypt hashes live in auth.users now)
ALTER TABLE public.employees DROP COLUMN IF EXISTS password;

-- 4. Enable RLS on employees, add authenticated-only policy, revoke anon write
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='employees' AND policyname='employees_authenticated_all') THEN
    CREATE POLICY employees_authenticated_all
      ON public.employees FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;
END $$;

REVOKE ALL ON public.employees FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
