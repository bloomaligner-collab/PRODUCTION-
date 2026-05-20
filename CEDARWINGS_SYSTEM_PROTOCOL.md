# Cedarwings SAS Operations — System Protocol

*Last updated: 2026-05-20 (post-audit refresh)*

This document explains, in plain language, **how the Operations app works
end-to-end** — who does what, where the data flows, and how ISO 13485
traceability is preserved. It complements the in-app help (🛟 Help
button, EN/FR) which describes each page field by field.

---

## 1. What the system is

A single web application (PWA) that runs the manufacturing operations of
Cedarwings SAS:

- Bloom orders → Production → Quality Control → Packaging → Shipping
- Inventory of raw materials and consumables (FEFO)
- Suppliers (Approved Supplier List + certifications)
- Quality cluster: Non-Conformities, CAPAs, Customer Feedback, Internal Audits
- Team: clocking, time reporting, roles, permissions
- Continuous traceability: every action is signed and dated

The app is delivered from GitHub Pages; data and authentication live in
Supabase (Postgres + Auth + Storage + Edge Functions).

## 2. Roles & access

| Role | Typical user | What they can do |
|---|---|---|
| **Manager** | Director, QM | Everything: create/edit/delete, approve requisitions, close NCs/CAPAs, configure roles & routing. |
| **Quality Manager** | QM | Owns NCs, CAPAs, audits, feedback investigations, supplier evaluations. |
| **Production Manager** | Production lead | Owns production lots, materials, machines, maintenance. |
| **Quality Controller** | QC operator | Runs 16-point inspections, raises NCs on rejection. |
| **Operator** | Production team | Clocks in/out, advances steps, sees their own work. |
| **Warehouse** | Stockist | Receives lots, raises requisitions, manages inventory items. |
| **Customer Service** | CS rep | Logs feedback, follows up, marks resolved. |

