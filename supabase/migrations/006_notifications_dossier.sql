-- ============================================================
-- Force 7 Plateforme — Migration 006 : Notifications dossier
-- Ajoute :
--   • colonne `objet` sur historique_conversations (objet email IA)
--   • table notifications_dossier (trace écrite permanente)
-- ============================================================

-- Objet de l'email quand un message est généré par l'IA
ALTER TABLE historique_conversations
  ADD COLUMN IF NOT EXISTS objet text;

-- Historique des événements d'un dossier (non modifiable)
CREATE TABLE notifications_dossier (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_client_id uuid        NOT NULL REFERENCES prospects_clients(id) ON DELETE CASCADE,
  type               text        NOT NULL CHECK (type IN (
                       'email_envoye', 'reponse_recue', 'statut_change',
                       'action_validee', 'action_modifiee', 'relance', 'dossier_cree', 'ia_genere'
                     )),
  texte              text        NOT NULL,
  meta               jsonb       NOT NULL DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON notifications_dossier(prospect_client_id, created_at DESC);

ALTER TABLE notifications_dossier ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_full_access" ON notifications_dossier
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
