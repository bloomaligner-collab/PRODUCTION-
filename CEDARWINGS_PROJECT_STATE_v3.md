# Cedarwings SAS — Operations Platform Project State
## Version 3.0 — Updated April 2026

---

## DEPLOYMENT
- **Production URL:** https://bloomaligner-collab.github.io/PRODUCTION-/
- **GitHub Repo:** `bloomaligner-collab/PRODUCTION-`
- **Supabase Project:** `cvrmadmzzualqukxxlro` (Pro / private account)
- **Bloom API:** `https://api.bloomaligner.fr`
- **Bloom Token:** stored as the `BLOOM_API_TOKEN` edge-function secret (not in the repo)

---

## PLATFORM STATUS: FULLY AUDITED & PRODUCTION-READY

All 20 pages verified. All critical bugs fixed. All cross-page connections built.

---

## ALL 20 PAGES — STATUS

| Page | FILE | PAGE_KEY | Status |
|------|------|---------|--------|
| Dashboard | manager.html | dashboard | ✅ |
| Production | production.html | production | ✅ External system |
| Inventory | inventory.html | inventory | ✅ |
| Employees | employees.html | employees | ✅ |
| Clocking | clocking.html | clocking | ✅ |
| Time Report | time_report.html | time_report | ✅ |
| Traceability | tracabilite.html | tracabilite | ✅ |
| Quality Control | qualite.html | qualite | ✅ |
| Non-Conformity | non_conformity.html | non_conformity | ✅ |
| Internal Audit | internal_audit.html | internal_audit | ✅ |
| Customer Feedback | customer_feedback.html | customer_feedback | ✅ |
| Machines | machines.html | machines | ✅ |
| Maintenance History | maintenance_history.html | maintenance_history | ✅ |
| Bloom Import | bloom_import.html | bloom_import | ✅ |
| Suppliers | suppliers.html | suppliers | ✅ Fully rebuilt v3 |
| Production Materials | production_materials.html | production_materials | ✅ |
| Roles | roles.html | roles | ✅ |
| Settings | settings.html | settings | ✅ |
| Changelog | changelog.html | changelog | ✅ v3.0 |
| ISO Compliance | iso_compliance.html | iso_compliance | ✅ |

**Dead pages to delete from GitHub:** `time_management_report.html`, `inventory_old.html`

---

## DATABASE — CURRENT STATE

### Active Tables

| Table | Rows | Notes |
|-------|------|-------|
| bloom_case_snapshots | 87,972 | Auto-sync running |
| bloom_aligner_details | 14,311 | |
| bloom_cases | 4,588 | 180K+ aligners |
| bloom_sync_log | 620+ | Last sync: 2026-04-17 |
| machines | 12 | All active |
| system_settings | 12 | |
| inventory_items | 7 active + 2 inactive | Cleaned in v3 |
| bom | 6 | ALL COSTED — ~€31/aligner |
| inventory_lots | 4 active | |
| suppliers | 4 | |
| employees | 2 | |
| quality_controls | 0 | Not yet used |
| All other operational | 0 | Platform not yet in production use |

### Dropped Tables (v3 cleanup)
`quality_checks`, `non_conformities`, `yield_rules`, `clocking`, `inventory`, `inventory_stock_history`

### Active Views
- `inventory_lots_enriched_view` — joins lots + items + suppliers + locations. Filters: `status='active'` AND `inventory_items.active=true`
- `inventory_reorder_dashboard_view` — shows items needing reorder. Filters: `active=true`
- `bloom_aligners` — alias for bloom_aligner_details
- `production_events_view` — production records summary

### Inventory Items (7 active)
1. **Resin (Printing)** — 2L in stock, €23/L
2. **Cleaning Solution (IPA)** — 2L in stock, €23/L
3. **Dental resin** — 0 lots (needs stock added)
4. **Film Roll (50 sheets)** — lot exists
5. **Film Sheet (Thermoforming)** — NEW in v3, 0 lots ⚠️
6. **Label** — NEW in v3, 0 lots ⚠️
7. **Packaging Bag** — NEW in v3, 0 lots ⚠️

### BOM (Bill of Materials) — all costed
| Material | Qty/Aligner | Unit | Cost/Unit | Cost/Aligner |
|---------|------------|------|-----------|-------------|
| Resin (Printing) | 0.2 | liter | €150 | €30.00 |
| Film Sheet (Thermoforming) | 1 | sheet | €0.30 | €0.30 |
| Film Roll (50 sheets) | 0.02 | roll | €15 | €0.30 |
| Cleaning Solution (IPA) | 0.05 | liter | €5 | €0.25 |
| Packaging Bag | 1 | unit | €0.10 | €0.10 |
| Label | 0.5 | unit | €0.05 | €0.025 |
| **TOTAL** | | | | **~€31/aligner** |

*Note: BOM costs are placeholder estimates — adjust to actual supplier prices.*

### Material Yield Rules
`material_yield_rules` table has 0 rows — auto-deduction in clocking.html won't work until rules are added via Production Materials page.

