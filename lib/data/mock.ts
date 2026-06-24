import type {
  ProspectClient,
  SessionFormation,
  SessionEntreprise,
  Apprenant,
  HistoriqueConversation,
  Document,
  Notification,
} from '@/lib/types'

// ─── Prospects / Clients ────────────────────────────────────────────────────

export const MOCK_PROSPECTS: ProspectClient[] = [
  {
    id: 'pc-001',
    nom_entreprise: 'BTP Solutions SARL',
    siret: '83721456700021',
    contact_nom: 'Laurent',
    contact_prenom: 'Pierre',
    contact_email: 'p.laurent@btp-solutions.fr',
    contact_telephone: '06 12 34 56 78',
    contact_fonction: 'Responsable RH',
    statut: 'devis_envoye',
    type_financement: 'opco',
    type_formation: 'INTRA',
    nombre_stagiaires_estime: 8,
    formation_souhaitee: 'cat-008',
    created_at: '2026-06-10T09:00:00Z',
    updated_at: '2026-06-20T08:00:00Z',
  },
  {
    id: 'pc-002',
    nom_entreprise: 'Normandie Transport',
    siret: '45127893200043',
    contact_nom: 'Moreau',
    contact_prenom: 'Christine',
    contact_email: 'c.moreau@normandie-transport.fr',
    contact_telephone: '07 65 43 21 09',
    contact_fonction: 'DRH',
    statut: 'prospect_gagne',
    type_financement: 'direct',
    type_formation: 'INTER',
    nombre_stagiaires_estime: 3,
    formation_souhaitee: 'cat-013',
    created_at: '2026-06-05T11:00:00Z',
    updated_at: '2026-06-19T16:00:00Z',
  },
  {
    id: 'pc-003',
    nom_entreprise: 'Conseil Régional Normandie',
    siret: null,
    contact_nom: 'Petit',
    contact_prenom: 'Fabrice',
    contact_email: 'f.petit@normandie.fr',
    contact_telephone: '02 35 67 89 01',
    contact_fonction: 'Chef de service Formation',
    statut: 'valide',
    type_financement: 'public_parapublic',
    type_formation: 'INTRA',
    nombre_stagiaires_estime: 12,
    formation_souhaitee: 'cat-011',
    created_at: '2026-05-20T08:00:00Z',
    updated_at: '2026-06-15T10:00:00Z',
  },
  {
    id: 'pc-004',
    nom_entreprise: 'Havre Logistique SA',
    siret: '61234789100056',
    contact_nom: 'Bernard',
    contact_prenom: 'Jean-Luc',
    contact_email: 'jl.bernard@havre-logistique.fr',
    contact_telephone: '06 98 76 54 32',
    contact_fonction: 'Directeur Technique',
    statut: 'devis_signe',
    type_financement: 'direct',
    type_formation: 'INTER',
    nombre_stagiaires_estime: 4,
    formation_souhaitee: 'cat-008',
    created_at: '2026-06-12T14:00:00Z',
    updated_at: '2026-06-20T09:00:00Z',
  },
  {
    id: 'pc-005',
    nom_entreprise: 'Cabinet Dupuis & Associés',
    siret: '72345678900012',
    contact_nom: 'Dupuis',
    contact_prenom: 'Sandrine',
    contact_email: 's.dupuis@dupuis-assoc.fr',
    contact_telephone: null,
    contact_fonction: 'Associée',
    statut: 'devis_en_attente',
    type_financement: 'direct',
    type_formation: 'INTRA',
    nombre_stagiaires_estime: 5,
    formation_souhaitee: 'cat-005',
    created_at: '2026-06-19T16:00:00Z',
    updated_at: '2026-06-19T16:00:00Z',
  },
  {
    id: 'pc-006',
    nom_entreprise: 'Actiris Transport',
    siret: '53218967400031',
    contact_nom: 'Renault',
    contact_prenom: 'Marc',
    contact_email: 'm.renault@actiris.fr',
    contact_telephone: '06 45 67 89 01',
    contact_fonction: 'Responsable Formation',
    statut: 'prospect_gagne',
    type_financement: 'opco',
    type_formation: 'INTER',
    nombre_stagiaires_estime: 2,
    formation_souhaitee: 'cat-013',
    created_at: '2026-06-08T10:00:00Z',
    updated_at: '2026-06-18T11:00:00Z',
  },
]

