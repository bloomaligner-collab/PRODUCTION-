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
    SELECT b.id AS bom_id, b.material_name AS mat, b.unit AS bunit, b.pack_size AS psize,
      CEIL(
        b.qty_per_aligner
        * (CASE WHEN b.qty_basis = 'per_case' THEN cases_active ELSE aligners_remaining END)
        * (1 + COALESCE(b.safety_reserve_pct,10)/100.0)
      ) AS need
    FROM bom b WHERE b.active = true
  ),
  universe AS (
    SELECT bomneed.mat AS name FROM bomneed
    UNION
    SELECT stock.item_name FROM stock
    WHERE stock.auto_on AND COALESCE(stock.min_qty,0) > 0 AND stock.qty < stock.min_qty
  ),
  merged AS (
    SELECT
      u.name AS mat,
      COALESCE(bn.bunit, s.unit) AS munit,
      bn.psize AS mpack,
      bn.bom_id AS mbom,
      COALESCE(s.qty,0) AS instock,
      GREATEST(
        COALESCE(bn.need,0),
        CASE WHEN COALESCE(s.min_qty,0) > 0 AND COALESCE(s.qty,0) < s.min_qty
             THEN COALESCE(NULLIF(s.max_qty,0), s.min_qty) ELSE 0 END
      ) AS need
    FROM universe u
    LEFT JOIN bomneed bn ON bn.mat = u.name
    LEFT JOIN stock s ON s.item_name = u.name
  )
  SELECT
    m.mat,
    m.munit,
    m.need,
    m.instock,
    GREATEST(0, m.need - m.instock),
    m.mpack,
    CASE WHEN m.mpack > 0
      THEN CEIL(GREATEST(0, m.need - m.instock) / m.mpack)
      ELSE NULL END,
    m.mbom
  FROM merged m
  WHERE GREATEST(0, m.need - m.instock) > 0;
END;
$function$;
