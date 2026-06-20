-- ============================================================
-- Force 7 Plateforme — Schéma initial
-- 11 tables issues du PRD §3
-- ============================================================

-- gen_random_uuid() est natif depuis PostgreSQL 13 (Supabase default)

-- ─── Types énumérés ──────────────────────────────────────────────────────────

create type statut_dossier as enum (
  'devis_en_attente', 'devis_genere', 'devis_envoye',
  'devis_signe', 'prospect_gagne', 'valide', 'prospect_perdu'
);

create type statut_apprenant as enum (
  'profil_cree', 'profil_keypredict_cree', 'tests_envoyes',
  'tests_soumis', 'profil_edusign_cree',
  'attestation_generee', 'attestation_envoyee', 'dossier_complete'
);

create type statut_collecte as enum (
  'en_attente', 'demande_envoyee', 'relance_envoyee', 'infos_recues'
);

create type type_formation as enum ('INTER', 'INTRA');

create type type_financement as enum (
  'direct', 'opco', 'public_parapublic', 'plateforme_privee'
);

create type statut_document as enum (
  'genere', 'en_attente_validation', 'valide', 'envoye'
);

create type type_document as enum (
  'devis', 'convention', 'convocation', 'attestation',
  'facture', 'feuille_emargement', 'questionnaire_satisfaction', 'pdf_bex'
);

create type sens_conversation as enum ('entrant', 'sortant');

create type statut_validation_message as enum (
  'en_attente', 'valide', 'modifie_et_valide'
);

create type statut_completion as enum ('en_attente', 'complete');

create type role_utilisateur as enum ('admin', 'formateur');

create type type_notification as enum (
  'a_valider', 'reponse_recue', 'relance', 'action_requise'
);

-- ─── Profils utilisateurs (liés à auth.users) ────────────────────────────────

create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role role_utilisateur not null default 'formateur',
  nom text not null,
  prenom text not null,
  formateur_id uuid
);

-- ─── Catalogue formations ─────────────────────────────────────────────────────

create table catalogue_formations (
  id uuid primary key default gen_random_uuid(),
  intitule text not null,
  duree text not null,
  prix_standard numeric(10,2) not null,
  programme_formation text,
  trame_ppt_url text
);

-- ─── Prospects / Clients ──────────────────────────────────────────────────────

create table prospects_clients (
  id uuid primary key default gen_random_uuid(),
  nom_entreprise text not null,
  siret text,
  contact_nom text not null,
  contact_prenom text not null,
  contact_email text not null,
  contact_telephone text,
  contact_fonction text,
  statut statut_dossier not null default 'devis_en_attente',
  type_financement type_financement not null default 'direct',
  type_formation type_formation,
  nombre_stagiaires_estime integer,
  formation_souhaitee uuid references catalogue_formations(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Formateurs ───────────────────────────────────────────────────────────────

create table formateurs (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  email text not null unique,
  specialites text,
  compte_cree_le timestamptz not null default now()
);

-- FK user_profiles → formateurs
alter table user_profiles add constraint fk_user_formateur
  foreign key (formateur_id) references formateurs(id);

-- ─── Sessions de formation ────────────────────────────────────────────────────

create table sessions_formation (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references catalogue_formations(id),
  type_formation type_formation not null,
  date_debut date not null,
  date_fin date not null,
  formateur_id uuid references formateurs(id),
  statut_session text not null default 'en_preparation',
  dossier_onedrive_path text,
  created_at timestamptz not null default now()
);

-- ─── Session ↔ Entreprises (INTER) ───────────────────────────────────────────

create table session_entreprises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions_formation(id) on delete cascade,
  prospect_client_id uuid not null references prospects_clients(id),
  statut_collecte_infos statut_collecte not null default 'en_attente',
  historique_echange_id uuid
);

-- ─── Apprenants ───────────────────────────────────────────────────────────────

create table apprenants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions_formation(id) on delete cascade,
  prospect_client_id uuid not null references prospects_clients(id),
  nom text not null,
  prenom text not null,
  email text not null,
  fonction text,
  statut statut_apprenant not null default 'profil_cree',
  profil_keypredict_id text,
  profil_edusign_id text,
  created_at timestamptz not null default now()
);

