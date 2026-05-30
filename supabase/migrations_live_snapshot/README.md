# Live database snapshot — catch-up migrations

These `.sql` files are a **faithful export of migrations that exist in the live
Supabase project** (`cvrmadmzzualqukxxlro`) but were **missing from
`supabase/migrations/`**. They were pulled verbatim from the database's own
migration history (`supabase_migrations.schema_migrations`) on **2026-05-30**.

## Why this folder exists

The repo's `supabase/migrations/` folder and the live database had **drifted**:
the live project carried changes that were applied directly (via the dashboard /
MCP) and never committed. If someone rebuilt the database purely from
`supabase/migrations/`, these changes would have been silently lost.

The files are filenamed `<live_version>_<name>.sql`, using the live migration
version (timestamp) and name, so they sort chronologically.

## What's captured here (26 migrations)

- **Security hardening** (`20260506*`): moved `pg_net` to the `extensions`
  schema, relocated `SECURITY DEFINER` helpers into a `private` schema with
  thin public wrappers, and rewrote permissive `USING (true)` RLS policies.
- **Access tiers** (`20260522145116_access_tiers_super_admin_admin_user`):
  the Super Admin > Admin > User model. `private.is_manager()` recognises
  `manager`/`admin`/`super_admin`; adds `private.is_super_admin()`; restricts
  role-catalog and employee-deletion to Super Admin.
- **Inventory / requisitions / purchase orders** (`20260521*`, `20260522064117`):
  `bom.qty_basis`, the `generate_auto_requisitions()` evolution, the
  `purchase_orders` tables + auto PO-number trigger, supplier CC emails.
- **Customer-feedback ball-in-court** (`20260527*`): the `next_action_by`
  column and the `flip_cf_next_action_on_chat()` trigger that moves the ball
  when the other party replies in chat, including the role-aware version.
- A couple of `cw_can_see_case()` corrections and the `chat_media` bucket.

## ⚠️ Do not blindly re-run against the live DB

These are **already applied** to the live project. They live in a separate
folder (not `supabase/migrations/`) on purpose: the repo's existing migration
lineage uses **different version numbers**, so mixing the two sets into one
folder could double-apply objects on a clean `supabase db reset`.

## Recommended long-term fix

Going forward, treat the live database as the source of truth and use the
Supabase CLI to keep the repo in sync:

```bash
supabase link --project-ref cvrmadmzzualqukxxlro
supabase db pull          # regenerates the full migration history from live
```

That reconciles the two lineages properly. Until then, this folder is the
record of what the live database contains beyond `supabase/migrations/`.