// ─── Catalogue formations ───────────────────────────────────────────────────

export const MOCK_CATALOGUE = [
  { id: 'cat-001', intitule: 'Accompagnement Coaching', duree: '2 jours', prix_standard: 950 },
  { id: 'cat-002', intitule: 'Achats / Ventes', duree: '2 jours', prix_standard: 850 },
  { id: 'cat-003', intitule: 'Bureautique / IA / Cybersécurité', duree: '2 jours', prix_standard: 750 },
  { id: 'cat-004', intitule: 'Communication / Communication digitale', duree: '2 jours', prix_standard: 800 },
  { id: 'cat-005', intitule: 'Comptabilité / Gestion', duree: '3 jours', prix_standard: 1100 },
  { id: 'cat-006', intitule: 'Développement Informatique', duree: '3 jours', prix_standard: 1400 },
  { id: 'cat-007', intitule: 'Développement personnel', duree: '2 jours', prix_standard: 900 },
  { id: 'cat-008', intitule: 'Hygiène Sécurité Environnement', duree: '2 jours', prix_standard: 850 },
  { id: 'cat-009', intitule: 'Langue Anglaise', duree: 'selon niveau', prix_standard: 500 },
  { id: 'cat-010', intitule: 'Langues étrangères', duree: 'selon niveau', prix_standard: 500 },
  { id: 'cat-011', intitule: 'Management / RSE / Interculturel', duree: '3 jours', prix_standard: 1200 },
  { id: 'cat-012', intitule: 'Ressources humaines', duree: '2 jours', prix_standard: 950 },
  { id: 'cat-013', intitule: 'Transport Logistique Commerce International', duree: '3 jours', prix_standard: 1100 },
]

// ─── Formateurs ─────────────────────────────────────────────────────────────

export const MOCK_FORMATEURS = [
  { id: 'form-001', nom: 'Renard', prenom: 'Thierry', email: 't.renard@formateurs.fr', specialites: 'Hygiène Sécurité Environnement, Transport Logistique Commerce International', compte_cree_le: '2025-03-15' },
  { id: 'form-002', nom: 'Duval', prenom: 'Isabelle', email: 'i.duval@formateurs.fr', specialites: 'Management / RSE / Interculturel, Communication / Communication digitale, Ressources humaines', compte_cree_le: '2025-06-01' },
]

// ─── Flags urgence (détectés par l'IA) ──────────────────────────────────────

export const MOCK_URGENCES: Record<string, boolean> = {
  'pc-002': true,
  'pc-004': true,
}

// ─── Sessions ───────────────────────────────────────────────────────────────

export const MOCK_SESSIONS: SessionFormation[] = [
  {
    id: 'ses-001',
    formation_id: 'cat-013',
    type_formation: 'INTER',
    date_debut: '2026-07-07',
    date_fin: '2026-07-08',
    formateur_id: 'form-001',
    plafond_apprenants: null,
    statut_session: 'En cours de préparation',
    dossier_onedrive_path: null,
    created_at: '2026-06-16T00:00:00Z',
  },
  {
    id: 'ses-002',
    formation_id: 'cat-011',
    type_formation: 'INTRA',
    date_debut: '2026-07-28',
    date_fin: '2026-07-30',
    formateur_id: 'form-002',
    plafond_apprenants: null,
    statut_session: 'En cours de préparation',
    dossier_onedrive_path: null,
    created_at: '2026-06-15T00:00:00Z',
  },
]

// ─── Session entreprises (INTER) ─────────────────────────────────────────────

export const MOCK_SESSION_ENTREPRISES: SessionEntreprise[] = [
  {
    id: 'se-001',
    session_id: 'ses-001',
    prospect_client_id: 'pc-002',
    statut_collecte_infos: 'infos_recues',
    historique_echange_id: null,
  },
  {
    id: 'se-002',
    session_id: 'ses-001',
    prospect_client_id: 'pc-006',
    statut_collecte_infos: 'relance_envoyee',
    historique_echange_id: null,
  },
]

// ─── Apprenants ──────────────────────────────────────────────────────────────

