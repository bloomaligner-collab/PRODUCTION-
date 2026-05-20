# 📧 Email — QMS Audit follow-up changes (2026-05-20)

> Copy/paste the version you like best. Both are written so a non-technical
> reader can find the new fields without having to be walked through.

---

## ✉️ Short version — for a quick share

**Subject:** QMS audit — the 6 changes are live, here's where to find them

Hi all,

Following the 20 May audit we shipped the requested changes to the
Operations app. Nothing was removed; everything below is **additive**, so
existing records keep working as before.

| # | Module | What changed | Where to find it |
|---|---|---|---|
| 1 | **Customer Feedback** | New fields: Lot / UDI, Investigation started, Root cause, Investigation result, CAPA Y/N + linked CAPA, Vigilance Y/N + reference | Log Feedback → expand **🔍 Investigation & Compliance**. Same fields show on the read-only view. |
| 2 | **Traceability** | No change required (already complete). | — |
| 3 | **Quality Control** | Rejected lot can now be linked to its NC; we also record the procedure reference and the measures taken. | Quality Control → New / edit inspection → bottom of the form. |
| 4 | **Non-Conformities** | CAPAs are now separated from NC corrections. Each NC can have several CAPAs and each CAPA lives in its own register. | Inside any NC → **🛠 Linked CAPAs** tile. Standalone view: **Quality → CAPAs** in the left nav (new page). |
| 5 | **Suppliers** | Certifications and contracts with expiry dates, plus PDF / image uploads (private). Badges show **EXPIRED / SOON / VALID**. | Suppliers → edit a supplier → **📜 Certifications & contracts**. Click 📎 to attach a PDF; click PDF in the list to open it. |
| 6 | **Inventory** | Storage conditions are now a real column in the Items Catalogue (long text is truncated; hover to see the full string). | Inventory → Items Catalogue → **Storage** column. |
| 7 | **🆕 CAPA Register** | New page listing every CAPA with status KPIs (Open / In Progress / Verified / Closed), filters by source and owner, sortable columns, CSV export and deep-links. | Left nav → **🛠 CAPAs**. Each CAPA # in NC or Feedback links to it. |

Please test on your usual device — the changes are already on the
production app, no action needed from your side to install.

Thanks,
*[name]*

---

## ✉️ Detailed version — for the QMS file / audit folder

**Subject:** Cedarwings Operations app — QMS audit closure pack (20 May 2026)

Hi all,

Below is the complete list of changes made to the Operations app to close
the points raised during the 20 May 2026 audit. Everything is **live in
production** and has been recorded in the migration history.

### 1. Customer Feedback (Réclamations)

The Log Feedback form now has an **Investigation & Compliance** section.
Open a complaint → expand the section → fill in any of:

- **Lot / UDI** — free text (lot number, UDI string, or both).
- **Investigation started** — date/time the investigation began.
- **Root cause** — dedicated field (no longer mixed with the resolution
  notes).
- **Investigation result** — what the investigation concluded.
- **CAPA required?** Yes / No. When **Yes**, a CAPA picker appears so the
  complaint can be linked to an existing CAPA (or a new one created from
  the CAPA register and then linked back here).
- **Vigilance reportable?** Yes / No. When **Yes**, a Vigilance reference
  field appears (regulator reference, internal report #, etc.).

The same fields are read-only on the **view** modal — anyone with access
to the case can see them without entering edit mode.

### 2. Traceability

No changes — the existing module already covers lot ⇄ order ⇄ patient
linkage with full audit log.

### 3. Quality Control

The QC inspection form now records:

- **Linked Non-Conformity** — dropdown of open NCs; useful when a rejected
  lot triggers an NC, so the two records reference each other.
- **Procedure reference** — the SOP / WI number that the inspection
  followed.
- **Measures taken** — what was done with the rejected lot (quarantine,
  rework, scrap…).

### 4. Non-Conformities — CAPAs separated

Inside the NC form there is now a **🛠 Linked CAPAs** tile. Each NC can
have any number of CAPAs; each CAPA has its own status (Open → In
Progress → Verified → Closed). The old `root_cause` and `corrective_action`
text fields are still there, but corrections and CAPAs are no longer the
same thing.

### 5. Suppliers — certifications & contracts with PDF

Open any supplier in the supplier list → the modal now has a
**📜 Certifications & contracts** section with:

- Type (Certification / Contract / Other), Title, Reference #, Expiry
  date.
- An optional **PDF / image attachment** stored in a private bucket. Click
  the 📎 button to attach, then **+ Add document**. The PDF link in the
  list opens a short-lived signed URL — the bucket is not public.
- Status badge per document: **EXPIRED** (past expiry), **SOON** (≤ 30
  days), **VALID** (more than 30 days).

Deleting a document also deletes its underlying file.

### 6. Inventory — storage conditions

The Items Catalogue table now has a **Storage** column. It was already a
field on the item form; this just surfaces it for at-a-glance review.
Long text is truncated with the full string available on hover (title
tooltip).

### 7. New — standalone CAPA Register

A dedicated **CAPAs** page is now in the left navigation (under
Quality, next to Non-Conformity). It centralises every CAPA regardless of
origin:

- Top tiles: counts per status (Open, In Progress, Verified, Closed,
  Cancelled). Click a tile to filter.
- Filters: free-text search, source (NC / Feedback / Audit / Other),
  owner.
- Sortable columns: CAPA #, Title, Source, Owner, Due date, Status, Opened.
- Overdue / due-soon dates are highlighted automatically.
- **CSV export** — exports the current filter view, suitable for the QMS
  binder.
- Deep links: `capa.html?id=<uuid>` opens a specific CAPA, used by the NC
  and Feedback pages.

### Tracking the changes in the system

Every modification above is auditable:

- **Schema** — captured in two migration files:
  `20260520140000_audit_module_extensions.sql` and
  `20260520150000_supplier_docs_storage.sql`. Both are in
  `supabase/migrations/` in the repository.
- **UI** — the relevant commits are on branch
  `claude/add-case-category-layout-AMA0d` (and will be on `main` once we
  deploy). The full diff per change is visible in the GitHub repository.
- **Per-record history** — Customer Feedback already records
  *created_by*, *last_edited_by* and *last_viewed_by* on every record;
  CAPAs record *created_by*, *opened_at*, *closed_at*, *verified_by /
  verified_at*; supplier documents record *created_by* and
  *created_at*. All of these are visible on each record's detail view.
- **Storage** — supplier attachments live in the private `supplier-docs`
  bucket; viewing requires authentication and the URLs expire after 5
  minutes.

Let me know if anything is unclear or if a screenshot for the QMS file
would be useful.

Thanks,
*[name]*
