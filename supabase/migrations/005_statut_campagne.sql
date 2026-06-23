-- ============================================================
-- Force 7 Plateforme — Migration 005 : Statut campagne 3 valeurs
-- Remplace le booléen actif par brouillon | active | inactive
-- ============================================================

ALTER TABLE campagnes_email ADD COLUMN statut text NOT NULL DEFAULT 'brouillon';

-- Bascule les campagnes existantes selon leur ancien état binaire
UPDATE campagnes_email
SET statut = CASE WHEN actif THEN 'active' ELSE 'inactive' END;

ALTER TABLE campagnes_email DROP COLUMN actif;

ALTER TABLE campagnes_email
  ADD CONSTRAINT campagnes_email_statut_check
  CHECK (statut IN ('brouillon', 'active', 'inactive'));
