alter table public.bom
  add column if not exists qty_basis text not null default 'per_aligner';

alter table public.bom
  drop constraint if exists bom_qty_basis_chk;

alter table public.bom
  add constraint bom_qty_basis_chk check (qty_basis in ('per_aligner','per_case'));
