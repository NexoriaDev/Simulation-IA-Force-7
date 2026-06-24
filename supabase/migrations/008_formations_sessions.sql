-- ============================================================
-- Force 7 Plateforme — Migration 008 : Formations & Sessions
-- Ajoute : categorie sur catalogue_formations,
--          plafond_apprenants sur sessions_formation,
--          table session_formateurs (multi-formateurs)
-- ============================================================

-- Catégorie sur le catalogue
ALTER TABLE catalogue_formations
  ADD COLUMN IF NOT EXISTS categorie text;

-- Plafond apprenants sur les sessions (NULL = pas de plafond)
ALTER TABLE sessions_formation
  ADD COLUMN IF NOT EXISTS plafond_apprenants integer;

-- Table de liaison session ↔ formateurs (remplace le formateur_id unique)
CREATE TABLE IF NOT EXISTS session_formateurs (
  id         uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions_formation(id) on delete cascade,
  formateur_id uuid not null references formateurs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (session_id, formateur_id)
);

-- RLS
ALTER TABLE session_formateurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_full_access" ON session_formateurs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Formateurs voient leurs propres assignations
CREATE POLICY "formateurs_own_sessions" ON session_formateurs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.formateur_id = session_formateurs.formateur_id
    )
  );

-- Backfill : migrer formateur_id existant vers la table de liaison
INSERT INTO session_formateurs (session_id, formateur_id)
  SELECT id, formateur_id FROM sessions_formation
  WHERE formateur_id IS NOT NULL
ON CONFLICT (session_id, formateur_id) DO NOTHING;