export const MOCK_APPRENANTS: Apprenant[] = [
  // Session ses-001 (Transport Logistique INTER) — entreprise Normandie Transport (infos reçues)
  {
    id: 'app-001',
    session_id: 'ses-001',
    prospect_client_id: 'pc-002',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 's.martin@normandie-transport.fr',
    fonction: 'Conductrice',
    statut: 'tests_soumis',
    profil_keypredict_id: 'kp-001',
    profil_edusign_id: 'es-001',
    created_at: '2026-06-17T00:00:00Z',
  },
  {
    id: 'app-002',
    session_id: 'ses-001',
    prospect_client_id: 'pc-002',
    nom: 'Dupont',
    prenom: 'Marc',
    email: 'm.dupont@normandie-transport.fr',
    fonction: 'Conducteur',
    statut: 'tests_envoyes',
    profil_keypredict_id: 'kp-002',
    profil_edusign_id: 'es-002',
    created_at: '2026-06-17T00:00:00Z',
  },
  {
    id: 'app-003',
    session_id: 'ses-001',
    prospect_client_id: 'pc-002',
    nom: 'Leblanc',
    prenom: 'Anne',
    email: 'a.leblanc@normandie-transport.fr',
    fonction: 'Assistante logistique',
    statut: 'profil_keypredict_cree',
    profil_keypredict_id: 'kp-003',
    profil_edusign_id: null,
    created_at: '2026-06-17T00:00:00Z',
  },
  // Session ses-002 (Management / RSE / Interculturel INTRA) — Conseil Régional Normandie
  {
    id: 'app-004',
    session_id: 'ses-002',
    prospect_client_id: 'pc-003',
    nom: 'Rousseau',
    prenom: 'Élodie',
    email: 'e.rousseau@normandie.fr',
    fonction: 'Chargée de mission',
    statut: 'profil_edusign_cree',
    profil_keypredict_id: 'kp-004',
    profil_edusign_id: 'es-004',
    created_at: '2026-06-16T00:00:00Z',
  },
  {
    id: 'app-005',
    session_id: 'ses-002',
    prospect_client_id: 'pc-003',
    nom: 'Garnier',
    prenom: 'Thomas',
    email: 't.garnier@normandie.fr',
    fonction: 'Responsable service',
    statut: 'tests_soumis',
    profil_keypredict_id: 'kp-005',
    profil_edusign_id: 'es-005',
    created_at: '2026-06-16T00:00:00Z',
  },
]

// ─── Historique conversations ────────────────────────────────────────────────