-- ─── Documents ────────────────────────────────────────────────────────────────

create table documents (
  id uuid primary key default gen_random_uuid(),
  type_document type_document not null,
  session_id uuid references sessions_formation(id),
  apprenant_id uuid references apprenants(id),
  prospect_client_id uuid references prospects_clients(id),
  statut statut_document not null default 'genere',
  url_stockage_plateforme text,
  url_onedrive text,
  created_at timestamptz not null default now()
);

-- ─── Historique conversations ─────────────────────────────────────────────────

create table historique_conversations (
  id uuid primary key default gen_random_uuid(),
  prospect_client_id uuid references prospects_clients(id),
  session_entreprise_id uuid references session_entreprises(id),
  sens sens_conversation not null,
  contenu text not null,
  statut_validation statut_validation_message,
  date timestamptz not null default now()
);

-- FK session_entreprises → historique_conversations
alter table session_entreprises add constraint fk_historique_echange
  foreign key (historique_echange_id) references historique_conversations(id);

-- ─── BEX — Bilan d'évaluation ─────────────────────────────────────────────────

create table bex_evaluations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions_formation(id) on delete cascade,
  bilan_formateur text,
  checklist_salle jsonb,
  statut_completion statut_completion not null default 'en_attente',
  created_at timestamptz not null default now()
);

create table bex_evaluations_apprenants (
  id uuid primary key default gen_random_uuid(),
  bex_evaluation_id uuid not null references bex_evaluations(id) on delete cascade,
  apprenant_id uuid not null references apprenants(id),
  objectifs_acquis text check (objectifs_acquis in ('acquis', 'non_acquis', 'en_cours')),
  modalites_evaluation text,
  commentaire text
);

-- ─── Notifications ────────────────────────────────────────────────────────────

create table notifications (
  id uuid primary key default gen_random_uuid(),
  destinataire_type text not null check (destinataire_type in ('ilies', 'formateur')),
  destinataire_id uuid not null,
  type type_notification not null,
  lien_objet text,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Trigger updated_at ───────────────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger prospects_clients_updated_at
  before update on prospects_clients
  for each row execute function update_updated_at();

-- ─── RLS ──────────────────────────────────────────────────────────────────────

alter table user_profiles enable row level security;
alter table prospects_clients enable row level security;
alter table sessions_formation enable row level security;
alter table session_entreprises enable row level security;
alter table apprenants enable row level security;
alter table formateurs enable row level security;
alter table catalogue_formations enable row level security;
alter table documents enable row level security;
alter table historique_conversations enable row level security;
alter table bex_evaluations enable row level security;
alter table bex_evaluations_apprenants enable row level security;
alter table notifications enable row level security;

-- Politique : les admins voient tout
create policy "admins_full_access" on prospects_clients
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on sessions_formation
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on session_entreprises
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on apprenants
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on formateurs
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on catalogue_formations
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on documents
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on historique_conversations
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on bex_evaluations
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on bex_evaluations_apprenants
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "admins_full_access" on notifications
  for all using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

-- Politique : un formateur voit ses propres sessions
create policy "formateurs_own_sessions" on sessions_formation
  for select using (
    exists (
      select 1 from user_profiles up
      join formateurs f on f.id = up.formateur_id
      where up.id = auth.uid() and f.id = sessions_formation.formateur_id
    )
  );

create policy "formateurs_own_bex" on bex_evaluations
  for all using (
    exists (
      select 1 from sessions_formation sf
      join user_profiles up on up.formateur_id = sf.formateur_id
      where sf.id = bex_evaluations.session_id and up.id = auth.uid()
    )
  );

-- Chaque utilisateur voit son propre profil
create policy "own_profile" on user_profiles
  for all using (id = auth.uid());