Roles are stored on `auth.users.user_metadata.role`. The **Roles** page
maps each role to the pages and actions allowed; access is enforced on
the client (UI hides what's not allowed) **and** at the database via
Row-Level Security policies + a `cw_is_manager()` helper.

## 3. Daily operational flow

```
   Bloom case  ─►  Production lot  ─►  16-point QC  ─►  Packaging  ─►  Shipping
        │                │                  │
        │                │                  └─► reject? ──► NC report ─► CAPA(s)
        │                │
        │                └─► raw material deducted from inventory (FEFO)
        │
        └─► Customer Feedback (post-market surveillance)
              ├─► investigation (Lot/UDI, root cause, result)
              ├─► CAPA required?  ─► CAPA register
              └─► Vigilance reportable? ─► regulator reference recorded
```

Every step records **who did it, when, on which device, against which
lot/order** and is visible in the Traceability page.

## 4. The quality cluster — how the pieces fit

Since the 2026-05-20 audit, the quality cluster is fully separated into
four distinct registers, each with its own page and lifecycle. They link
to each other but do not overwrite each other.

### 4.1 Non-Conformity (NC)
- One report per defect / process deviation.
- Captures: detection, description, immediate correction (quarantine,
  scrap…), root cause, severity, status.
- Closes only when *every* linked CAPA is Verified or Closed.
- New tile: **🛠 Linked CAPAs** (create inline or pick from register).

### 4.2 CAPA (Corrective & Preventive Action)
- Lives in its own register (`capa.html`).
- Each CAPA has: source (NC / Feedback / Audit / Other), problem
  statement, root cause, action plan, owner, due date, status,
  effectiveness check, verified by/at, closed at.
- Lifecycle: **Open → In Progress → Verified → Closed** (or *Cancelled*).
- CSV export, deep-linkable, status KPIs, source + owner filters.

### 4.3 Customer Feedback (Réclamations)
- Every complaint, return, warranty claim, suggestion, positive feedback.
- New **Investigation & Compliance** section: Lot/UDI, investigation
  start, investigation result, root cause, CAPA flag + linked CAPA,
  vigilance reportable + regulator reference.
- Category-based auto-routing (e.g. *Product Quality* → QM role).
- Read receipts (📧/📬), follow-up reminders (red/amber/green), Dashboard
  satisfaction score on closed records (30-day rolling).

### 4.4 Internal Audit
- Plan and record internal quality audits.
- Each audit can spawn one or more CAPAs (via source = audit).

## 5. Production & Quality Control

1. **Bloom Import** pulls cases from bloomaligner.fr (CSV / Excel / API).
2. **Production** logs the lot: order, machine, material lot (auto-picked
   FEFO), operator, quantities upper/lower, status pending → in progress →
   completed.
3. **Clocking** advances the case step by step (Printing → Thermoforming
   → Trimming → Packaging …). Each transition is timestamped and
   attributed.
4. **Quality Control** runs the 16-point ISO inspection. The controller
   signs (name + login), submits, and either:
   - ✅ Approves → lot released for shipping
   - ❌ Rejects → step reset, NC banner appears with a pre-filled link
   - ⏸ Holds for re-verification
5. New QC fields (2026-05 audit): **Linked NC**, **Procedure reference**,
   **Measures taken** — so the QC certificate documents not just *what
   was checked* but *which SOP was followed* and *what was done with a
   rejected lot*.

## 6. Suppliers & Inventory

### 6.1 Approved Supplier List (ISO 13485 §7.4)
- No purchase outside the ASL.
- Status: Approved / Conditional / Suspended / Disqualified.
- Annual re-evaluation; LFA shows red flags for evaluations >12 months.
- **Certifications & contracts** with expiry — auto badges:
  - 🟢 VALID (>30 days)
  - 🟡 SOON (≤30 days)
  - 🔴 EXPIRED (past)
- PDF / image attachments stored in a **private** bucket
  (`supplier-docs`); the app opens them via short-lived **signed URLs**
  (5 min). Only the original uploader or a manager can delete a file.

### 6.2 Inventory
- Items catalogue + Lots (FEFO consumption).
- Each item carries a **Storage conditions** string (now a column in the
  catalogue table — long text truncated, hover for full).
- Stock alerts auto-feed the Dashboard + can auto-create Requisitions.

### 6.3 Requisitions
- Workflow: pending → approved (manager) → sent → received.
- On receipt a new inventory lot is auto-created with the supplier lot
  number, linking back to the requisition for traceability.

## 7. Notifications & follow-up

- **Customer Feedback**: assignee gets a 🔔 toast + persistent banner
  across every page until they open the record (📧→📬).
- **Push notifications** (Web Push + VAPID): assignment, chat mention,
  follow-up reminders. Delivery is tracked in `push_log` (Sent /
  Delivered / Opened).
- **Follow-up dates** are surfaced on the Dashboard with a red/amber
  countdown.
- **Reminders cron** runs every 15 minutes (pg_cron) to wake the push
  edge function for overdue follow-ups.

## 8. Per-record traceability (what stays auditable)

Each record across every page carries the same telemetry — visible on
the record's detail view:

- `created_by`, `created_at`
- `last_edited_by`, `last_edited_at`
- `last_viewed_by`, `last_viewed_at`
- `notification_seen_at`, `notification_seen_by` (where applicable)
- Status changes are logged in the chat/discussion timeline of the
  record

Edits to a customer feedback record are hard-restricted by a database
trigger (`cf_enforce_edit_owner`) to: the creator, the current
assignee/role member, or a manager. Other users get a permission error
straight from Postgres — the UI cannot bypass it.

## 9. Data storage & RLS

- All tables use **Row-Level Security**; the project pattern is
  "authenticated = trusted" plus targeted owner/role restrictions on
  sensitive tables (customer_feedback, capa, etc.).
- Private storage buckets: `chat-media` (case discussion attachments) and
  `supplier-docs` (cert / contract PDFs). Both require auth + serve
  signed URLs.
- Helper SQL functions live under `public.cw_*` — they are
  `SECURITY DEFINER` and use a hard search_path to prevent injection.

## 10. Where to look when something goes wrong

| Problem | First place to check |
|---|---|
| Missing notification | Settings → Push status · push_log table for delivery state |
| Wrong assignee | Settings → Category / Role routing · the feedback record's `assigned_to` field |
| Slow page | Dev Tools network panel · Supabase Logs (`mcp__supabase__get_logs`) |
| Can't edit a record | Record's assignee + creator + your role — only those three can edit feedback; managers always can |
| Login loop on iOS PWA | Nuclear reset: delete app + Settings → Safari → Clear History · localStorage now mirrors the session for cold-reopen |
| Storage attachment 404 | Verify the signed URL has not expired (5 min); regenerate by re-opening the document |

## 11. Help inside the app

Every page has a 🛟 floating button in the topbar:

1. Click it.
2. The panel opens with **Role · Purpose · Process · Buttons** for that page.
3. Top-right toggle switches **FR ⇄ EN** — both languages are kept in
   sync inside `lang.js`.

After the 2026-05-20 audit the help content was updated to cover:
- The new Investigation & Compliance section in Customer Feedback
- The new NC link / Procedure / Measures fields in Quality Control
- The Linked CAPAs tile in Non-Conformity
- The Certifications & contracts section + PDF attachments in Suppliers
- The Storage column in Inventory
- The brand-new CAPA register page

## 12. Change history (relevant to this protocol)

| Date | What changed | Migration / commit |
|---|---|---|
| 2026-05-20 | Audit module extensions: customer_feedback fields, QC fields, supplier_documents, capa table | `20260520140000_audit_module_extensions.sql` |
| 2026-05-20 | Private bucket `supplier-docs` + storage policies | `20260520150000_supplier_docs_storage.sql` |
| 2026-05-20 | UI rollout (5 pages updated, capa.html added, 11 sidebars get CAPA link) | branch `claude/add-case-category-layout-AMA0d` |
| 2026-05-20 | Help content refreshed in lang.js (FR + EN) | this commit |

---

*For field-level descriptions, open the page in the app and click the 🛟
Help button — the in-app help is always the single source of truth, in
both languages.*
