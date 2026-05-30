CREATE OR REPLACE FUNCTION public.generate_auto_requisitions()
 RETURNS TABLE(material_name text, unit text, qty_needed numeric, qty_in_stock numeric, qty_to_order numeric, pack_size numeric, packs_to_order numeric, bom_id uuid)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  aligners_remaining NUMERIC;
  total_planned NUMERIC := 0;
  total_produced NUMERIC := 0;
  cases_active NUMERIC := 0;
BEGIN
  SELECT COALESCE(SUM(
           COALESCE(NULLIF(btrim(bad.number_of_aligners::text), '')::NUMERIC,
                    COALESCE(bad.aligner_upper,0) + COALESCE(bad.aligner_lower,0))
         ), 0),
         COUNT(DISTINCT bad.case_number)
  INTO total_planned, cases_active
  FROM bloom_aligner_details bad
  JOIN bloom_cases bc ON bad.case_number = bc.case_id
  WHERE bad.order_type = 'TreatmentPlan'
    AND (bc.current_status NOT IN ('DELIVERED','ARCHIVE','CANCELLED')
         OR bc.current_status IS NULL);

  SELECT COALESCE(SUM(pr.aligners_produced), 0)
  INTO total_produced
  FROM production_records pr
  WHERE pr.status = 'complete';

  aligners_remaining := GREATEST(0, total_planned - total_produced);

  RETURN QUERY
  WITH stock AS (
    -- One row per item: available stock (net of reservations) + reorder config.
    SELECT ii.item_name,
           COALESCE(SUM(il.available_qty),0) AS qty,
           COALESCE(MAX(ii.unit_of_measure), MAX(ii.unit)) AS unit,
           MAX(ii.min_qty) AS min_qty,
           MAX(ii.max_qty) AS max_qty,
           bool_or(COALESCE(ii.auto_requisition_enabled,false)) AS auto_on
    FROM inventory_items ii
    LEFT JOIN inventory_lots il ON il.item_id = ii.id AND il.status = 'active'
    GROUP BY ii.item_name
  ),
  bomneed AS (
    -- Forecast need from the BOM (per_case vs per_aligner aware).
    SELECT b.id AS bom_id, b.material_name, b.unit, b.pack_size,
      CEIL(
        b.qty_per_aligner
        * (CASE WHEN b.qty_basis = 'per_case' THEN cases_active ELSE aligners_remaining END)
        * (1 + COALESCE(b.safety_reserve_pct,10)/100.0)
      ) AS qty_needed
    FROM bom b WHERE b.active = true
  ),
  universe AS (
    SELECT material_name AS name FROM bomneed
    UNION
    SELECT item_name FROM stock
    WHERE auto_on AND COALESCE(min_qty,0) > 0 AND qty < min_qty
  ),
  merged AS (
    SELECT
      u.name AS material_name,
      COALESCE(bn.unit, s.unit) AS unit,
      bn.pack_size,
      bn.bom_id,
      COALESCE(s.qty,0) AS qty_in_stock,
      -- Need = larger of: forecast consumption, or min-stock top-up target
      -- (max_qty if set, else min_qty) when below the reorder point.
      GREATEST(
        COALESCE(bn.qty_needed,0),
        CASE WHEN COALESCE(s.min_qty,0) > 0 AND COALESCE(s.qty,0) < s.min_qty
             THEN COALESCE(NULLIF(s.max_qty,0), s.min_qty) ELSE 0 END
      ) AS qty_needed
    FROM universe u
    LEFT JOIN bomneed bn ON bn.material_name = u.name
    LEFT JOIN stock s ON s.item_name = u.name
  )
  SELECT
    m.material_name,
    m.unit,
    m.qty_needed,
    m.qty_in_stock,
    GREATEST(0, m.qty_needed - m.qty_in_stock) AS qty_to_order,
    m.pack_size,
    CASE WHEN m.pack_size > 0
      THEN CEIL(GREATEST(0, m.qty_needed - m.qty_in_stock) / m.pack_size)
      ELSE NULL END AS packs_to_order,
    m.bom_id
  FROM merged m
  WHERE GREATEST(0, m.qty_needed - m.qty_in_stock) > 0;
END;
$function$;
