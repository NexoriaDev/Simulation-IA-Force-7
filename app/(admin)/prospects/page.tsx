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

// ponytail: 3 couleurs max — gris neutre / vert (gagné) / rouge (perdu)
const STATUT_PILL_STYLE: Record<StatutDossier, string> = {
  profil_cree:     'bg-gray-50 text-gray-500 border-gray-200',
  devis_en_attente:'bg-gray-50 text-gray-500 border-gray-200',
  devis_genere:    'bg-gray-50 text-gray-500 border-gray-200',
  devis_envoye:    'bg-gray-50 text-gray-500 border-gray-200',
  devis_signe:     'bg-gray-50 text-gray-500 border-gray-200',
  prospect_gagne:  'bg-green-50 text-green-700 border-green-200',
  valide:          'bg-green-50 text-green-700 border-green-200',
  prospect_perdu:  'bg-red-50 text-red-500 border-red-200',
}

function StatusPill({ statut }: { statut: StatutDossier }) {
  const cfg = STATUT_DOSSIER_CONFIG[statut]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border', STATUT_PILL_STYLE[statut])}>
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
    <div className="min-h-full bg-white">
      <div className="bg-white sticky top-0 z-20">
        <div className="px-10 py-6">
          <h1 className="text-2xl font-bold text-[#1F2937]">Prospects & Clients</h1>
          <div className="w-8 h-0.5 bg-[#FEE700] mt-1.5 mb-2" />
          <p className="text-sm text-[#9CA3AF]">
            {prospects.length} dossier{prospects.length > 1 ? 's' : ''} · prospects et clients en cours
          </p>
        </div>
      </div>

      <div className="px-10 pt-6 pb-8 space-y-4">
        {/* Bloc 1 : Recherche + filtres */}
        <div className="flex items-stretch bg-white border border-[#6199C1]/40 rounded-lg divide-x divide-[#6199C1]/20 shadow-sm">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6199C1]" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, organisation…"
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FEE700]/60 rounded-l-lg bg-transparent"
            />
          </div>

          <select
            value={statut}
            onChange={(e) => setParam('statut', e.target.value)}
            className="px-4 py-3 text-sm text-[#6B7280] bg-transparent cursor-pointer focus:outline-none min-w-[160px]"
          >
            {STATUT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setParam('type', e.target.value)}
            className="px-4 py-3 text-sm text-[#6B7280] bg-transparent cursor-pointer focus:outline-none min-w-[140px]"
          >
            <option value="">Prospect & Client</option>
            <option value="Prospect">Prospect</option>
            <option value="Client">Client</option>
          </select>

          {hasFilters && (
            <button
              onClick={() => router.push('?', { scroll: false })}
              className="flex items-center gap-1.5 px-4 text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer shrink-0"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Bloc 2 : Tableau */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
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
                        <td className="px-5 py-5">
                          <p className="font-medium text-[#1F2937] leading-tight">
                            {p.nom_entreprise}
                          </p>
                          <p className="text-[11px] text-[#9CA3AF] leading-tight">
                            {p.contact_prenom} {p.contact_nom}
                            {p.contact_fonction ? ` · ${p.contact_fonction}` : ''}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-[#1F2937] truncate max-w-[160px] leading-tight">
                            {formation?.intitule ?? '—'}
                          </p>
                          {p.type_formation && (
                            <span
                              className={cn(
                                'text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block',
                                p.type_formation === 'INTER'
                                  ? 'bg-violet-50 text-violet-700'
                                  : 'bg-[#6199C1]/8 text-[#6199C1]'
                              )}
                            >
                              {p.type_formation}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <StatusPill statut={p.statut} />
                        </td>

                        <td className="px-5 py-5">
                          <TypeBadge statut={p.statut} />
                        </td>

                        <td className="px-5 py-5">
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

                        <td className="px-5 py-5">
                          <p className="text-[12px] text-[#6B7280]">
                            {formatRelativeDate(p.updated_at)}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <Link
                            href={`/dossiers/${p.id}`}
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                            aria-label={`Ouvrir la fiche ${p.nom_entreprise}`}
                          >
                            <Eye size={14} />
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
