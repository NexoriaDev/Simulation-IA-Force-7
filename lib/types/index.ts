// Types issus du PRD §3 — 11 entités de données

export type StatutDossier =
  | 'profil_cree'
  | 'devis_en_attente'
  | 'devis_genere'
  | 'devis_envoye'
  | 'devis_signe'
  | 'prospect_gagne'
  | 'valide'
  | 'prospect_perdu'

export type StatutApprenant =
  | 'profil_cree'
  | 'profil_keypredict_cree'
  | 'tests_envoyes'
  | 'tests_soumis'
  | 'profil_edusign_cree'
  | 'attestation_generee'
  | 'attestation_envoyee'
  | 'dossier_complete'

export type StatutCollecteEntreprise =
  | 'en_attente'
  | 'demande_envoyee'
  | 'relance_envoyee'
  | 'infos_recues'

export type TypeFormation = 'INTER' | 'INTRA'

export type TypeFinancement =
  | 'direct'
  | 'opco'
  | 'public_parapublic'
  | 'plateforme_privee'

export type StatutDocument =
  | 'genere'
  | 'en_attente_validation'
  | 'valide'
  | 'envoye'

export type TypeDocument =
  | 'devis'
  | 'convention'
  | 'convocation'
  | 'attestation'
  | 'facture'
  | 'feuille_emargement'
  | 'questionnaire_satisfaction'
  | 'pdf_bex'

export type SensConversation = 'entrant' | 'sortant'

export type StatutValidationMessage =
  | 'en_attente'
  | 'valide'
  | 'modifie_et_valide'

export type StatutCompletion = 'en_attente' | 'complete'

export type RoleUtilisateur = 'admin' | 'formateur'

export type TypeNotification =
  | 'a_valider'
  | 'reponse_recue'
  | 'relance'
  | 'action_requise'

// ─── Tables ─────────────────────────────────────────────────────────────────

export interface ProspectClient {
  id: string
  nom_entreprise: string
  siret: string | null
  contact_nom: string
  contact_prenom: string
  contact_email: string
  contact_telephone: string | null
  contact_fonction: string | null
  statut: StatutDossier
  type_financement: TypeFinancement
  type_formation: TypeFormation | null
  nombre_stagiaires_estime: number | null
  formation_souhaitee: string | null // FK catalogue_formations.id
  created_at: string
  updated_at: string
}

export interface SessionFormation {
  id: string
  formation_id: string // FK catalogue_formations.id
  type_formation: TypeFormation
  date_debut: string
  date_fin: string
  formateur_id: string | null // FK formateurs.id (legacy — voir session_formateurs)
  plafond_apprenants: number | null
  statut_session: string
  dossier_onedrive_path: string | null
  created_at: string
}

export interface SessionFormateur {
  id: string
  session_id: string
  formateur_id: string
  created_at: string
}

export interface SessionEntreprise {
  id: string
  session_id: string
  prospect_client_id: string
  statut_collecte_infos: StatutCollecteEntreprise
  historique_echange_id: string | null
}

export interface Apprenant {
  id: string
  session_id: string
  prospect_client_id: string
  nom: string
  prenom: string
  email: string
  fonction: string | null
  statut: StatutApprenant
  profil_keypredict_id: string | null
  profil_edusign_id: string | null
  created_at: string
}

export interface Formateur {
  id: string
  nom: string
  prenom: string
  email: string
  specialites: string | null
  compte_cree_le: string
}

export interface CatalogueFormation {
  id: string
  intitule: string
  categorie: string | null
  duree: string
  prix_standard: number
  programme_formation: string | null
  trame_ppt_url: string | null
}

export interface Document {
  id: string
  type_document: TypeDocument
  session_id: string | null
  apprenant_id: string | null
  prospect_client_id: string | null
  statut: StatutDocument
  url_stockage_plateforme: string | null
  url_onedrive: string | null
  created_at: string
}

export interface HistoriqueConversation {
  id: string
  prospect_client_id: string | null
  session_entreprise_id: string | null
  sens: SensConversation
  contenu: string
  statut_validation: StatutValidationMessage | null
  date: string
}

export interface BexEvaluation {
  id: string
  session_id: string
  bilan_formateur: string | null
  checklist_salle: Record<string, unknown> | null
  statut_completion: StatutCompletion
  created_at: string
}

export interface BexEvaluationApprenant {
  id: string
  bex_evaluation_id: string
  apprenant_id: string
  objectifs_acquis: 'acquis' | 'non_acquis' | 'en_cours' | null
  modalites_evaluation: string | null
  commentaire: string | null
}

export interface Notification {
  id: string
  destinataire_type: 'ilies' | 'formateur'
  destinataire_id: string
  type: TypeNotification
  lien_objet: string | null
  lu: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  role: RoleUtilisateur
  nom: string
  prenom: string
  formateur_id: string | null
}

// ─── Campagnes d'emailing ────────────────────────────────────────────────────

export type ModeEnvoiCampagne = 'maintenant' | 'programme'
export type StatutCampagne = 'brouillon' | 'active' | 'inactive'
export type CritereCle = 'statut' | 'type_formation' | 'categorie' | 'formation'

export interface CampagneCritere {
  id: string
  campagne_id: string
  cle: CritereCle
  valeur: string
  created_at: string
}

export interface CampagneEmail {
  id: string
  nom: string
  objet: string
  corps: string
  statut: StatutCampagne
  mode_envoi: ModeEnvoiCampagne
  envoyer_le: string | null
  created_at: string
  updated_at: string
  criteres: CampagneCritere[]
  nb_destinataires: number
}

// ─── Type Supabase Database (référencé par les clients) ─────────────────────

export type Database = {
  public: {
    Tables: {
      prospects_clients: { Row: ProspectClient; Insert: Omit<ProspectClient, 'id' | 'created_at' | 'updated_at'>; Update: Partial<ProspectClient> }
      sessions_formation: { Row: SessionFormation; Insert: Omit<SessionFormation, 'id' | 'created_at'>; Update: Partial<SessionFormation> }
      session_entreprises: { Row: SessionEntreprise; Insert: Omit<SessionEntreprise, 'id'>; Update: Partial<SessionEntreprise> }
      apprenants: { Row: Apprenant; Insert: Omit<Apprenant, 'id' | 'created_at'>; Update: Partial<Apprenant> }
      formateurs: { Row: Formateur; Insert: Omit<Formateur, 'id'>; Update: Partial<Formateur> }
      catalogue_formations: { Row: CatalogueFormation; Insert: Omit<CatalogueFormation, 'id'>; Update: Partial<CatalogueFormation> }
      documents: { Row: Document; Insert: Omit<Document, 'id' | 'created_at'>; Update: Partial<Document> }
      historique_conversations: { Row: HistoriqueConversation; Insert: Omit<HistoriqueConversation, 'id'>; Update: Partial<HistoriqueConversation> }
      bex_evaluations: { Row: BexEvaluation; Insert: Omit<BexEvaluation, 'id' | 'created_at'>; Update: Partial<BexEvaluation> }
      bex_evaluations_apprenants: { Row: BexEvaluationApprenant; Insert: Omit<BexEvaluationApprenant, 'id'>; Update: Partial<BexEvaluationApprenant> }
      notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Notification> }
      user_profiles: { Row: UserProfile; Insert: Omit<UserProfile, 'id'>; Update: Partial<UserProfile> }
    }
  }
}
