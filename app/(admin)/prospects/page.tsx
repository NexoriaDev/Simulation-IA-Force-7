'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Eye, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_PROSPECTS, getCatalogueFormation } from '@/lib/data/mock'
import {
  STATUT_DOSSIER_CONFIG,
  FINANCEMENT_CONFIG,
  getTypeDossier,
  formatRelativeDate,
} from '@/lib/utils/format'
import type { StatutDossier } from '@/lib/types'

const STATUT_OPTIONS: { value: StatutDossier | ''; label: string }[] = [
  { value: '', label: 'Tous les statuts' },
  { value: 'profil_cree', label: 'Profil créé' },
  { value: 'devis_en_attente', label: 'Devis en attente' },
  { value: 'devis_genere', label: 'Devis généré' },
  { value: 'devis_envoye', label: 'Devis envoyé' },
  { value: 'devis_signe', label: 'Devis signé' },
  { value: 'prospect_gagne', label: 'Prospect gagné' },
  { value: 'valide', label: 'Validé' },
  { value: 'prospect_perdu', label: 'Prospect perdu' },
]

function TypeBadge({ statut }: { statut: StatutDossier }) {
  const type = getTypeDossier(statut)
  return (
    <span
      className={cn(
        'text-[10px] font-semibold px-1.5 py-0.5 rounded border',
        type === 'Client'
          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
          : type === 'Perdu'
            ? 'bg-red-50 text-red-600 border-red-200'
            : 'bg-gray-50 text-gray-600 border-gray-200'
      )}
    >
      {type}
    </span>
  )
}

function StatusPill({ statut }: { statut: StatutDossier }) {
  const cfg = STATUT_DOSSIER_CONFIG[statut]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border',
        cfg.bg,
        cfg.text,
        cfg.border
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  )
}

function ProspectsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const statut = (searchParams.get('statut') ?? '') as StatutDossier | ''
  const type = searchParams.get('type') ?? ''

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const prospects = MOCK_PROSPECTS.filter((p) => {
    if (statut && p.statut !== statut) return false
    if (type && getTypeDossier(p.statut) !== type) return false
    if (q.trim()) {
      const lower = q.toLowerCase()
      if (
        !p.nom_entreprise.toLowerCase().includes(lower) &&
        !p.contact_nom.toLowerCase().includes(lower) &&
        !p.contact_prenom.toLowerCase().includes(lower) &&
        !p.contact_email.toLowerCase().includes(lower)
      )
        return false
    }
    return true
  }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

  const hasFilters = q || statut || type

  return (
    <div className="min-h-full bg-[#F8F9FA]">
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-4 sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-[#1F2937]">Prospects & Clients</h1>
        <p className="text-xs text-[#9CA3AF]">
          {prospects.length} dossier{prospects.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">
        {/* Search + filtres */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, organisation…"
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20 focus:border-[#0A4D8C]/40 bg-white transition-colors"
            />
          </div>

          <select
            value={statut}
            onChange={(e) => setParam('statut', e.target.value)}
            className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#6B7280] bg-white hover:border-[#9CA3AF] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20"
          >
            {STATUT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setParam('type', e.target.value)}
            className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#6B7280] bg-white hover:border-[#9CA3AF] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A4D8C]/20"
          >
            <option value="">Prospect & Client</option>
            <option value="Prospect">Prospect</option>
            <option value="Client">Client</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => router.push('?', { scroll: false })}
              className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer shrink-0"
            >
              <X size={14} />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                  {[
                    'Entreprise / Contact',
                    'Formation',
                    'Statut',
                    'Type',
                    'Financement',
                    'Dernière activité',
                    '',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {prospects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#9CA3AF]">
                      Aucun dossier correspondant
                    </td>
                  </tr>
                ) : (
                  prospects.map((p, i) => {
                    const formation = getCatalogueFormation(p.formation_souhaitee ?? '')
                    const financement = FINANCEMENT_CONFIG[p.type_financement]
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.18, delay: i * 0.03 }}
                        className="hover:bg-[#FAFAFA] transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-[#1F2937] leading-tight">
                            {p.nom_entreprise}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF] leading-tight">
                            {p.contact_prenom} {p.contact_nom}
                            {p.contact_fonction ? ` · ${p.contact_fonction}` : ''}
                          </p>
                        </td>

                        <td className="px-5 py-3.5">
                          <p className="text-[#1F2937] truncate max-w-[160px] leading-tight">
                            {formation?.intitule ?? '—'}
                          </p>
                          {p.type_formation && (
                            <span
                              className={cn(
                                'text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block',
                                p.type_formation === 'INTER'
                                  ? 'bg-violet-50 text-violet-700'
                                  : 'bg-[#0A4D8C]/8 text-[#0A4D8C]'
                              )}
                            >
                              {p.type_formation}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <StatusPill statut={p.statut} />
                        </td>

                        <td className="px-5 py-3.5">
                          <TypeBadge statut={p.statut} />
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              'text-[11px] px-2 py-0.5 rounded-md font-medium',
                              financement.bg,
                              financement.text
                            )}
                          >
                            {financement.label}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <p className="text-[12px] text-[#6B7280]">
                            {formatRelativeDate(p.updated_at)}
                          </p>
                        </td>

                        <td className="px-5 py-3.5">
                          <Link
                            href={`/dossiers/${p.id}`}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
                            aria-label={`Ouvrir la fiche ${p.nom_entreprise}`}
                          >
                            <Eye size={14} className="text-[#6B7280]" />
                          </Link>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#F3F4F6]">
            <p className="text-[11px] text-[#9CA3AF]">
              {prospects.length} dossier{prospects.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProspectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#9CA3AF]">Chargement…</div>}>
      <ProspectsPageInner />
    </Suspense>
  )
}