export const MOCK_CONVERSATIONS: Record<string, HistoriqueConversation[]> = {
  'pc-001': [
    {
      id: 'conv-001',
      prospect_client_id: 'pc-001',
      session_entreprise_id: null,
      sens: 'entrant',
      contenu: `Bonjour,\n\nNous souhaitons organiser une formation Hygiène Sécurité Environnement pour 8 techniciens de notre équipe. Nous avons besoin de couvrir les risques professionnels et les pratiques de prévention avant un audit qualité prévu en août.\n\nPouvez-vous nous faire une proposition ?\n\nCordialement,\nPierre Laurent\nResponsable RH — BTP Solutions SARL`,
      statut_validation: null,
      date: '2026-06-10T09:14:00Z',
    },
    {
      id: 'conv-002',
      prospect_client_id: 'pc-001',
      session_entreprise_id: null,
      sens: 'sortant',
      contenu: `Bonjour M. Laurent,\n\nMerci pour votre prise de contact. Force 7 Formation peut tout à fait organiser cette formation Hygiène Sécurité Environnement pour vos techniciens.\n\nAfin de vous établir un devis précis, pourriez-vous m'indiquer :\n• Les principaux risques ciblés (travail en hauteur, risques chimiques, incendie...)\n• Votre localisation (la formation peut se tenir dans vos locaux ou dans nos centres)\n• Votre OPCO afin d'explorer les possibilités de prise en charge\n\nBien cordialement,\nIliès\nForce 7 Formation`,
      statut_validation: 'valide',
      date: '2026-06-10T11:30:00Z',
    },
    {
      id: 'conv-003',
      prospect_client_id: 'pc-001',
      session_entreprise_id: null,
      sens: 'entrant',
      contenu: `Bonjour Iliès,\n\nNos techniciens sont exposés principalement aux risques chimiques et au travail en hauteur. La formation se tiendra dans nos locaux au Havre (76600). Nous sommes rattachés à l'OPCO EP.\n\nMerci,\nPierre Laurent`,
      statut_validation: null,
      date: '2026-06-11T08:45:00Z',
    },
    {
      id: 'conv-004',
      prospect_client_id: 'pc-001',
      session_entreprise_id: null,
      sens: 'sortant',
      contenu: `Bonjour M. Laurent,\n\nVeuillez trouver ci-joint notre devis n° DEV-2026-0087 pour la formation Hygiène Sécurité Environnement pour 8 personnes.\n\n• Formation en intra dans vos locaux au Havre\n• Durée : 2 jours (14h) — 14 et 15 juillet 2026\n• Tarif : 850 € HT/pers., soit 6 800 € HT pour le groupe\n• Financement OPCO EP : prise en charge jusqu'à 100 % possible\n\nLe devis est valable 30 jours.\n\nBien cordialement,\nIliès — Force 7 Formation`,
      statut_validation: 'valide',
      date: '2026-06-13T09:00:00Z',
    },
    {
      id: 'conv-005',
      prospect_client_id: 'pc-001',
      session_entreprise_id: null,
      sens: 'sortant',
      contenu: `Bonjour M. Laurent,\n\nJe me permets de revenir vers vous concernant notre devis n° DEV-2026-0087 envoyé le 13 juin. Sans retour de votre part à ce jour, je reste disponible pour répondre à vos questions ou ajuster notre proposition.\n\nVotre audit qualité approchant en août, il serait opportun de valider rapidement les dates afin de garantir la disponibilité du formateur.\n\nBien cordialement,\nIliès — Force 7 Formation`,
      statut_validation: 'en_attente',
      date: '2026-06-20T08:00:00Z',
    },
  ],
  'pc-002': [
    {
      id: 'conv-010',
      prospect_client_id: 'pc-002',
      session_entreprise_id: null,
      sens: 'entrant',
      contenu: `Bonjour,\n\nJe suis DRH chez Normandie Transport. Nous souhaitons inscrire 3 de nos conducteurs à une formation Transport Logistique Commerce International. Ce serait une session en inter si possible, car nous avons un budget limité cette année.\n\nCordialement,\nChristine Moreau`,
      statut_validation: null,
      date: '2026-06-05T11:20:00Z',
    },
    {
      id: 'conv-011',
      prospect_client_id: 'pc-002',
      session_entreprise_id: null,
      sens: 'sortant',
      contenu: `Bonjour Mme Moreau,\n\nMerci pour votre intérêt. Force 7 organise régulièrement des sessions Transport Logistique Commerce International en inter sur Le Havre — la prochaine est prévue les 7, 8 et 9 juillet 2026.\n\nJe vous transmets notre devis (DEV-2026-0088) : 1 100 € HT/pers. soit 3 300 € HT pour 3 stagiaires. Financement possible via votre OPCO si applicable.\n\nN'hésitez pas à me revenir pour tout renseignement.\n\nCordialement,\nIliès — Force 7 Formation`,
      statut_validation: 'valide',
      date: '2026-06-06T09:00:00Z',
    },
    {
      id: 'conv-012',
      prospect_client_id: 'pc-002',
      session_entreprise_id: null,
      sens: 'entrant',
      contenu: `Bonjour Iliès,\n\nLes dates et le tarif nous conviennent. Vous trouverez le devis signé en pièce jointe. Pouvez-vous nous envoyer la convention de formation ?\n\nChristine Moreau`,
      statut_validation: null,
      date: '2026-06-14T10:30:00Z',
    },
    {
      id: 'conv-013',
      prospect_client_id: 'pc-002',
      session_entreprise_id: null,
      sens: 'sortant',
      contenu: `Bonjour Mme Moreau,\n\nMerci pour votre retour. Veuillez trouver ci-joint la convention de formation n° CONV-2026-0042 pour 3 stagiaires les 7, 8 et 9 juillet 2026.\n\nNous avons par ailleurs créé les profils d'évaluation Keypredict pour vos 3 stagiaires. Chacun va recevoir un email avec accès à son test de positionnement (durée : 20 min). Merci de les encourager à le compléter avant le 30 juin.\n\nBien cordialement,\nIliès — Force 7 Formation`,
      statut_validation: 'valide',
      date: '2026-06-16T11:00:00Z',
    },
  ],
}

// ─── Documents ───────────────────────────────────────────────────────────────

