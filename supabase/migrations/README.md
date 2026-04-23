# Database migrations

One file per schema change. Filename convention:
`YYYYMMDDHHMMSS_short_snake_case_description.sql`

Timestamp = when the change was first applied to the production
database (`cvrmadmzzualqukxxlro`). They're sorted lexicographically,
which matches apply order.

## Apply order

| File | Applied | Notes |
|---|---|---|
| `20260418015259_initial_schema.sql` | 2026-04-18 | Initial tables: employees, machines, time_sessions, inventory, BOM, traceability, QC, etc. |
| `20260421212717_bom_qty_basis.sql` | 2026-04-21 | Adds `qty_basis` column to `bom` (per_aligner \| per_case). |
| `20260421215505_supabase_auth_login.sql` | 2026-04-21 | Move login to Supabase Auth (bcrypt); drop plaintext password column. |
| `20260422000850_new_project_auth_and_employees.sql` | 2026-04-22 | Project-migration setup on `cvrmadmzzualqukxxlro`: auth hooks + seed employees. |
| `20260423162240_enable_rls_and_lock_down_definers.sql` | 2026-04-23 | Enable RLS on all 45 public tables + auth-only policy, switch 4 views to `security_invoker`, pin `search_path` on 17 functions, add `lookup_login_email` RPC. |

## Running locally with the Supabase CLI

```bash
supabase link --project-ref cvrmadmzzualqukxxlro
supabase db push          # applies only migrations not yet in supabase_migrations.schema_migrations
```

The 4 pre-2026-04-23 files were applied by hand via the Dashboard
SQL editor before this convention was set up. They're kept here
for the audit trail and to seed a fresh environment from scratch.
All are written idempotently (`IF NOT EXISTS`, `ON CONFLICT`, etc.)
so re-running is safe.
