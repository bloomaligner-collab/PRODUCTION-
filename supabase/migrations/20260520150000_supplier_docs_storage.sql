-- 20260520150000_supplier_docs_storage.sql
--
-- Private storage bucket for supplier certifications and contracts.
-- Authenticated users can read and upload; only the original uploader
-- (or a manager) can delete. The bucket is private; the browser opens
-- attachments via signed URLs.

INSERT INTO storage.buckets (id, name, public)
VALUES ('supplier-docs', 'supplier-docs', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS supplier_docs_read   ON storage.objects;
DROP POLICY IF EXISTS supplier_docs_insert ON storage.objects;
DROP POLICY IF EXISTS supplier_docs_delete ON storage.objects;

CREATE POLICY supplier_docs_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'supplier-docs');

CREATE POLICY supplier_docs_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'supplier-docs');

CREATE POLICY supplier_docs_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'supplier-docs'
    AND (owner = auth.uid() OR public.cw_is_manager())
  );

-- supplier_documents.attachment_url stores the storage object path
-- (e.g. "<supplier_id>/<random>.pdf"). The browser turns it into a
-- signed URL at view time so we don't expose the bucket publicly.
-- attachment_url already exists from 20260520140000_audit_module_extensions.sql.