export const MOCK_DOCUMENTS: Record<string, Document[]> = {
  'pc-001': [
    {
      id: 'doc-001',
      type_document: 'devis',
      session_id: null,
      apprenant_id: null,
      prospect_client_id: 'pc-001',
      statut: 'envoye',
      url_stockage_plateforme: '/documents/DEV-2026-0087.pdf',
      url_onedrive: null,
      created_at: '2026-06-13T09:00:00Z',
    },
  ],
  'pc-002': [
    {
      id: 'doc-002',
      type_document: 'devis',
      session_id: null,
      apprenant_id: null,
      prospect_client_id: 'pc-002',
      statut: 'envoye',
      url_stockage_plateforme: '/documents/DEV-2026-0088.pdf',
      url_onedrive: null,
      created_at: '2026-06-06T09:00:00Z',
    },
    {
      id: 'doc-003',
      type_document: 'convention',
      session_id: null,
      apprenant_id: null,
      prospect_client_id: 'pc-002',
      statut: 'envoye',
      url_stockage_plateforme: '/documents/CONV-2026-0042.pdf',
      url_onedrive: null,
      created_at: '2026-06-16T11:00:00Z',
    },
  ],
  'pc-003': [
    {
      id: 'doc-004',
      type_document: 'devis',
      session_id: null,
      apprenant_id: null,
      prospect_client_id: 'pc-003',
      statut: 'envoye',
      url_stockage_plateforme: '/documents/DEV-2026-0081.pdf',
      url_onedrive: null,
      created_at: '2026-05-22T10:00:00Z',
    },
    {
      id: 'doc-005',
      type_document: 'convention',
      session_id: null,
      apprenant_id: null,
      prospect_client_id: 'pc-003',
      statut: 'envoye',
      url_stockage_plateforme: '/documents/CONV-2026-0038.pdf',
      url_onedrive: null,
      created_at: '2026-06-02T09:00:00Z',
    },
  ],
}


// ─── Notifications ────────────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    destinataire_type: 'ilies',
    destinataire_id: 'user-001',
    type: 'a_valider',
    lien_objet: 'pc-001',
    lu: false,
    created_at: '2026-06-20T08:00:00Z',
  },
  {
    id: 'notif-002',
    destinataire_type: 'ilies',
    destinataire_id: 'user-001',
    type: 'a_valider',
    lien_objet: 'pc-004',
    lu: false,
    created_at: '2026-06-19T11:00:00Z',
  },
  {
    id: 'notif-003',
    destinataire_type: 'ilies',
    destinataire_id: 'user-001',
    type: 'a_valider',
    lien_objet: 'pc-003',
    lu: false,
    created_at: '2026-06-18T16:00:00Z',
  },
  {
    id: 'notif-004',
    destinataire_type: 'ilies',
    destinataire_id: 'user-001',
    type: 'reponse_recue',
    lien_objet: 'pc-002',
    lu: true,
    created_at: '2026-06-14T10:30:00Z',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getProspect(id: string): ProspectClient | undefined {
  return MOCK_PROSPECTS.find((p) => p.id === id)
}

export function getCatalogueFormation(id: string) {
  return MOCK_CATALOGUE.find((c) => c.id === id)
}

export function getFormateur(id: string) {
  return MOCK_FORMATEURS.find((f) => f.id === id)
}

export function getSessionsForProspect(prospectId: string): SessionFormation[] {
  const directSessions = MOCK_SESSIONS.filter(
    (s) => s.type_formation === 'INTRA'
  ).filter((s) => {
    const apprenants = MOCK_APPRENANTS.filter(
      (a) => a.session_id === s.id && a.prospect_client_id === prospectId
    )
    return apprenants.length > 0
  })

  const interSessions = MOCK_SESSION_ENTREPRISES.filter(
    (se) => se.prospect_client_id === prospectId
  )
    .map((se) => MOCK_SESSIONS.find((s) => s.id === se.session_id))
    .filter(Boolean) as SessionFormation[]

  return [...new Map([...directSessions, ...interSessions].map((s) => [s.id, s])).values()]
}

export function getSessionEntreprisesForSession(sessionId: string): SessionEntreprise[] {
  return MOCK_SESSION_ENTREPRISES.filter((se) => se.session_id === sessionId)
}

export function getApprenantsForSession(sessionId: string, prospectId?: string): Apprenant[] {
  return MOCK_APPRENANTS.filter(
    (a) => a.session_id === sessionId && (!prospectId || a.prospect_client_id === prospectId)
  )
}
