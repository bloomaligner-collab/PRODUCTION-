# Supabase — migrate to `cvrmadmzzualqukxxlro`

Step-by-step runbook to finish moving the app from
`onjbwhkmmtqnymhjnplw` (free) to `cvrmadmzzualqukxxlro` (Pro).

Run steps in order. Do not merge PR #6 (the code flip) until step 3 is done.

---

## 1. Auth + employees (so login works)

Open the Supabase SQL editor for the new project:

https://supabase.com/dashboard/project/cvrmadmzzualqukxxlro/sql/new

Paste the contents of `migrations/new_project_auth_and_employees.sql`
and click **Run**. This creates the `imad@cedarwings.local` and
`kamal@cedarwings.local` auth users with the SAME bcrypt hashes, so
`imad` / `cedarwings123` keeps working.

Verify at the bottom of the results — you should see the two employees
with `has_password = true`.

---

## 2. Business data (optional — if you want the old data on the new project)

Fastest safe path is `pg_dump` → `psql`:

```bash
# Get connection strings from Dashboard → Settings → Database → Connection string (URI)
# Use the "Session" pooler or direct connection; NOT the transaction pooler for dumps.

OLD="postgresql://postgres:OLD_PWD@db.onjbwhkmmtqnymhjnplw.supabase.co:5432/postgres"
NEW="postgresql://postgres:NEW_PWD@db.cvrmadmzzualqukxxlro.supabase.co:5432/postgres"

# Dump only the Cedarwings tables from public (excludes coop_*, irr_*, etc.)
pg_dump "$OLD" \
  --data-only --no-owner --no-privileges \
  --table=public.employees \
  --table=public.bom \
  --table=public.suppliers \
  --table=public.machines \
  --table=public.inventory_items \
  --table=public.inventory_locations \
  --table=public.inventory_lots \
  --table=public.inventory_requisitions \
  --table=public.inventory_stock_history \
  --table=public.bloom_cases \
  --table=public.bloom_case_snapshots \
  --table=public.bloom_aligner_details \
  --table=public.bloom_imports \
  --table=public.bloom_sync_log \
  --table=public.cases \
  --table=public.customer_feedback \
  --table=public.machine_consumable_loads \
  --table=public.machine_lot_assignments \
  --table=public.material_consumption_log \
  --table=public.material_yield_rules \
  --table=public.non_conformity_reports \
  --table=public.order_step_tracking \
  --table=public.production_entries \
  --table=public.production_lots \
  --table=public.production_records \
  --table=public.production_reminders \
  --table=public.quality_controls \
  --table=public.role_templates \
  --table=public.settings \
  --table=public.system_settings \
  --table=public.time_sessions \
  --table=public.yield_rules \
  -f cedarwings_data.sql

# Load into the new project
psql "$NEW" -f cedarwings_data.sql
```

If some tables don't exist on the new project yet, `pg_dump` will skip
them silently with `--if-exists` style errors. Adjust the `--table=`
list to match what's actually on the new project.

---

## 3. Edge functions (so `admin-user`, `bloom-sync`, etc. work)

You have 11 edge functions on the old project:

```
admin-user            — (already saved in supabase/functions/admin-user/)
bloom-sync            — periodic Bloom API pull
bloom-webhook         — Bloom push webhook
bloom-aligners-full   — manual aligner backfill
bloom-backfill-aligners
bloom-fetch-one
bloom-test-endpoint
get-inventory-items   — read-only inventory listing used by inventory.html
notify-citizen        — (looks like another app's — skip unless yours)
rapid-responder       — (same — verify if yours)
gh-upload             — (same — verify)
```

### 3a. Download each function's source from the old project

```bash
supabase login
supabase link --project-ref onjbwhkmmtqnymhjnplw
supabase functions download admin-user
supabase functions download bloom-sync
supabase functions download bloom-webhook
supabase functions download bloom-aligners-full
supabase functions download bloom-backfill-aligners
supabase functions download bloom-fetch-one
supabase functions download bloom-test-endpoint
supabase functions download get-inventory-items
# Skip notify-citizen / rapid-responder / gh-upload unless they're yours.
```

This populates `supabase/functions/<name>/index.ts` for each one.

### 3b. Redeploy onto the new project

```bash
supabase link --project-ref cvrmadmzzualqukxxlro
for fn in admin-user bloom-sync bloom-webhook bloom-aligners-full \
          bloom-backfill-aligners bloom-fetch-one bloom-test-endpoint \
          get-inventory-items; do
  supabase functions deploy "$fn" --project-ref cvrmadmzzualqukxxlro
done
```

### 3c. Set edge-function secrets on the new project

```bash
# Rotate the Bloom token first at Bloom support (the old token was
# committed to the repo — treat it as compromised).
supabase secrets set BLOOM_API_TOKEN=<the_new_bloom_token> \
  --project-ref cvrmadmzzualqukxxlro
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by
Supabase into every edge function — no manual setting needed.

---

## 4. Flip the code (merge PR #6)

Only once steps 1–3 above are green.

After merging, hard-refresh the deployed site (Ctrl+Shift+R). Sign in
with `imad` / `cedarwings123`. Open devtools → Network → confirm calls
go to `cvrmadmzzualqukxxlro.supabase.co` (not the old URL).

---

## 5. Re-point external integrations

- Any Bloom webhook on Bloom's side that currently POSTs to
  `https://onjbwhkmmtqnymhjnplw.supabase.co/functions/v1/bloom-webhook`
  needs to be updated to the new URL.
- Any `pg_cron` jobs that were set up on the old project need to be
  recreated on the new one. Example:
  ```sql
  SELECT cron.schedule(
    'bloom-sync-every-5min', '*/5 * * * *',
    $$SELECT net.http_post(
        url := 'https://cvrmadmzzualqukxxlro.supabase.co/functions/v1/bloom-sync',
        headers := '{"Authorization": "Bearer YOUR_NEW_ANON_KEY"}'::jsonb
      )$$
  );
  ```

---

## 6. Retire the old project

Once the new one has been stable for a few days and no traffic is
going to `onjbwhkmmtqnymhjnplw`, pause or delete that project to avoid
further billing / accidental writes.
