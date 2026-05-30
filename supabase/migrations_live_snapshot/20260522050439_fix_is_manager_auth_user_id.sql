create or replace function private.is_manager()
returns boolean language sql stable security definer
set search_path to 'public','pg_temp' as $$
  select exists (
    select 1 from public.employees
    where auth_user_id = auth.uid() and role in ('manager','super_admin')
  )
$$;
