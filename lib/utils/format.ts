import type {
  StatutDossier,
  StatutApprenant,
  StatutCollecteEntreprise,
  TypeFinancement,
  TypeDocument,
  StatutDocument,
} from '@/lib/types'
import type { AValiderType } from '@/lib/data/mock'

// ─── Date ────────────────────────────────────────────────────────────────────

const DEMO_NOW = new Date('2026-06-20T12:00:00Z')

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const diffMs = DEMO_NOW.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffHours / 24

  if (diffHours < 1) return "à l'instant"
  if (diffHours < 24) return `il y a ${Math.floor(diffHours)}h`
  if (diffDays < 2) return 'hier'
  if (diffDays < 7) return `il y a ${Math.floor(diffDays)}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Statut dossier ──────────────────────────────────────────────────────────

export const STATUTS_DOSSIER_ORDER: StatutDossier[] = [
  'profil_cree',
  'devis_en_attente',
  'devis_genere',
  'devis_envoye',
  'devis_signe',
  'prospect_gagne',
  'valide',
]

interface StatusConfig {
  label: string
  bg: string
  text: string
  border: string
}

export function getTypeDossier(statut: StatutDossier): 'Prospect' | 'Client' | 'Perdu' {
  if (statut === 'prospect_perdu') return 'Perdu'
  if (statut === 'valide') return 'Client'
  return 'Prospect'
}

export const STATUT_DOSSIER_CONFIG: Record<StatutDossier, StatusConfig> = {
  profil_cree: {
    label: 'Profil créé',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
  devis_en_attente: {
    label: 'Devis en attente',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  devis_genere: {
    label: 'Devis généré',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  devis_envoye: {
    label: 'Devis envoyé',
    bg: 'bg-blue-50',
    text: 'text-[#0A4D8C]',
    border: 'border-blue-200',
  },
  devis_signe: {
    label: 'Devis signé',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  prospect_gagne: {
    label: 'Prospect gagné',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  valide: {
    label: 'Validé',
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  prospect_perdu: {
    label: 'Prospect perdu',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
  },
}

export function getStatutDossierStep(statut: StatutDossier): number {
  const idx = STATUTS_DOSSIER_ORDER.indexOf(statut)
  return idx === -1 ? -1 : idx
}

// ─── Statut collecte entreprise ──────────────────────────────────────────────

export const STATUT_COLLECTE_CONFIG: Record<StatutCollecteEntreprise, { label: string; dot: string; bg: string; text: string }> = {
  en_attente: {
    label: 'En attente',
    dot: 'bg-gray-400',
    bg: 'bg-gray-50',
    text: 'text-gray-600',
  },
  demande_envoyee: {
    label: 'Demande envoyée',
    dot: 'bg-[#3B82C4]',
    bg: 'bg-blue-50',
    text: 'text-[#0A4D8C]',
  },
  relance_envoyee: {
    label: 'Relance envoyée',
    dot: 'bg-[#F5B400]',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
  infos_recues: {
    label: 'Infos reçues',
    dot: 'bg-[#16A34A]',
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
}

// ─── Statut apprenant → milestones ──────────────────────────────────────────

export type MilestoneState = 'pending' | 'active' | 'done'

export interface ApprenantMilestones {
  keypredict: MilestoneState
  edusign: MilestoneState
  attestation: MilestoneState
  bex: MilestoneState
  label: string
}


export function computeMilestones(statut: StatutApprenant): ApprenantMilestones {
  const map: Record<StatutApprenant, ApprenantMilestones> = {
    profil_cree: { keypredict: 'pending', edusign: 'pending', attestation: 'pending', bex: 'pending', label: 'Profil créé' },
    profil_keypredict_cree: { keypredict: 'active', edusign: 'pending', attestation: 'pending', bex: 'pending', label: 'Keypredict créé' },
    tests_envoyes: { keypredict: 'active', edusign: 'pending', attestation: 'pending', bex: 'pending', label: 'Tests envoyés' },
    tests_soumis: { keypredict: 'done', edusign: 'pending', attestation: 'pending', bex: 'pending', label: 'Tests soumis' },
    profil_edusign_cree: { keypredict: 'done', edusign: 'active', attestation: 'pending', bex: 'pending', label: 'EduSign créé' },
    attestation_generee: { keypredict: 'done', edusign: 'done', attestation: 'active', bex: 'pending', label: 'Attestation générée' },
    attestation_envoyee: { keypredict: 'done', edusign: 'done', attestation: 'done', bex: 'pending', label: 'Attestation envoyée' },
    dossier_complete: { keypredict: 'done', edusign: 'done', attestation: 'done', bex: 'done', label: 'Dossier complété' },
  }
  return map[statut]
}

// ─── Type financement ────────────────────────────────────────────────────────

export const FINANCEMENT_CONFIG: Record<TypeFinancement, { label: string; bg: string; text: string }> = {
  direct: { label: 'Facturation directe', bg: 'bg-gray-100', text: 'text-gray-600' },
  opco: { label: 'OPCO', bg: 'bg-blue-50', text: 'text-[#0A4D8C]' },
  public_parapublic: { label: 'Chorus / Public', bg: 'bg-violet-50', text: 'text-violet-700' },
  plateforme_privee: { label: 'Plateforme privée', bg: 'bg-orange-50', text: 'text-orange-700' },
}

// ─── Type document ───────────────────────────────────────────────────────────

export const TYPE_DOCUMENT_LABELS: Record<TypeDocument, string> = {
  devis: 'Devis',
  convention: 'Convention',
  convocation: 'Convocation',
  attestation: 'Attestation de formation',
  facture: 'Facture',
  feuille_emargement: "Feuille d'émargement",
  questionnaire_satisfaction: 'Questionnaire de satisfaction',
  pdf_bex: 'Bilan BEX',
}

export const STATUT_DOCUMENT_CONFIG: Record<StatutDocument, { label: string; bg: string; text: string }> = {
  genere: { label: 'Généré', bg: 'bg-gray-100', text: 'text-gray-600' },
  en_attente_validation: { label: 'À valider', bg: 'bg-amber-50', text: 'text-amber-700' },
  valide: { label: 'Validé', bg: 'bg-green-50', text: 'text-green-700' },
  envoye: { label: 'Envoyé', bg: 'bg-[#0A4D8C]/10', text: 'text-[#0A4D8C]' },
}

// ─── À valider type ──────────────────────────────────────────────────────────

export const A_VALIDER_TYPE_CONFIG: Record<AValiderType, { label: string; icon: string; bg: string; text: string }> = {
  email_ia: { label: 'Email IA', icon: 'mail', bg: 'bg-blue-50', text: 'text-[#0A4D8C]' },
  devis: { label: 'Devis', icon: 'file-text', bg: 'bg-amber-50', text: 'text-amber-700' },
  convention: { label: 'Convention', icon: 'file-check', bg: 'bg-violet-50', text: 'text-violet-700' },
  facture: { label: 'Facture', icon: 'receipt', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  document: { label: 'Document', icon: 'file', bg: 'bg-gray-50', text: 'text-gray-600' },
}
