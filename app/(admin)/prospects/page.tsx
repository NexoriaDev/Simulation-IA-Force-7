'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Eye, X, ChevronDown, ListFilter, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  STATUT_DOSSIER_CONFIG,
  getTypeDossier,
} from '@/lib/utils/format'
import type { StatutDossier, ProspectClient } from '@/lib/types'

type ProspectRow = ProspectClient & {
  catalogue_formations: { intitule: string } | null
}

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

const TYPE_OPTIONS = [
  { value: '', label: 'Prospect & Client' },
  { value: 'Prospect', label: 'Prospect' },
  { value: 'Client', label: 'Client' },
]

function FilterDropdown({
  icon: Icon,
  value,
  onChange,
  options,
  minW = 120,
}: {
  icon: React.ElementType
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  minW?: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const label = options.find(o => o.value === value)?.label ?? options[0].label

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className="relative flex items-stretch border-l border-[#E5E7EB]">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 text-sm text-[#4B5563] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
      >
        <Icon size={14} className="text-[#6199C1] shrink-0" />
        <span className="whitespace-nowrap" style={{ minWidth: minW }}>{label}</span>
        <ChevronDown size={13} className={cn('text-[#6199C1] shrink-0 transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-[210px] bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1.5 z-50">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={cn(
                'w-full text-left px-4 py-2.5 text-sm transition-colors',
                opt.value === value
                  ? 'bg-gray-100 text-[#6199C1] font-medium'
                  : 'text-[#374151] hover:bg-[#F8F9FA]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ProspectsPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [allProspects, setAllProspects] = useState<ProspectRow[]>([])

  useEffect(() => {
    fetch('/api/prospects-data')
      .then((r) => r.json())
      .then(({ prospects }) => setAllProspects(prospects))
  }, [])

  const q = searchParams.get('q') ?? ''
  const statut = (searchParams.get('statut') ?? '') as StatutDossier | ''
  const type = searchParams.get('type') ?? ''

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const prospects = allProspects.filter((p) => {
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
      <div className="px-10 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-[#1F2937]">Prospects & Clients</h1>
      </div>

      <div className="px-10 pb-8 space-y-4">
        {/* Bloc 1 : Recherche + filtres — un seul container avec dividers */}
        <div className="flex items-stretch bg-white border border-[#6199C1]/25 rounded-xl shadow-sm">

          {/* Champ de recherche */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6199C1] pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, organisation…"
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] bg-transparent focus:outline-none"
            />
          </div>

          <FilterDropdown
            icon={ListFilter}
            value={statut}
            onChange={(v) => setParam('statut', v)}
            options={STATUT_OPTIONS}
            minW={148}
          />

          <FilterDropdown
            icon={Users}
            value={type}
            onChange={(v) => setParam('type', v)}
            options={TYPE_OPTIONS}
            minW={128}
          />

          {hasFilters && (
            <button
              onClick={() => router.push('?', { scroll: false })}
              className="flex items-center px-4 border-l border-[#E5E7EB] text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F8F9FA] transition-colors cursor-pointer shrink-0 rounded-r-xl"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Bloc 2 : Tableau */}
        <div className="bg-white rounded-2xl border border-[#6199C1]/25 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB]/80">
                  {[
                    'Nom complet',
                    'Entreprise',
                    'Formation',
                    'Statut formation',
                    'Statut dossier',
                    '',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest px-6 py-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]/80">
                {prospects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#9CA3AF]">
                      {allProspects.length === 0 ? 'Chargement…' : 'Aucun dossier correspondant'}
                    </td>
                  </tr>
                ) : (
                  prospects.map((p, i) => {
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.18, delay: i * 0.03 }}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#1F2937] leading-tight">
                            {p.contact_prenom} {p.contact_nom}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-[#4B5563] leading-tight">{p.nom_entreprise}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-[#4B5563] truncate max-w-[180px] leading-tight">
                            {p.catalogue_formations?.intitule ?? '—'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          {p.type_formation ? (
                            <span className={cn(
                              'text-[10px] font-semibold px-2 py-1 rounded-full',
                              p.type_formation === 'INTER'
                                ? 'bg-violet-50 text-violet-700'
                                : 'bg-[#6199C1]/10 text-[#6199C1]'
                            )}>
                              {p.type_formation}
                            </span>
                          ) : <span className="text-[#9CA3AF] text-[11px]">—</span>}
                        </td>

                        <td className="px-6 py-4">
                          <StatusPill statut={p.statut} />
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            href={`/dossiers/${p.id}`}
                            className="flex items-center justify-center w-7 h-7 rounded-full text-[#9CA3AF] hover:text-[#6199C1] hover:bg-[#6199C1]/10 transition-colors cursor-pointer"
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

          <div className="px-6 py-3 border-t border-[#F3F4F6]">
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
