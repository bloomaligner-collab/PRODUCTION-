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
  WITH calc AS (
    SELECT
      b.id AS bom_id,
      b.material_name,
      b.unit,
      b.pack_size,
      CEIL(
        b.qty_per_aligner
        * (CASE WHEN b.qty_basis = 'per_case' THEN cases_active ELSE aligners_remaining END)
        * (1 + COALESCE(b.safety_reserve_pct,10)/100.0)
      ) AS qty_needed,
      -- Use available_qty (net of reservations) so the figure matches the
      -- stock shown in the Items list, not the gross received quantity.
      COALESCE((
        SELECT SUM(il.available_qty) FROM inventory_lots il
        JOIN inventory_items ii ON il.item_id = ii.id
        WHERE ii.item_name = b.material_name AND il.status = 'active'
      ), 0) AS qty_in_stock
    FROM bom b
    WHERE b.active = true
  )
  SELECT
    c.material_name,
    c.unit,
    c.qty_needed,
    c.qty_in_stock,
    GREATEST(0, c.qty_needed - c.qty_in_stock) AS qty_to_order,
    c.pack_size,
    CASE WHEN c.pack_size > 0
      THEN CEIL(GREATEST(0, c.qty_needed - c.qty_in_stock) / c.pack_size)
      ELSE NULL END AS packs_to_order,
    c.bom_id
  FROM calc c;
END;
$function$;
