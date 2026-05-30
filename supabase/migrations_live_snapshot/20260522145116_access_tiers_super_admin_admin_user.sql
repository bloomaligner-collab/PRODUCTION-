-- Professional access tiers: Super Admin > Admin > User.
-- Functional role templates (role_templates) continue to drive page access;
-- these tiers govern privilege (write power + user/role management).

-- Manager-level write power now spans every admin tier.
create or replace function private.is_manager()
returns boolean language sql stable security definer
set search_path to 'public','pg_temp' as $$
  select exists (
    select 1 from public.employees
    where auth_user_id = auth.uid()
      and role in ('manager','admin','super_admin')
  )
$$;

-- Top tier: full control incl. user/role management and destructive ops.
create or replace function private.is_super_admin()
returns boolean language sql stable security definer
set search_path to 'public','pg_temp' as $$
  select exists (
    select 1 from public.employees
    where auth_user_id = auth.uid()
      and role = 'super_admin'
  )
$$;

create or replace function public.is_super_admin()
returns boolean language sql stable
set search_path to 'public','pg_temp' as $$
  select private.is_super_admin()
$$;

-- Role catalog (role_templates): only Super Admin may change it.
drop policy if exists role_templates_manager_insert on public.role_templates;
drop policy if exists role_templates_manager_update on public.role_templates;
drop policy if exists role_templates_manager_delete on public.role_templates;
create policy role_templates_superadmin_insert on public.role_templates
  for insert to public with check (private.is_super_admin());
create policy role_templates_superadmin_update on public.role_templates
  for update to public using (private.is_super_admin()) with check (private.is_super_admin());
create policy role_templates_superadmin_delete on public.role_templates
  for delete to public using (private.is_super_admin());

-- Employees: only Super Admin may delete a person.
drop policy if exists employees_manager_delete on public.employees;
create policy employees_superadmin_delete on public.employees
  for delete to public using (private.is_super_admin());

-- Employees insert/update: Admins manage regular Users; only a Super Admin
-- may create/edit/elevate anyone holding an elevated tier (admin/super_admin/
-- legacy manager). Prevents an Admin from minting or promoting admins.
drop policy if exists employees_manager_insert on public.employees;
drop policy if exists employees_manager_update on public.employees;
create policy employees_admin_insert on public.employees
  for insert to public
  with check (
    private.is_manager()
    and (role = 'employee' or private.is_super_admin())
  );
create policy employees_admin_update on public.employees
  for update to public
  using (
    private.is_manager()
    and (role = 'employee' or private.is_super_admin())
  )
  with check (
    private.is_manager()
    and (role = 'employee' or private.is_super_admin())
  );

-- Promote the two owners to Super Admin.
update public.employees set role = 'super_admin' where name in ('Imad','Sahar');
