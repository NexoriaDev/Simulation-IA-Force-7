-- ============================================================
-- Force 7 Plateforme — Migration 007 : Enrichissement formateurs
-- Ajoute : telephone, actif, statut_invitation
-- + données de démo complémentaires
-- ============================================================

ALTER TABLE formateurs ADD COLUMN IF NOT EXISTS telephone text;
ALTER TABLE formateurs ADD COLUMN IF NOT EXISTS actif boolean NOT NULL DEFAULT true;
ALTER TABLE formateurs ADD COLUMN IF NOT EXISTS statut_invitation text NOT NULL DEFAULT 'actif'
  CHECK (statut_invitation IN ('actif', 'invite', 'inactif'));

-- Enrichit les 3 formateurs existants du seed
UPDATE formateurs SET telephone = '06 12 34 56 78', actif = true  WHERE id = '33333333-0000-0000-0000-000000000001';
UPDATE formateurs SET telephone = '06 23 45 67 89', actif = true  WHERE id = '33333333-0000-0000-0000-000000000002';
UPDATE formateurs SET telephone = '06 34 56 78 90', actif = false WHERE id = '33333333-0000-0000-0000-000000000003';

-- 2 formateurs supplémentaires pour la démo
INSERT INTO formateurs (id, nom, prenom, email, specialites, telephone, actif, statut_invitation, compte_cree_le) VALUES
  ('33333333-0000-0000-0000-000000000004',
   'Bernard', 'Sophie', 's.bernard@formaction-normandie.fr',
   'Ressources humaines, Développement personnel', '06 45 67 89 01', true, 'actif',
   '2025-06-01 09:00:00+00'),
  ('33333333-0000-0000-0000-000000000005',
   'Nguyen', 'Paul', 'p.nguyen@langues-pro.fr',
   'Langue Anglaise, Langues étrangères', '06 56 78 90 12', false, 'inactif',
   '2024-09-15 11:00:00+00')
ON CONFLICT (email) DO NOTHING;

-- Session en cours pour la démo (Marc Vaillant — Développement personnel)
INSERT INTO sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session)
VALUES (
  '44444444-0000-0000-0000-000000000007',
  '11111111-0000-0000-0000-000000000007', 'INTRA',
  '2026-06-20', '2026-06-27',
  '33333333-0000-0000-0000-000000000001', 'en_cours'
) ON CONFLICT (id) DO NOTHING;

-- Session passée (Marc Vaillant — HSE, mars 2026)
INSERT INTO sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session)
VALUES (
  '44444444-0000-0000-0000-000000000008',
  '11111111-0000-0000-0000-000000000008', 'INTER',
  '2026-03-10', '2026-03-11',
  '33333333-0000-0000-0000-000000000001', 'termine'
) ON CONFLICT (id) DO NOTHING;

-- Session passée (Nathalie Chevalier — Ressources humaines, avril 2026)
INSERT INTO sessions_formation (id, formation_id, type_formation, date_debut, date_fin, formateur_id, statut_session)
VALUES (
  '44444444-0000-0000-0000-000000000009',
  '11111111-0000-0000-0000-000000000012', 'INTRA',
  '2026-04-14', '2026-04-15',
  '33333333-0000-0000-0000-000000000002', 'termine'
) ON CONFLICT (id) DO NOTHING;
