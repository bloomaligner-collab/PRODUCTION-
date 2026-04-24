# Cedarwings SAS — Work Session Report

**Date**: 2026-04-24
**Branch**: `main` (everything pushed, 39 commits today)
**Supabase project**: `cvrmadmzzualqukxxlro` (all migrations applied)
**GitHub Pages**: `https://bloomaligner-collab.github.io/PRODUCTION-/`

---

## 1. Headline — what changed

### Security — 0 critical issues remain (was 44)

- **RLS enabled on every one of 45 public tables**. Before this, anyone with the anon key (which ships in every browser) could SELECT / INSERT / UPDATE / DELETE every row in every table over REST. Now anonymous access is completely blocked and every authenticated query is permission-checked server-side.
- **4 `SECURITY DEFINER` views switched to `security_invoker`** so they honour the caller's RLS instead of bypassing it.
- **17 database functions** had `search_path` pinned (closes search-path-injection class).
- **6 sensitive tables** (employees, role_templates, system_settings, notification_settings, suppliers, page_access) now restrict writes to managers only.
- **Edge functions audited**: 3 leaky functions (hardcoded Bloom API tokens, unauthenticated endpoints returning full inventory) replaced with 410-Gone stubs. `bloom-sync` sanitized.
- **ISO 13485 §4.2.5 audit trail** — `public.audit_log` table + generic trigger on 10 regulated tables (employees, role_templates, system_settings, production_records, production_lots, quality_controls, non_conformity_reports, traceability, customer_feedback, internal_audits). Manager-only browser UI at `/audit_log.html`.

### CI — static checks on every push/PR

- New `.github/workflows/ci.yml`.
- `html-validate` catches invalid HTML elements and structural issues. Currently 0 errors, 0 warnings across 25 HTML files (was 154 warnings at start).
- `scripts/check_js_syntax.mjs` parses every `.js` and every inline `<script>` block. Caught a real `</script>` escape bug in qualite and tracabilite that was silently truncating the "Generate PDF" functions.
- `scripts/check_dom_ids.mjs` flags `getElementById(...)` calls for elements that don't exist. Found 3 real missing-element bugs at its first run (machines page missing supplier dropdown, production_materials missing "Log Production" button + missing material select).

### Real bugs fixed (would-have-cost-a-support-ticket class)

