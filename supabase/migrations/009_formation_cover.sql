-- ============================================================
-- Force 7 Plateforme — Migration 009 : Image de couverture formation
-- ============================================================

ALTER TABLE catalogue_formations
  ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Bucket public pour les images de couverture
INSERT INTO storage.buckets (id, name, public)
VALUES ('formations', 'formations', true)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique
CREATE POLICY IF NOT EXISTS "public_read_formations_covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'formations');

-- Upload pour les utilisateurs authentifiés (admins)
CREATE POLICY IF NOT EXISTS "authenticated_upload_formations_covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'formations' AND auth.role() = 'authenticated');

-- Suppression pour les utilisateurs authentifiés
CREATE POLICY IF NOT EXISTS "authenticated_delete_formations_covers" ON storage.objects
  FOR DELETE USING (bucket_id = 'formations' AND auth.role() = 'authenticated');
