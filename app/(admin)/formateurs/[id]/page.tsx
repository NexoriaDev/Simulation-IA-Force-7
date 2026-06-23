'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, GraduationCap, UserPlus, Mail, Phone, Briefcase, Calendar, Check, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateShort } from '@/lib/utils/format'

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionF = {
  id: string
  date_debut: string
  date_fin: string
  statut_session: string
  catalogue_formations: { intitule: string } | null
}

type SessionADF = {
  id: string
  date_debut: string
  date_fin: string
  statut_session: string
  formateur_id: string | null
  catalogue_formations: { intitule: string } | null
  formateurs: { nom: string; prenom: string } | null
}

type Formateur = {
  id: string
  nom: string
  prenom: string
  email: string
  specialites: string | null
  telephone: string | null
  actif: boolean
  statut_invitation: string
  compte_cree_le: string
  sessions_formation: SessionF[]
}

type TabKey      = 'profil' | 'adf' | 'historique'
type FilterKey   = 'avenir' | 'en_cours' | 'termine' | 'non_assignee'
type StatutKey   = 'avenir' | 'en_cours' | 'termine'

const TODAY = new Date().toISOString().split('T')[0]

// ─── Helpers module-level ─────────────────────────────────────────────────────

function getStatut(s: SessionADF): StatutKey {
  if (s.date_debut > TODAY) return 'avenir'
  if (s.date_fin   >= TODAY) return 'en_cours'
  return 'termine'
}

const STATUT_ORDER: Record<StatutKey, number> = { avenir: 0, en_cours: 1, termine: 2 }

const FILTER_LABELS: Record<FilterKey, string> = {
  avenir:       'À venir',
  en_cours:     'En cours',
  termine:      'Terminé',
  non_assignee: 'Non assignées',
}
const FILTER_KEYS: FilterKey[] = ['avenir', 'en_cours', 'termine', 'non_assignee']

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_FORMATEURS: Formateur[] = [
  {
    id: 'f1', nom: 'Vaillant', prenom: 'Marc',
    email: 'm.vaillant@formateurs-securite.fr',
    specialites: 'Hygiène Sécurité Environnement, Transport Logistique Commerce International',
    telephone: '06 12 34 56 78', actif: true, statut_invitation: 'actif',
    compte_cree_le: '2024-03-15T10:00:00Z',
    sessions_formation: [
      { id: 'sf1', date_debut: '2026-06-20', date_fin: '2026-06-27', statut_session: 'en_cours',  catalogue_formations: { intitule: 'Développement personnel' } },
      { id: 'sf2', date_debut: '2026-07-07', date_fin: '2026-07-08', statut_session: 'planifie',  catalogue_formations: { intitule: 'Hygiène Sécurité Environnement' } },
      { id: 'sf3', date_debut: '2026-07-14', date_fin: '2026-07-16', statut_session: 'planifie',  catalogue_formations: { intitule: 'Transport Logistique Commerce International' } },
      { id: 'sf4', date_debut: '2026-03-10', date_fin: '2026-03-11', statut_session: 'termine',   catalogue_formations: { intitule: 'Hygiène Sécurité Environnement' } },
      { id: 'sf5', date_debut: '2025-11-18', date_fin: '2025-11-19', statut_session: 'termine',   catalogue_formations: { intitule: 'Transport Logistique Commerce International' } },
    ],
  },
  {
    id: 'f2', nom: 'Chevalier', prenom: 'Nathalie',
    email: 'n.chevalier@prevention-pro.fr',
    specialites: 'Management / RSE / Interculturel, Communication / Communication digitale, Ressources humaines',
    telephone: '06 23 45 67 89', actif: true, statut_invitation: 'actif',
    compte_cree_le: '2024-05-22T09:30:00Z',
    sessions_formation: [
      { id: 'sf6', date_debut: '2026-07-21', date_fin: '2026-07-23', statut_session: 'planifie', catalogue_formations: { intitule: 'Management / RSE / Interculturel' } },
      { id: 'sf7', date_debut: '2026-04-14', date_fin: '2026-04-15', statut_session: 'termine',  catalogue_formations: { intitule: 'Ressources humaines' } },
      { id: 'sf8', date_debut: '2025-10-07', date_fin: '2025-10-08', statut_session: 'termine',  catalogue_formations: { intitule: 'Communication / Communication digitale' } },
    ],
  },
  {
    id: 'f3', nom: 'Amara', prenom: 'Karim',
    email: 'k.amara@securite-industrie.fr',
    specialites: 'Bureautique / IA / Cybersécurité, Développement Informatique, Développement personnel',
    telephone: '06 34 56 78 90', actif: false, statut_invitation: 'actif',
    compte_cree_le: '2025-01-08T14:00:00Z',
    sessions_formation: [
      { id: 'sf9',  date_debut: '2026-08-04', date_fin: '2026-08-05', statut_session: 'planifie', catalogue_formations: { intitule: 'Bureautique / IA / Cybersécurité' } },
      { id: 'sf10', date_debut: '2026-01-20', date_fin: '2026-01-21', statut_session: 'termine',  catalogue_formations: { intitule: 'Développement Informatique' } },
    ],
  },
  {
    id: 'f4', nom: 'Bernard', prenom: 'Sophie',
    email: 's.bernard@formaction-normandie.fr',
    specialites: 'Ressources humaines, Développement personnel',
    telephone: '06 45 67 89 01', actif: true, statut_invitation: 'actif',
    compte_cree_le: '2025-06-01T09:00:00Z',
    sessions_formation: [
      { id: 'sf11', date_debut: '2026-09-08', date_fin: '2026-09-09', statut_session: 'planifie', catalogue_formations: { intitule: 'Développement personnel' } },
    ],
  },
  {
    id: 'f5', nom: 'Nguyen', prenom: 'Paul',
    email: 'p.nguyen@langues-pro.fr',
    specialites: 'Langue Anglaise, Langues étrangères',
    telephone: '06 56 78 90 12', actif: false, statut_invitation: 'inactif',
    compte_cree_le: '2024-09-15T11:00:00Z',
    sessions_formation: [],
  },
]

