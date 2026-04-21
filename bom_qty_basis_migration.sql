-- ══════════════════════════════════════════════════════════════════════
-- BOM — add qty_basis column (per_aligner | per_case)
-- Run in Supabase SQL editor for project cvrmadmzzualqukxxlro
-- ══════════════════════════════════════════════════════════════════════

ALTER TABLE bom
  ADD COLUMN IF NOT EXISTS qty_basis TEXT NOT NULL DEFAULT 'per_aligner'
  CHECK (qty_basis IN ('per_aligner','per_case'));

-- Backfill: existing rows stay 'per_aligner' (default already applied).
-- Optional: switch Packaging-category rows to per_case.
UPDATE bom SET qty_basis = 'per_case'
WHERE qty_basis = 'per_aligner' AND category = 'Packaging';
