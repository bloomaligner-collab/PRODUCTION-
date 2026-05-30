alter table public.suppliers add column if not exists cc_emails text;
comment on column public.suppliers.cc_emails is 'Comma/semicolon-separated addresses CC''d on this supplier''s purchase-order emails.';
