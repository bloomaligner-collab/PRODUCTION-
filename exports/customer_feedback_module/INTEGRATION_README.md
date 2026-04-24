# Customer Feedback Module — Portable Bundle

A self-contained copy of the Customer Feedback register + the full
multi-channel notification system (in-app toast / email via Brevo /
WhatsApp via Brevo / SMS via Twilio) extracted from the Cedarwings
Operations Platform.

Designed to drop into another Supabase-backed static HTML app with
minimal changes. The target repo mentioned was
`IantradingSAL/Bassoul-Heneine-sal` — this bundle lives at
`exports/customer_feedback_module/` in the Cedarwings repo. **Copy
the contents manually** into the target repo; the Cedarwings account
that built this does not have write access there.

## What's in the bundle

```
exports/customer_feedback_module/
├── INTEGRATION_README.md      ← you are here
├── pages/
│   └── customer_feedback.html ← the register page
├── shared/
│   ├── auth_guard.js          ← blocks unauthed visitors + exposes cwSignOut()
│   ├── brevo.js               ← CW_Notify.sendEmail / sendWhatsApp / sendSms
│   ├── notify_assignment.js   ← shared multi-channel fan-out
│   ├── user_views.js          ← chip-row saved filter views
│   ├── bulk_actions.js        ← multi-select + bulk operations
│   └── csv_export.js          ← downloadCsv(filename, cols, rows)
└── supabase/
    └── 01_schema.sql          ← tables, functions, triggers, RLS helpers
```

## Step-by-step integration

### 1. Target Supabase project

Create a new Supabase project (or reuse an existing one). Note the
**Project URL** and the **anon public key** — you'll paste them
into `config.js` on the target side in step 4.

### 2. Run the schema

Paste the entire contents of `supabase/01_schema.sql` into the SQL
editor of the target Supabase project and run it. Creates:

- `employees` — with `notification_prefs` JSONB column.
- `customer_feedback` — the register itself.
- `system_settings` — key/value for Brevo + Twilio credentials.
- `notification_log` — audit trail of every send.
- `notification_settings` — optional, used for notifyAll broadcasts.
- `user_views` — per-user saved filter presets.
- `audit_log` + `audit_trigger_fn()` — ISO 13485 §4.2.5 traceability.
- `is_manager()` and `lookup_login_email()` helpers.

Safe to re-run; every statement is `CREATE … IF NOT EXISTS` / `CREATE
OR REPLACE`.

### 3. Enable RLS (critical)

The schema creates tables but does **not** enable RLS. Do this
explicitly per table, matching whatever your app's security model is.
A reasonable starting point:

```sql
-- Everybody signed in can read and write customer_feedback
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY customer_feedback_authenticated_all ON public.customer_feedback
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Employees: read-all, manager-only write
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY employees_read   ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY employees_insert ON public.employees FOR INSERT TO authenticated WITH CHECK (public.is_manager());
CREATE POLICY employees_update ON public.employees FOR UPDATE TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager());
CREATE POLICY employees_delete ON public.employees FOR DELETE TO authenticated USING (public.is_manager());

-- user_views: each user sees/mutates only their own
ALTER TABLE public.user_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY uv_own_select ON public.user_views FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY uv_own_insert ON public.user_views FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY uv_own_update ON public.user_views FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY uv_own_delete ON public.user_views FOR DELETE TO authenticated USING (user_id = auth.uid());

-- audit_log: manager-only SELECT, writes only via the trigger
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_log_read ON public.audit_log FOR SELECT TO authenticated USING (public.is_manager());

-- system_settings: manager-only write
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY ss_read           ON public.system_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY ss_manager_insert ON public.system_settings FOR INSERT TO authenticated WITH CHECK (public.is_manager());
CREATE POLICY ss_manager_update ON public.system_settings FOR UPDATE TO authenticated USING (public.is_manager()) WITH CHECK (public.is_manager());
```

### 4. Copy the files

Copy from this bundle into your target repo root:

```
customer_feedback.html   (from pages/)
auth_guard.js            (from shared/)
brevo.js                 (from shared/)
notify_assignment.js     (from shared/)
user_views.js            (from shared/)
bulk_actions.js          (from shared/)
csv_export.js            (from shared/)
```

### 5. Create or update `config.js`

The page imports `./config.js` expecting:

```js
export const SUPABASE_CONFIG = {
  url:     'https://<project-ref>.supabase.co',
  anonKey: 'eyJhbGc...<your anon key>'
}
```

### 6. Dependencies the page expects

`customer_feedback.html` as-shipped references a few sibling scripts
that live in the Cedarwings repo but may not exist in the target. If
the target repo doesn't have them, either copy them over or remove
the `<script>` tags at the top of the file:

