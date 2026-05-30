CREATE OR REPLACE FUNCTION public.generate_auto_requisitions()
 RETURNS TABLE(material_name text, unit text, qty_needed numeric, qty_in_stock numeric, qty_to_order numeric, pack_size numeric, packs_to_order numeric, bom_id uuid)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  aligners_remaining NUMERIC;
  total_planned NUMERIC := 0;
  total_produced NUMERIC := 0;
BEGIN
  -- Calculate total aligners remaining to produce.
  -- number_of_aligners is free-text and may be '' for many rows, so coerce
  -- empty/blank strings to NULL before casting to avoid 22P02 errors.
  SELECT COALESCE(SUM(
    COALESCE(NULLIF(btrim(bad.number_of_aligners::text), '')::NUMERIC,
             COALESCE(bad.aligner_upper,0) + COALESCE(bad.aligner_lower,0))
  ), 0)
  INTO total_planned
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

  -- Calculate material needs from BOM
  RETURN QUERY
  SELECT
    b.material_name,
    b.unit,
    CEIL(b.qty_per_aligner * aligners_remaining * (1 + COALESCE(b.safety_reserve_pct,10)/100.0)) as qty_needed,
    COALESCE((
      SELECT SUM(il.quantity) FROM inventory_lots il
      JOIN inventory_items ii ON il.item_id = ii.id
      WHERE ii.item_name = b.material_name AND il.status = 'active'
    ), 0) as qty_in_stock,
    GREATEST(0, CEIL(b.qty_per_aligner * aligners_remaining * (1 + COALESCE(b.safety_reserve_pct,10)/100.0)) -
      COALESCE((
        SELECT SUM(il.quantity) FROM inventory_lots il
        JOIN inventory_items ii ON il.item_id = ii.id
        WHERE ii.item_name = b.material_name AND il.status = 'active'
      ), 0)
    ) as qty_to_order,
    b.pack_size,
    CASE WHEN b.pack_size > 0 THEN
      CEIL(GREATEST(0, CEIL(b.qty_per_aligner * aligners_remaining * (1 + COALESCE(b.safety_reserve_pct,10)/100.0)) -
        COALESCE((
          SELECT SUM(il.quantity) FROM inventory_lots il
          JOIN inventory_items ii ON il.item_id = ii.id
          WHERE ii.item_name = b.material_name AND il.status = 'active'
        ), 0)) / b.pack_size)
    ELSE NULL END as packs_to_order,
    b.id as bom_id
  FROM bom b
  WHERE b.active = true;
END;
$function$;
