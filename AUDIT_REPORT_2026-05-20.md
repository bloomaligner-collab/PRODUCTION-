# QMS Audit — Implementation Report

**Project:** Cedarwings SAS Operations
**Audit date:** 2026‑05‑20
**Applied to production project:** `cvrmadmzzualqukxxlro`
**Migration:** `20260520140000_audit_module_extensions.sql`
**Branch / commit base:** `main`

This report covers the six modules raised in the audit, what was found in the
existing code/database, what was implemented, and what remains as an
explicit follow‑up.

---

## 1. Réclamations / Customer Feedback

**Before**
- Only a "Root Cause" textarea existed (saved into the generic `notes`
  column). No Lot/UDI, no investigation lifecycle, no CAPA flag, no
  vigilance flag.

**Now ✅**
- New columns on `public.customer_feedback`:
  `lot_udi`, `investigation_started_at`, `investigation_result`,
  `root_cause`, `capa_required` (boolean), `capa_id` (FK → `capa`),
  `vigilance_reportable` (boolean), `vigilance_id` (free text — e.g.
  ANSM reference).
- The Log Feedback modal gained a new collapsible section
  **"🔍 Investigation & Compliance"** with all of those fields.
- *CAPA required = Yes* reveals a CAPA picker bound to the new register.
- *Vigilance reportable = Yes* reveals a Vigilance ID input.
- `save()` writes both the new `root_cause` column *and* the legacy
  `notes` column so older readers still work; `editRec()` prefers
  `root_cause` and falls back to `notes`.

**Follow‑up**
- The view‑record modal still shows only the core fields. Exposing the
  new investigation/CAPA/vigilance values in the read‑only view is a
  one‑Edit follow‑up.

## 2. Traçabilité

Per the audit note "Ça m'a l'air bien" — left untouched.

## 3. Quality Control

**Before**
- `quality_controls` had `non_conformities` (free text), `corrective_action`,
  `return_to_step` — but no link to the actual NC record, no procedure
  reference, no structured "measures" capture.

**Now ✅**
- New columns on `public.quality_controls`:
  `nc_id` (FK → `non_conformity_reports`), `procedure_ref`, `measures_taken`.
- The QC inspection form adds three fields next to "Non‑Conformités
  détectées" / "Action corrective":
  - **Lien à la NC (lot rejeté)** — dropdown populated from open NCs.
  - **Procédure CQ finale (référence)** — e.g. `QC-SOP-001 Rev.2`.
  - **Mesures prises** — free‑text textarea.
- The dropdown is loaded once on page open from
  `non_conformity_reports`.

## 4. Non‑conformités  vs  CAPAs

**Audit point (correct):** the NC form mixed corrections with CAPAs (an NC
had its own "CAPA Owner" / "CAPA Due Date" fields embedded in the same row).
CAPAs target the *root cause*; not every NC needs one.

**Now ✅**
- New table `public.capa` (separate register) with proper CAPA lifecycle:
  `capa_no`, `source_type` (`nc`|`feedback`|`audit`|`other`), `source_id`,
  `title`, `problem_statement`, `root_cause`, `action_plan`, `owner`,
  `due_date`, `status`, `opened_at`, `closed_at`, `verified_by`,
  `verified_at`, `effectiveness_check`, `effectiveness_at`, `notes`.
- Inside the NC modal there is now a **"🛠 Linked CAPAs"** block:
  - Lists every CAPA linked to that NC (`capa_no`, title, owner, due,
    status).
  - A small inline form lets a user **create a new CAPA linked to the
    current NC** (auto‑generated `capa_no`, fields above, status default
    `open`).
  - The NC's existing fields (`root_cause`, `corrective_action`,
    `verified_by`, `due_date`) remain as the immediate
    **correction** record — the CAPA register captures the **root‑cause
    response**.
- From Customer Feedback, *CAPA required = Yes* lets the user attach an
  existing CAPA (same register) via `customer_feedback.capa_id`.

**Follow‑up**
- A dedicated CAPA list/register page (`capa.html`) with filters / CSV
  / verification workflow was *not* added in this pass to keep scope
  controlled. CAPAs are already creatable and readable from NC and
  Feedback; a standalone register page is a clean next step.

## 5. Suppliers — certifications & contracts

**Before**
- `suppliers` had no certification / contract / expiry columns. The page
  had no UI for them.

**Now ✅**
- New table `public.supplier_documents`:
  `supplier_id`, `kind` (`certification`|`contract`|`other`), `title`,
  `issuer`, `reference_no`, `valid_from`, `expires_at`, `attachment_url`,
  `notes`, audit fields.
- Inside the Edit‑Supplier modal there is now a
  **"📜 Certifications & contracts"** section:
  - Lists existing documents with **EXPIRED / SOON / VALID** badges
    (red ≤today, amber ≤30d, green otherwise).
  - An inline form to add a new document (kind, title, reference no.,
    expiry date) with a delete button per row.
- One supplier can hold many certifications and many contracts.

**Follow‑up**
- Attachments (PDF certificate files) are storeable via `attachment_url`
  but the UI is text‑only; if you want a file upload, we can use the
  existing `chat-media` bucket pattern (private storage + signed URLs).

## 6. Inventory — storage conditions

**Before**
- The column `inventory_items.storage_conditions` already existed in
  the schema but was **never exposed in the UI**.

**Now ✅**
- Inventory item form: new **"Storage conditions"** textarea right
  above "Notes", populated on edit and saved on create/update.

**Follow‑up**
- Surfacing storage conditions in the items table (a small column or
  tooltip on the row) is a 2‑line cosmetic addition for a follow‑up.

---

## Migration & RLS

Single SQL migration applied to production:
`supabase/migrations/20260520140000_audit_module_extensions.sql`.

- All schema changes are **additive** (`ADD COLUMN IF NOT EXISTS`, new
  tables with `IF NOT EXISTS`); no data was rewritten.
- RLS on the two new tables follows the project's existing
  *authenticated = trusted* pattern: select/insert/update/delete for any
  signed‑in user.
- The `customer_feedback → capa` foreign key is enforced
  (`ON DELETE SET NULL`).

## What remains as explicit follow‑up

1. Customer Feedback **view modal** — display the new investigation /
   CAPA / vigilance fields (currently visible only in the edit form).
2. Standalone **CAPA register page** (`capa.html`) with filters and CSV
   export, in addition to the inline NC/Feedback creators already
   shipped.
3. **PDF attachment upload** for supplier certifications and contracts
   (private storage bucket).
4. Inventory **table column** for storage conditions (currently only on
   the item form).

---

*Generated alongside the implementation. The audit features above are
deployed and live; the four follow‑ups can be picked up in any order
without further schema work — only UI.*