// Toutes les sessions (À venir + En cours + Terminées) pour la modale
const DEMO_SESSIONS_ADF: SessionADF[] = [
  // À venir — sans formateur (sélectionnables) — dates proches pour apparaître en tête
  { id: 'adf-0a', date_debut: '2026-07-01', date_fin: '2026-07-01', statut_session: 'planifie', formateur_id: null, catalogue_formations: { intitule: 'Sécurité au travail' },                           formateurs: null },
  { id: 'adf-0b', date_debut: '2026-07-03', date_fin: '2026-07-04', statut_session: 'planifie', formateur_id: null, catalogue_formations: { intitule: 'Excel avancé' },                                  formateurs: null },
  { id: 'adf-4',  date_debut: '2026-08-04', date_fin: '2026-08-05', statut_session: 'planifie', formateur_id: null, catalogue_formations: { intitule: 'Bureautique / IA / Cybersécurité' },              formateurs: null },
  { id: 'adf-5',  date_debut: '2026-09-01', date_fin: '2026-09-02', statut_session: 'planifie', formateur_id: null, catalogue_formations: { intitule: 'Langue Anglaise' },                               formateurs: null },
  { id: 'adf-7',  date_debut: '2026-10-06', date_fin: '2026-10-07', statut_session: 'planifie', formateur_id: null, catalogue_formations: { intitule: 'Ressources humaines' },                           formateurs: null },
  { id: 'adf-8',  date_debut: '2026-10-20', date_fin: '2026-10-21', statut_session: 'planifie', formateur_id: null, catalogue_formations: { intitule: 'Communication / Communication digitale' },        formateurs: null },
  { id: 'adf-9',  date_debut: '2026-11-03', date_fin: '2026-11-04', statut_session: 'planifie', formateur_id: null, catalogue_formations: { intitule: 'Développement Informatique' },                    formateurs: null },
  // À venir — avec formateur
  { id: 'adf-1',  date_debut: '2026-07-07', date_fin: '2026-07-08', statut_session: 'planifie', formateur_id: 'f1', catalogue_formations: { intitule: 'Hygiène Sécurité Environnement' },               formateurs: { nom: 'Vaillant',  prenom: 'Marc'     } },
  { id: 'adf-2',  date_debut: '2026-07-14', date_fin: '2026-07-16', statut_session: 'planifie', formateur_id: 'f1', catalogue_formations: { intitule: 'Transport Logistique Commerce International' },    formateurs: { nom: 'Vaillant',  prenom: 'Marc'     } },
  { id: 'adf-3',  date_debut: '2026-07-21', date_fin: '2026-07-23', statut_session: 'planifie', formateur_id: 'f2', catalogue_formations: { intitule: 'Management / RSE / Interculturel' },              formateurs: { nom: 'Chevalier', prenom: 'Nathalie' } },
  { id: 'adf-6',  date_debut: '2026-09-08', date_fin: '2026-09-09', statut_session: 'planifie', formateur_id: 'f4', catalogue_formations: { intitule: 'Développement personnel' },                       formateurs: { nom: 'Bernard',   prenom: 'Sophie'   } },
  // En cours
  { id: 'adf-10', date_debut: '2026-06-20', date_fin: '2026-06-27', statut_session: 'en_cours', formateur_id: 'f1', catalogue_formations: { intitule: 'Développement personnel' },                       formateurs: { nom: 'Vaillant',  prenom: 'Marc'     } },
  // Terminées
  { id: 'adf-11', date_debut: '2026-06-16', date_fin: '2026-06-17', statut_session: 'termine',  formateur_id: 'f3', catalogue_formations: { intitule: 'Bureautique / IA / Cybersécurité' },              formateurs: { nom: 'Amara',     prenom: 'Karim'    } },
  { id: 'adf-12', date_debut: '2026-06-09', date_fin: '2026-06-10', statut_session: 'termine',  formateur_id: null, catalogue_formations: { intitule: 'Excel avancé' },                                  formateurs: null },
  { id: 'adf-13', date_debut: '2026-05-12', date_fin: '2026-05-13', statut_session: 'termine',  formateur_id: 'f2', catalogue_formations: { intitule: 'Communication / Communication digitale' },        formateurs: { nom: 'Chevalier', prenom: 'Nathalie' } },
  { id: 'adf-14', date_debut: '2026-04-14', date_fin: '2026-04-15', statut_session: 'termine',  formateur_id: 'f2', catalogue_formations: { intitule: 'Ressources humaines' },                           formateurs: { nom: 'Chevalier', prenom: 'Nathalie' } },
  { id: 'adf-15', date_debut: '2026-03-10', date_fin: '2026-03-11', statut_session: 'termine',  formateur_id: 'f1', catalogue_formations: { intitule: 'Hygiène Sécurité Environnement' },               formateurs: { nom: 'Vaillant',  prenom: 'Marc'     } },
  { id: 'adf-16', date_debut: '2025-11-18', date_fin: '2025-11-19', statut_session: 'termine',  formateur_id: 'f1', catalogue_formations: { intitule: 'Transport Logistique Commerce International' },   formateurs: { nom: 'Vaillant',  prenom: 'Marc'     } },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActif(sessions: SessionF[]) {
  return sessions.some(s => s.date_debut <= TODAY && s.date_fin >= TODAY)
}

function StatusBadge({ sessions }: { sessions: SessionF[] }) {
  const actif = isActif(sessions)
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      actif ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', actif ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
      {actif ? 'Actif' : 'Inactif'}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormateurDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [formateur, setFormateur] = useState<Formateur | null>(
    DEMO_FORMATEURS.find(f => f.id === id) ?? null
  )
  const [tab, setTab] = useState<TabKey>('profil')

  // ── Modal ADF ──
  const [openADF,       setOpenADF]       = useState(false)
  const [sessionsADF,   setSessionsADF]   = useState<SessionADF[]>(DEMO_SESSIONS_ADF)
  const [loadingADF,    setLoadingADF]    = useState(false)
  const [checked,       setChecked]       = useState<Set<string>>(new Set())
  const [submitting,    setSubmitting]    = useState(false)
  const [query,         setQuery]         = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([])

  useEffect(() => {
    fetch('/api/formateurs')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.formateurs)) {
          const found = d.formateurs.find((f: Formateur) => f.id === id)
          if (found) setFormateur(found)
        }
      })
      .catch(() => {})
  }, [id])

  function openModal() {
    setChecked(new Set())
    setQuery('')
    setActiveFilters(['non_assignee'])
    setOpenADF(true)
    setLoadingADF(false)
  }

  async function handleAssocier() {
    if (checked.size === 0 || !formateur) return
    setSubmitting(true)
    try {
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formateur_id: formateur.id, session_ids: [...checked] }),
      })
      // Optimistic update 1 : badge formateur dans la modale + désactiver la checkbox
      setSessionsADF(prev =>
        prev.map(s =>
          checked.has(s.id)
            ? { ...s, formateur_id: formateur.id, formateurs: { nom: formateur.nom, prenom: formateur.prenom } }
            : s
        )
      )
      // Optimistic update 2 : onglet ADF Inscrits
      const nouvelles: SessionF[] = sessionsADF
        .filter(s => checked.has(s.id))
        .map(s => ({
          id: s.id,
          date_debut: s.date_debut,
          date_fin: s.date_fin,
          statut_session: 'planifie',
          catalogue_formations: s.catalogue_formations,
        }))
      setFormateur(f =>
        f ? { ...f, sessions_formation: [...f.sessions_formation, ...nouvelles] } : f
      )
    } catch {}
    setChecked(new Set())
    setSubmitting(false)
  }

  function toggle(sid: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(sid) ? next.delete(sid) : next.add(sid)
      return next
    })
  }

  function toggleFilter(key: FilterKey) {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  // Sessions filtrées + triées pour la modale
  const filteredSessions = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sessionsADF
      .filter(s => {
        if (q && !s.catalogue_formations?.intitule.toLowerCase().includes(q)) return false
        if (activeFilters.length === 0) return true
        const st = getStatut(s)
        if (activeFilters.includes('avenir')       && st === 'avenir')                    return true
        if (activeFilters.includes('en_cours')     && st === 'en_cours')                  return true
        if (activeFilters.includes('termine')      && st === 'termine')                   return true
        if (activeFilters.includes('non_assignee') && st === 'avenir' && !s.formateur_id) return true
        return false
      })
      .sort((a, b) => {
        const diff = STATUT_ORDER[getStatut(a)] - STATUT_ORDER[getStatut(b)]
        return diff !== 0 ? diff : a.date_debut.localeCompare(b.date_debut)
      })
  }, [sessionsADF, query, activeFilters])

  if (!formateur) {
    return (
      <div className="px-10 py-8">
        <p className="text-sm text-[#9CA3AF]">Formateur introuvable.</p>
      </div>
    )
  }

  const actif          = isActif(formateur.sessions_formation)
  const sessionsSorted = [...formateur.sessions_formation].sort(
    (a, b) => b.date_debut.localeCompare(a.date_debut)
  )
  const adfSessions = formateur.sessions_formation
    .filter(s => s.date_debut > TODAY)
    .sort((a, b) => a.date_debut.localeCompare(b.date_debut))

  const TABS: { key: TabKey; label: string; count?: number }[] = [
    { key: 'profil',     label: 'Infos du profil' },
    { key: 'adf',        label: 'ADF Inscrits', count: adfSessions.length },
    { key: 'historique', label: 'Historique de formation' },
  ]

  return (
    <div className="px-10 py-8">

      {/* Fil d'ariane */}
      <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-6">
        <Link href="/formateurs" className="flex items-center gap-1.5 hover:text-[#1267A4] transition-colors">
          <ArrowLeft size={14} />
          Formateurs
        </Link>
        <span>/</span>
        <span className="text-[#1F2937] font-medium">{formateur.prenom} {formateur.nom}</span>
      </div>

      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#6199C1]/10 flex items-center justify-center shrink-0">
            <span className="text-[#6199C1] text-xl font-bold">
              {(formateur.prenom[0] ?? '').toUpperCase()}{(formateur.nom[0] ?? '').toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">{formateur.prenom} {formateur.nom}</h1>
            <p className="text-sm text-[#9CA3AF] mt-0.5">{formateur.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge sessions={formateur.sessions_formation} />
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#1267A4] text-white hover:bg-[#0f5390] transition-colors cursor-pointer"
          >
            <UserPlus size={15} />
            Inscrire à une ADF
          </button>
        </div>
      </div>

      {/* Onglets pilule */}
      <div className="flex items-center gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer',
              tab === t.key
                ? 'bg-[#1267A4] text-white border-[#1267A4]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#1267A4] hover:text-[#1267A4]'
            )}
          >
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className={cn(
                'min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold flex items-center justify-center',
                tab === t.key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenu onglets */}
      <div className="bg-white rounded-2xl border border-[#6199C1]/25 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">

          {tab === 'profil' && (
            <motion.div key="profil"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Prénom</p>
                  <p className="text-sm text-[#1F2937] font-medium">{formateur.prenom}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Nom</p>
                  <p className="text-sm text-[#1F2937] font-medium">{formateur.nom}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5"><Mail size={10} />Email</p>
                <p className="text-sm text-[#4B5563]">{formateur.email}</p>
              </div>
              {formateur.telephone && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5"><Phone size={10} />Téléphone</p>
                  <p className="text-sm text-[#4B5563]">{formateur.telephone}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5"><Briefcase size={10} />Spécialité(s)</p>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  {formateur.specialites ?? <span className="text-[#9CA3AF]">—</span>}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Statut</p>
                <StatusBadge sessions={formateur.sessions_formation} />
                {actif && (
                  <p className="text-xs text-emerald-600">
                    Formation en cours —{' '}
                    {formateur.sessions_formation.find(s => s.date_debut <= TODAY && s.date_fin >= TODAY)?.catalogue_formations?.intitule}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10} />Compte créé le</p>
                <p className="text-sm text-[#4B5563]">{formatDateShort(formateur.compte_cree_le)}</p>
              </div>
            </motion.div>
          )}

          {tab === 'adf' && (
            <motion.div key="adf"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
              className="p-6"
            >
              {adfSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <Calendar size={28} className="text-[#D1D5DB] mb-3" />
                  <p className="text-sm text-[#9CA3AF] mb-4">Aucune ADF à venir planifiée</p>
                  <button onClick={openModal} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#1267A4] text-white hover:bg-[#0f5390] transition-colors cursor-pointer">
                    <UserPlus size={14} />Inscrire à une ADF
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {adfSessions.map((s, i) => (
                    <motion.div key={s.id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.15 }}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-[#F3F4F6] bg-[#F8F9FA]/60"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#6199C1]/10 flex items-center justify-center shrink-0">
                        <GraduationCap size={14} className="text-[#6199C1]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1F2937] truncate">{s.catalogue_formations?.intitule ?? 'Formation'}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1.5">
                          <Calendar size={10} />
                          Début le {formatDateShort(s.date_debut)} — fin le {formatDateShort(s.date_fin)}
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-[#EBF3FB] text-[#1267A4] border-[#1267A4]/20">
                        À venir
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'historique' && (
            <motion.div key="historique"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
              className="p-6"
            >
              {sessionsSorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <Calendar size={28} className="text-[#D1D5DB] mb-3" />
                  <p className="text-sm text-[#9CA3AF]">Aucune formation enregistrée</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessionsSorted.map(s => {
                    const enCours = s.date_debut <= TODAY && s.date_fin >= TODAY
                    const aVenir  = s.date_debut > TODAY
                    return (
                      <div key={s.id} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1F2937] truncate">{s.catalogue_formations?.intitule ?? 'Formation'}</p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1.5">
                            <Calendar size={10} />
                            {formatDateShort(s.date_debut)} – {formatDateShort(s.date_fin)}
                          </p>
                        </div>
                        <span className={cn(
                          'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border',
                          enCours ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : aVenir ? 'bg-[#EBF3FB] text-[#1267A4] border-[#1267A4]/20'
                          :          'bg-gray-100 text-gray-500 border-gray-200'
                        )}>
                          {enCours ? 'En cours' : aVenir ? 'À venir' : 'Terminé'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Modale : Inscrire à une ADF ── */}
      <AnimatePresence>
        {openADF && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpenADF(false)} />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
              style={{ maxHeight: 'calc(100vh - 80px)' }}
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div>
                  <h2 className="text-base font-semibold text-[#1F2937]">Inscrire à une ADF</h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{formateur.prenom} {formateur.nom} — sélectionnez les sessions à venir sans formateur</p>
                </div>
                <button onClick={() => setOpenADF(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer shrink-0">
                  <X size={15} />
                </button>
              </div>

              {/* Recherche + filtres */}
              <div className="px-5 pt-3 pb-2 border-b border-gray-100 shrink-0 space-y-2">
                {/* Barre de recherche */}
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Rechercher une formation…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-[#F8F9FA] focus:outline-none focus:border-[#1267A4]/50 focus:bg-white transition-colors placeholder:text-[#9CA3AF]"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-gray-600 cursor-pointer">
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Filtres statut */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {FILTER_KEYS.map(key => {
                    const active = activeFilters.includes(key)
                    return (
                      <button
                        key={key}
                        onClick={() => toggleFilter(key)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer',
                          active
                            ? 'bg-[#1267A4] text-white border-[#1267A4]'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-[#1267A4] hover:text-[#1267A4]'
                        )}
                      >
                        {FILTER_LABELS[key]}
                      </button>
                    )
                  })}
                  {activeFilters.length > 0 && (
                    <button onClick={() => setActiveFilters([])} className="px-2 py-1 text-xs text-[#9CA3AF] hover:text-gray-600 cursor-pointer">
                      Tout afficher
                    </button>
                  )}
                </div>
              </div>

              {/* En-têtes de colonnes */}
              <div className="flex items-center gap-3 px-5 py-2 border-b border-[#F3F4F6] bg-[#FAFAFA] shrink-0">
                <div className="w-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Nom de la formation</span>
                </div>
                <div className="w-24 shrink-0">
                  <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Statut</span>
                </div>
                <div className="w-44 shrink-0">
                  <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Formateur assigné</span>
                </div>
              </div>

              {/* Liste sessions */}
              <div className="overflow-y-auto flex-1 divide-y divide-[#F3F4F6]">
                {loadingADF ? (
                  <div className="flex items-center justify-center py-12 text-sm text-[#9CA3AF]">Chargement…</div>
                ) : filteredSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search size={24} className="text-[#D1D5DB] mb-2" />
                    <p className="text-sm text-[#9CA3AF]">Aucune formation trouvée</p>
                  </div>
                ) : (
                  filteredSessions.map(s => {
                    const statut     = getStatut(s)
                    const selectable = statut === 'avenir' && !s.formateur_id
                    const isChecked  = checked.has(s.id)

                    return (
                      <div
                        key={s.id}
                        onClick={() => selectable && toggle(s.id)}
                        className={cn(
                          'flex items-center gap-3 px-5 py-3 transition-colors',
                          selectable
                            ? 'cursor-pointer ' + (isChecked ? 'bg-[#EBF3FB]' : 'hover:bg-[#F8F9FA]')
                            : 'cursor-default opacity-55'
                        )}
                      >
                        {/* Checkbox */}
                        <div className={cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors',
                          !selectable ? 'border-gray-200 bg-gray-100'
                          : isChecked ? 'bg-[#1267A4] border-[#1267A4]'
                          :             'border-gray-300 bg-white'
                        )}>
                          {isChecked && selectable && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>

                        {/* Formation + date */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1F2937] truncate">
                            {s.catalogue_formations?.intitule ?? 'Formation'}
                          </p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                            <Calendar size={10} />
                            {formatDateShort(s.date_debut)} – {formatDateShort(s.date_fin)}
                          </p>
                        </div>

                        {/* Statut */}
                        <div className="w-24 shrink-0">
                          <span className={cn(
                            'text-[11px] font-medium px-2 py-0.5 rounded-full border',
                            statut === 'avenir'    ? 'bg-[#EBF3FB] text-[#1267A4] border-[#1267A4]/20'
                            : statut === 'en_cours' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            :                         'bg-gray-100 text-gray-400 border-gray-200'
                          )}>
                            {statut === 'avenir' ? 'À venir' : statut === 'en_cours' ? 'En cours' : 'Terminé'}
                          </span>
                        </div>

                        {/* Formateur assigné */}
                        <div className="w-44 shrink-0">
                          {s.formateurs ? (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EBF3FB] text-[#1267A4] border border-[#1267A4]/20 max-w-full truncate inline-block">
                              {s.formateurs.prenom} {s.formateurs.nom}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#D1D5DB]">—</span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-[#F8F9FA] shrink-0">
                <p className="text-xs text-[#9CA3AF]">
                  {checked.size === 0
                    ? `${filteredSessions.length} session${filteredSessions.length > 1 ? 's' : ''} affichée${filteredSessions.length > 1 ? 's' : ''}`
                    : `${checked.size} sélectionnée${checked.size > 1 ? 's' : ''}`}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setOpenADF(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                    Fermer
                  </button>
                  <button
                    onClick={handleAssocier}
                    disabled={checked.size === 0 || submitting}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      checked.size > 0 && !submitting
                        ? 'bg-[#1267A4] text-white hover:bg-[#0f5390] cursor-pointer'
                        : 'bg-[#1267A4]/30 text-white cursor-not-allowed'
                    )}
                  >
                    {submitting ? 'Enregistrement…' : `Associer${checked.size > 0 ? ` (${checked.size})` : ''}`}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