1. **`pwEye` password-toggle** on login page (`id="pwEye"` didn't exist, so the eye icon never flipped).
2. **`<lbl>` invalid tag** used as captions on 104 form fields — not a standard HTML element, invisible to screen readers. Converted to real `<label class="fl">`.
3. **`</script>` inside JS template literals** in qualite.html and tracabilite.html — the browser's HTML tokenizer was truncating the enclosing `<script>` block, so "Generate PDF" buttons silently did nothing. Fixed by escaping to `<\/script>`.
4. **Roles page sidebar overlap** — `<div class="main">` closed before `<div class="body">` opened, so body content inherited no margin-left and the 240-px sidebar drew on top of it.
5. **Roles page "select page" checkboxes** — double-toggled (native label-click + manual `cb.checked = !cb.checked`) so selections never stuck. Save button silently discarded the user's picks. Fixed.
6. **Missing pages in Roles page-access matrix** — Outsourcing and Requisitions were never added to `ALL_PAGES`. Added.
7. **Machines type filter** — the `fType` dropdown had no change listener and did nothing. Wired.
8. **Machines "Load a Lot" modal missing Supplier dropdown** — JS tried to populate `#instSupplier` but no such element existed, so opening the modal crashed the handler silently.
9. **Production Materials "+ Add Yield Rule" form missing Material select** — saveYieldRule() crashed when clicked. Added the select.
10. **Production Materials "📝 Log Production" modal had no button** — click handler on `#btnEntry` existed, element did not. Added the button.
11. **104 unbalanced `<div>` / orphan HTML blocks** from an old template pattern — cleaned up across 12 files.

### UX — new cross-cutting features

- **Saved views** (12 pages). A horizontal chip row under every register header lets each user save / rename / delete named filter presets. Per-user, cross-device via `public.user_views` (RLS: owner-only).
- **CSV export** (11 pages). One-click download of the currently-filtered rows. ISO-audit-friendly, UTF-8 BOM so Excel displays accents correctly.
- **Bulk actions** on the three regulated registers (customer_feedback, non_conformity, internal_audit). Multi-select → Mark resolved / closed / completed, Reassign (with a list or free-text prompt), Delete. All routed through the audit_log trigger.
- **My Work dashboard widget** — items assigned to the current user across feedback, NC, audits, and follow-ups. Shown on manager.html plus a small badge in the sidebar footer on every page.
- **Self-service password change** — sidebar footer "🔑 Change password" opens a modal that calls `sb.auth.updateUser()`. Users no longer need admin to reset.
- **Realtime updates** — Supabase Realtime subscription on the three regulated tables. My Work badge updates in ~1s when a row changes; a toast slides in from the bottom-right when someone is newly assigned to you.
- **Audit Log Viewer** (`/audit_log.html`) — manager-only page that lists every INSERT/UPDATE/DELETE on the 10 audited tables with filters, saved views, CSV export, and a click-to-expand diff modal showing the JSONB before/after.

### Notifications — four-channel multi-event fan-out

- **Four channels per recipient**, each independent and silent-skipped if not configured:
  1. In-app toast (realtime, if they have any page open)
  2. Email via Brevo SMTP
  3. WhatsApp via Brevo WhatsApp API
  4. SMS via **Twilio** (new this session)
- **Eight event types** fire notifications — see the Email Flow section below.
- **Per-user opt-out**: every employee has a `notification_prefs` JSONB column; the Employee Profile page has a 🔔 Notifications tab with three switches (email / WhatsApp / SMS).
- **Settings UI** for Twilio credentials with a "Test send to my phone" button.
- **Every send** (success or failure) logged to `public.notification_log`.

---

## 2. Email flow — who gets notified, when

The **Source** column shows who triggers the notification. The **Recipient** column shows who receives it. A single event can fire to multiple recipients simultaneously.

| # | Trigger | Recipient | Type | Channels |
|---|---|---|---|---|
| 1 | Complaint's `assigned_to` changes | New assignee (person or every member of the role) | `feedback_assignment` | Toast + Email + WhatsApp + SMS |
| 2 | Follow-up `follow_up_assignee` changes | New follow-up owner | `feedback_followup_assignment` | same |
| 3 | Complaint `status` → resolved / closed | `received_by` (the person who logged it) | `feedback_resolved` | same |
| 4 | **New complaint with `severity` = critical / high** | **All managers** | `feedback_escalation` | same |
| 5 | NC `assigned_to` changes | New CAPA owner | `nc_assignment` | same |
| 6 | NC `status` → closed | `detected_by` (original detector) | `nc_closed` | same |
| 7 | **New NC with `severity` = high** | **All managers** | `nc_escalation` | same |
| 8 | Audit `auditor` changes | New auditor | `audit_assignment` | same |
| 9 | Audit `status` → completed | All managers | `audit_completed` | same |
| 10 | Requisition status → pending_approval | All managers | `requisition_pending` | same |
| 11 | Requisition status → approved | Submitter (`generated_by`) | `requisition_approved` | same |
| 12 | Requisition status → cancelled | Submitter | `requisition_cancelled` | same |

### Self-notify suppression

- Self-assign: if you set `assigned_to` to yourself, no email / SMS / WhatsApp (but you still get the in-app toast for consistency).
- Self-close: if the creator of a record closes their own record, the resolution email does NOT fire (you already know you resolved it).
- Self-edit: the in-app toast uses `last_edited_by` / `last_viewed_by` heuristics to avoid popping for your own save.

### Channel gating

Each channel is tried independently per recipient. Skipped silently if:
- Email: recipient has no real email (or it ends in `@cedarwings.local`, the synthetic auth domain).
- WhatsApp: no phone OR Brevo not configured in Settings.
- SMS: no phone OR Twilio not configured in Settings.
- **Any channel**: the recipient has that channel turned off in their Profile → Notifications tab.

### Role-prefix assignment

A record's `assigned_to` can be a person name ("Monica") OR a role key ("role:quality_control"). When it's a role, every active employee whose `role` / `custom_role` / `extra_roles` matches gets notified.

---

## 3. Email content preview

Open `email_preview.html` in any browser to see the actual HTML that Brevo renders. A sample for each notification type is included.

The general shape:

```
┌─────────────────────────────────────────────────┐
│  A {record type} has been assigned to you        │
│  Cedarwings SAS · Customer Feedback register ·  │
│  ISO 13485 §8.2.1                               │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ [HIGH]  Complaint  · FB-24               │  │
│  │ Customer: Dr. Martin                     │  │
│  │ Doctor:   Dr. Martin                     │  │
│  │ Case #:   5234                           │  │
│  │ ─────────────────────────────────────── │  │
│  │ Upper tray not fitting, patient reports │  │
│  │ sharpness on molar #27                   │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│     [   Open the record →   ]                   │
│                                                 │
│  You received this because you were assigned    │
│  to this record in the Cedarwings operations    │
│  platform. If you weren't expecting this,       │
│  please contact your manager.                   │
└─────────────────────────────────────────────────┘
```

Severity pills:
- **CRITICAL** — red `#dc2626`
- **HIGH** — orange `#f97316`
- **MEDIUM** — yellow `#eab308`
- **LOW** — grey `#94a3b8`

---

## 4. You need to do these three things

I cannot do these from here. They're 15 minutes of your time total.

### A. Rotate the Bloom API token
The original token was hardcoded in deployed function source versions 1–7 of `bloom-sync` and version 1 of `bloom-aligners-full`. Anyone who read those old versions has it.

1. Log in to bloomaligner.fr → API settings.
2. Generate a new token, invalidate the old one.
3. In Supabase Dashboard → Edge Functions → Secrets, update `BLOOM_API_TOKEN` to the new value.

### B. Enable leaked-password protection
One toggle. I [walked through this earlier](https://supabase.com/dashboard/project/cvrmadmzzualqukxxlro/auth/providers?provider=Email):

1. Authentication → Providers → Email
2. Scroll to **Password requirements**
3. Flip **"Prevent use of leaked passwords"** ON
4. Raise Minimum password length to 10
5. Save

### C. (Optional) Add Twilio credentials
If you want SMS on top of WhatsApp:

1. Settings page → 📱 Twilio SMS (optional) card
2. Paste Account SID, Auth Token, From number (E.164)
3. Click **🧪 Test Send (to my phone)** to verify end-to-end
4. Save — every future assignment notification now also fires SMS

---

## 5. Remaining lower-priority work

- Consolidate machines.html's bespoke filter into the shared module.
- Extract the checkbox column HTML into `bulk_actions.js` so new pages need no table-header changes.
- Daily digest mode (one email with all events instead of per-event).
- Bulk actions on inventory / tracabilite / requisition.
- Remove the 4 binary files from git root (`cedarwings-ops.tar.gz`, `files6.zip`, `cedarwings_user_guide.pdf`, `bloom-aligners-full.ts`) — none referenced.