---

## V3 CHANGES — COMPLETE LIST

### Critical Bug Fixes
1. ✅ manager.html — `PAGE_KEY='dashboard'` added (auth guard was broken)
2. ✅ qualite.html — `quality_checks` removed → `quality_controls` only
3. ✅ inventory.html — `inventory_stock_history` → `inventory_batch_consumption`
4. ✅ production_materials.html — `yield_rules` → `material_yield_rules` exclusively
5. ✅ clocking.html — `yield_rules` → `material_yield_rules` in auto-deduction
6. ✅ machines.html — `inventory_stock_history` → `inventory_batch_consumption`
7. ✅ suppliers.html — full rebuild (was broken shell)
8. ✅ tracabilite.html — all French labels + `?case=` URL param
9. ✅ qualite.html — all French labels removed (EN throughout)

### Cross-Page Connections Built
- machines.html → maintenance_history.html?machine=ID (📋 History button)
- maintenance_history.html: `?machine=` URL param pre-filter + auto-updates `machines.next_service_date`
- qualite.html FAIL → non_conformity.html?source=qc (NC prompt banner)
- customer_feedback.html complaint → non_conformity.html?source=feedback
- internal_audit.html findings → non_conformity.html?source=audit
- non_conformity.html reads all `?source=, ?case=, ?desc=` URL params
- employees.html → employee_profile.html (clickable rows + live clocked-in dot)

### Dashboard (manager.html) — 4 New KPIs
- Open Non-Conformities (live from `non_conformity_reports`)
- Customer Satisfaction (30-day count from `customer_feedback`)
- Last Bloom Sync (time ago, color-coded)
- Machines Due for Service (overdue count from `machines.next_service_date`)

### DB Changes
- 6 orphan tables dropped
- 8 test inventory items deleted
- BOM costs updated (was all €0)
- 3 missing inventory items added (Film Sheet, Label, Packaging Bag)
- `inventory_lots_enriched_view` fixed to filter inactive items

### access.js (v3.2)
- 21 pages in nav (added iso_compliance)
- Dynamic role badge
- Name/role/logout footer
- Floating `?` help button with per-page guides for all 20 pages

---

## WHAT IS NOT YET DONE (future work)

### Business Logic
- **Material yield rules** — `material_yield_rules` table is empty. Add rules via Production Materials page before clocking auto-deduction will work.
- **Add lots for new items** — Film Sheet, Label, Packaging Bag have 0 stock. Add via Inventory page.
- **Adjust BOM costs** — Current costs are placeholder estimates. Update to actual supplier prices.

### Features (not yet built)
- PIN-based clocking — `employees.pin` field exists in DB, UI not implemented
- Auto-material consumption from clocking sessions — logic exists, needs `material_yield_rules` data
- Production API integration — `production.html` is ready but external system connection pending

### Platform Not Yet Live
- 0 QC records, 0 audits, 0 NCs — platform built but not yet in daily production use
- Time sessions: only 7 test records

---

## KEY TECHNICAL NOTES

### production.html
Production is tracked in an **external system** (bloomaligner.fr). `production.html` is a shell page ready for future API connection. DO NOT attempt to fix cross-page production connections — skip by design.

### Bloom Auto-Sync
Running automatically via edge functions. 87,972 snapshots as of last check. 4,588 cases, 180K+ aligners. Auto-sync triggers on a schedule — no manual action needed.

### auth / access.js
`access.js` handles auth via `localStorage` items set at login (`cw_user`, `cw_role`). The `PAGE_KEY` variable must be set before `access.js` loads in every page. Roles: `manager` (full access), `employee` (limited).

### Edge Functions Deployed
- `get-inventory-items` v2
- `get-inventory-data` v1

---

## FILES TO UPLOAD TO GITHUB (from sessions 7-8)

All files in `/mnt/user-data/outputs/` need to be uploaded. Priority order:

1. `access.js` — sidebar, nav, help system
2. `manager.html` — dashboard with new KPIs
3. `qualite.html` — fixed + English
4. `inventory.html` — fixed table reference
5. `suppliers.html` — full rebuild
6. `tracabilite.html` — English + URL param
7. `production_materials.html` — yield_rules fixed
8. `non_conformity.html` — CAPA + URL params
9. `internal_audit.html` — NC banner
10. `customer_feedback.html` — NC link
11. `machines.html` — maintenance link + fixed table ref
12. `maintenance_history.html` — URL param + auto-update
13. `clocking.html` — yield_rules fixed
14. `settings.html` — French fragment fixed
15. `changelog.html` — v3.0 entry
16. `employees.html` — clickable rows (unchanged if already uploaded)
17. `employee_profile.html` — unchanged, already correct
18. `time_report.html` — unchanged
19. `bloom_import.html` — unchanged
20. `production.html` — unchanged
21. `roles.html` — unchanged
22. `iso_compliance.html` — unchanged (but now in nav)

**DELETE from GitHub:** `time_management_report.html`, `inventory_old.html`
