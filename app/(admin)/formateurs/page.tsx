'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, UserPlus, Eye, X, Mail, Phone, Briefcase, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateShort } from '@/lib/utils/format'

type SessionF = {
  id: string
  date_debut: string
  date_fin: string
  statut_session: string
  catalogue_formations: { intitule: string } | null
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

const TODAY = new Date().toISOString().split('T')[0]

// ponytail: démo Phase 1 — remplacé par données réelles dès migration appliquée
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
      { id: 'sf6', date_debut: '2026-07-21', date_fin: '2026-07-23', statut_session: 'planifie',  catalogue_formations: { intitule: 'Management / RSE / Interculturel' } },
      { id: 'sf7', date_debut: '2026-04-14', date_fin: '2026-04-15', statut_session: 'termine',   catalogue_formations: { intitule: 'Ressources humaines' } },
      { id: 'sf8', date_debut: '2025-10-07', date_fin: '2025-10-08', statut_session: 'termine',   catalogue_formations: { intitule: 'Communication / Communication digitale' } },
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

function isActif(sessions: SessionF[]) {
  return sessions.some(s => s.date_debut <= TODAY && s.date_fin >= TODAY)
}

function StatusBadge({ sessions }: { sessions: SessionF[] }) {
  const actif = isActif(sessions)
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      actif
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-gray-100 text-gray-500 border-gray-200'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', actif ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
      {actif ? 'Actif' : 'Inactif'}
    </span>
  )
}

// ─── Modale détail formateur ──────────────────────────────────────────────────

type ModalTab = 'profil' | 'adf' | 'historique'

function FormateurModal({ formateur, onClose }: { formateur: Formateur; onClose: () => void }) {
  const [tab, setTab] = useState<ModalTab>('profil')
  const actif = isActif(formateur.sessions_formation)

  const sessionsSorted = [...formateur.sessions_formation].sort(
    (a, b) => b.date_debut.localeCompare(a.date_debut)
  )
  const adfSessions = formateur.sessions_formation
    .filter(s => s.date_debut > TODAY)
    .sort((a, b) => a.date_debut.localeCompare(b.date_debut))

  const TABS: { key: ModalTab; label: string; count?: number }[] = [
    { key: 'profil',     label: 'Infos du profil' },
    { key: 'adf',        label: 'ADF Inscrits', count: adfSessions.length },
    { key: 'historique', label: 'Historique de formation' },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-[#6199C1]/10 flex items-center justify-center shrink-0">
            <span className="text-[#6199C1] text-sm font-bold">
              {formateur.prenom[0]}{formateur.nom[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-[#1F2937] leading-tight">
              {formateur.prenom} {formateur.nom}
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{formateur.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Sous-onglets pilule */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
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

        {/* Contenu */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === 'profil' && (
              <motion.div key="profil"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                    <Mail size={10} />Email
                  </p>
                  <p className="text-sm text-[#4B5563]">{formateur.email}</p>
                </div>

                {formateur.telephone && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                      <Phone size={10} />Téléphone
                    </p>
                    <p className="text-sm text-[#4B5563]">{formateur.telephone}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                    <Briefcase size={10} />Spécialité(s)
                  </p>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {formateur.specialites ?? <span className="text-[#9CA3AF]">—</span>}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Statut</p>
                  <StatusBadge sessions={formateur.sessions_formation} />
                  {actif && (
                    <p className="text-xs text-emerald-600">
                      Formation en cours — {formateur.sessions_formation.find(s => s.date_debut <= TODAY && s.date_fin >= TODAY)?.catalogue_formations?.intitule}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {tab === 'adf' && (
              <motion.div key="adf"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
              >
                {adfSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Calendar size={28} className="text-[#D1D5DB] mb-3" />
                    <p className="text-sm text-[#9CA3AF]">Aucune ADF à venir planifiée</p>
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
                          <p className="text-sm font-medium text-[#1F2937] truncate">
                            {s.catalogue_formations?.intitule ?? 'Formation'}
                          </p>
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
              >
                {sessionsSorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Calendar size={28} className="text-[#D1D5DB] mb-3" />
                    <p className="text-sm text-[#9CA3AF]">Aucune formation enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sessionsSorted.map(s => {
                      const enCours = s.date_debut <= TODAY && s.date_fin >= TODAY
                      const aVenir  = s.date_debut > TODAY
                      return (
                        <div key={s.id}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl border border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1F2937] truncate">
                              {s.catalogue_formations?.intitule ?? 'Formation'}
                            </p>
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
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormateursPage() {
  const [formateurs, setFormateurs] = useState<Formateur[]>(DEMO_FORMATEURS)
  const [selected, setSelected]     = useState<Formateur | null>(null)

  useEffect(() => {
    fetch('/api/formateurs')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.formateurs) && d.formateurs.length > 0) setFormateurs(d.formateurs) })
      .catch(() => {})
  }, [])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#9CA3AF]">
          {formateurs.length} formateur{formateurs.length > 1 ? 's' : ''} enregistré{formateurs.length > 1 ? 's' : ''}
        </p>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1267A4] text-white text-sm font-medium hover:bg-[#0f5390] transition-colors cursor-pointer"
          onClick={() => {/* Phase 2 : modale invitation */}}
        >
          <UserPlus size={15} />
          Inviter un formateur
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-[#6199C1]/25 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              {['Formateur', 'Spécialité', 'Contact', 'Statut', ''].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest px-6 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {formateurs.map((f, i) => (
              <motion.tr
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04, duration: 0.18 }}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Formateur */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6199C1]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#6199C1] text-xs font-semibold">
                        {(f.prenom[0] ?? '').toUpperCase()}{(f.nom[0] ?? '').toUpperCase()}
                      </span>
                    </div>
                    <p className="font-semibold text-[#1F2937] leading-tight">{f.prenom} {f.nom}</p>
                  </div>
                </td>

                {/* Spécialité */}
                <td className="px-6 py-4 max-w-[220px]">
                  <p className="text-sm text-[#4B5563] line-clamp-2 leading-snug">
                    {f.specialites ?? <span className="text-[#9CA3AF]">—</span>}
                  </p>
                </td>

                {/* Contact */}
                <td className="px-6 py-4">
                  <p className="text-sm text-[#4B5563]">{f.email}</p>
                  {f.telephone && <p className="text-xs text-[#9CA3AF] mt-0.5">{f.telephone}</p>}
                </td>

                {/* Statut calculé */}
                <td className="px-6 py-4">
                  <StatusBadge sessions={f.sessions_formation} />
                </td>

                {/* Détails */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelected(f)}
                    className="flex items-center justify-center w-8 h-8 rounded-full text-[#9CA3AF] hover:text-[#6199C1] hover:bg-[#6199C1]/10 transition-colors cursor-pointer"
                    aria-label={`Voir la fiche de ${f.prenom} ${f.nom}`}
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-3 border-t border-[#F3F4F6]">
          <p className="text-[11px] text-[#9CA3AF] flex items-center gap-2">
            <GraduationCap size={12} />
            {formateurs.filter(f => isActif(f.sessions_formation)).length} actif{formateurs.filter(f => isActif(f.sessions_formation)).length > 1 ? 's' : ''} ·{' '}
            {formateurs.filter(f => !isActif(f.sessions_formation)).length} inactif{formateurs.filter(f => !isActif(f.sessions_formation)).length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Modale */}
      <AnimatePresence>
        {selected && (
          <FormateurModal formateur={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
