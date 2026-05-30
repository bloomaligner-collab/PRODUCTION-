ALTER TABLE public.outsourced_orders
  DROP CONSTRAINT outsourced_orders_case_id_supplier_id_key;

ALTER TABLE public.outsourced_orders
  ADD CONSTRAINT outsourced_orders_case_id_supplier_id_date_key
  UNIQUE (case_id, supplier_id, outsource_date);