| File | What it provides | Required? |
|---|---|---|
| `access.js` | Sidebar injection + realtime toasts + Home badge | Optional — remove the `<script src="access.js…">` and strip the sidebar markup; the page still works standalone. |
| `lang.js` | Bilingual FR/EN label dictionary + `CW_HELP` panel | Optional — remove the `<script src="lang.js…">` and the help-panel `<script>` block at the bottom of the file. |
| `orders.js` | Bloom-specific case dropdown helper (`CW.orders.init`) | Optional — remove the call to `initEnOrderDD()` if present; the Bloom Case autocomplete just won't suggest cases. |
| `table_sort.js` | Click-to-sort on `<table>` headers | Optional — remove if you don't care about sortable columns. |
| `auth_guard.js` | Redirects unauthenticated visitors to `index.html` | **Required** unless your app has a different guard. |

If you rip the Cedarwings sidebar out, the page still works — it'll
just render full-width without a nav. Replace with your own layout.

### 7. Configure Brevo + Twilio

Either via raw SQL:

```sql
INSERT INTO system_settings (key, value) VALUES
  ('brevo_api_key',      'xkeysib-…'),
  ('brevo_sender_email', 'noreply@yourdomain.com'),
  ('brevo_sender_name',  'Your Company'),
  ('twilio_account_sid', 'AC…'),       -- optional, skip if no SMS
  ('twilio_auth_token',  '…'),
  ('twilio_from',        '+1555…')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

…or build a Settings page that upserts the same keys.

Any channel whose credentials aren't set is silently skipped.

### 8. Seed at least one active manager

Notifications addressed to `role:manager` resolve against
`employees.role = 'manager'`, so there must be at least one active
row:

```sql
INSERT INTO employees (name, email, phone, role, is_active, auth_user_id)
VALUES ('Admin', 'admin@yourdomain.com', '+1555…', 'manager', true,
        '<the auth.users.id of this person>');
```

### 9. Test the flow

1. Open `customer_feedback.html` as a logged-in user.
2. Click **+ Log Feedback**, fill out, assign to someone else.
3. Save. Within ~1 second:
   - That user gets an in-app toast (if they have any page open).
   - They get an email if their `employees.email` is real.
   - They get a WhatsApp if their `employees.phone` is set AND Brevo is configured.
   - They get an SMS if their `employees.phone` is set AND Twilio is configured.
4. Check `notification_log` for the send record (success or failure).

## What notifications fire

| Event | Recipient | Type code |
|---|---|---|
| `assigned_to` changes | New assignee | `feedback_assignment` |
| `follow_up_assignee` changes | New follow-up owner | `feedback_followup_assignment` |
| `status` → resolved / closed | `received_by` (creator) | `feedback_resolved` |
| NEW complaint with severity critical / high | All managers (`role:manager`) | `feedback_escalation` |

All four paths share the same HTML email template and the same
WhatsApp / SMS body, differing only in `subjectPrefix`, `title`,
`headline`, and the fact list. See `notify_assignment.js` for the
template and `customer_feedback.html` for the per-event contexts.

## Extending to new record types

The notification module is intentionally generic. Any page can call:

```js
import { notifyAssignees } from './notify_assignment.js'
await notifyAssignees(sb, assignee, {
  type:          'my_event',
  subjectPrefix: '[MyApp] Thing #42',
  title:         'Thing #42 assigned to you',
  headline:      'Short human-readable opening line',
  iso:           'Optional ISO / compliance reference',
  severity:      'HIGH',               // optional, uppercase
  severityColor: '#f97316',            // optional, hex
  facts: [['Customer','Dr Martin'], ['Case','5234']],
  body:  'First 200 chars of description goes here',
  link:  'https://app.example.com/things/42',
})
```

The module:
- Resolves `assignee` (either a username or `"role:xxx"`) against `employees`.
- Respects each person's `notification_prefs` JSONB.
- Fires all three channels in parallel.
- Logs each attempt to `notification_log`.

## Caveats & follow-ups

- **Realtime toasts** (the bottom-right slide-in) come from
  `access.js` — not included in this bundle because it's tightly
  tied to the Cedarwings sidebar. If you want toasts in the target
  app, extract the `_showToast` / `_subscribeMyWorkRealtime` parts
  of `access.js` and adapt to your own sidebar markup.
- **Password change modal** is also in `access.js`. Same caveat.
- **Bulk actions** and **saved views** work standalone and are
  included here (`bulk_actions.js`, `user_views.js`). See the
  usage comments at the top of each file.
- **CSV export** is also standalone (`csv_export.js`).
- **Notifications are fire-and-forget client-side**. If the user
  closes the tab mid-save, some recipients may not get a message.
  For production-grade delivery move the send to a Supabase Edge
  Function that's called server-side from an `AFTER INSERT` /
  `AFTER UPDATE` trigger via `pg_net`.

## Direct download

Grab the whole folder as a subtree:

```
git clone --depth 1 https://github.com/bloomaligner-collab/PRODUCTION-.git /tmp/cw
cp -r /tmp/cw/exports/customer_feedback_module ./    # or wherever
```

Or browse the folder on GitHub and download each file:
<https://github.com/bloomaligner-collab/PRODUCTION-/tree/main/exports/customer_feedback_module>

## Questions

If anything's unclear once it's dropped into the target repo, open
an issue on the Cedarwings repo and paste the error — I can help
adapt the code.
