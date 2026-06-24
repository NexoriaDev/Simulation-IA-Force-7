'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FolderOpen,
  CalendarDays,
  AlertTriangle,
  Bell,
  ArrowUpRight,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  STATUT_DOSSIER_CONFIG,
  FINANCEMENT_CONFIG,
  formatRelativeDate,
} from '@/lib/utils/format'
import type { StatutDossier, ProspectClient } from '@/lib/types'

type ProspectRow = ProspectClient & {
  catalogue_formations: { intitule: string } | null
}

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  delay,
}: {
  label: string
  value: number
  icon: React.ElementType
  accent?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex items-start gap-4"
    >
      <div className={cn('p-2.5 rounded-lg', accent ?? 'bg-[#6199C1]/8')}>
        <Icon size={18} className={accent ? 'text-current' : 'text-[#6199C1]'} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-[28px] font-semibold text-[#1F2937] leading-none mb-1">{value}</p>
        <p className="text-xs text-[#6B7280]">{label}</p>
      </div>
    </motion.div>
  )
}

// ─── Status pill ──────────────────────────────────────────────────────────────

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

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: 'tous', label: 'Tous' },
  { key: 'actifs', label: 'En cours' },
  { key: 'gagne', label: 'Gagnés' },
  { key: 'perdu', label: 'Perdus' },
] as const

type FilterKey = (typeof FILTER_TABS)[number]['key']

function filterProspects(list: ProspectRow[], filter: FilterKey, search: string, typeFilter: string) {
  let result = list

  if (filter === 'actifs') {
    result = result.filter((p) => p.statut !== 'prospect_perdu' && p.statut !== 'valide')
  } else if (filter === 'gagne') {
    result = result.filter((p) => p.statut === 'prospect_gagne' || p.statut === 'valide')
  } else if (filter === 'perdu') {
    result = result.filter((p) => p.statut === 'prospect_perdu')
  }

  if (typeFilter) {
    result = result.filter((p) => p.type_formation === typeFilter)
  }

  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter(
      (p) =>
        p.nom_entreprise.toLowerCase().includes(q) ||
        p.contact_nom.toLowerCase().includes(q) ||
        p.contact_prenom.toLowerCase().includes(q)
    )
  }

  return [...result].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('tous')
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')
  const [allProspects, setAllProspects] = useState<ProspectRow[]>([])
  const [notifCount, setNotifCount] = useState(0)
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    fetch('/api/prospects-data')
      .then((r) => r.json())
      .then(({ prospects, sessions, notifs }) => {
        setAllProspects(prospects)
        setSessionCount(sessions)
        setNotifCount(notifs)
      })
  }, [])

  const actifs = allProspects.filter((p) => p.statut !== 'prospect_perdu').length
  const prospects = filterProspects(allProspects, activeFilter, search, typeFilter)

  return (
    <div className="min-h-full bg-[#F8F9FA]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-semibold text-[#1F2937]">Tableau de bord</h1>
          <p className="text-xs text-[#9CA3AF]">Samedi 20 juin 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={18} className="text-[#6B7280]" />
            {notifCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FEE700] rounded-full text-[9px] font-bold text-[#6199C1] flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Dossiers actifs" value={actifs} icon={FolderOpen} delay={0} />
          <MetricCard label="Sessions en cours" value={sessionCount} icon={CalendarDays} delay={0.05} />
          <MetricCard
            label="Dossiers urgents"
            value={0}
            icon={AlertTriangle}
            accent="bg-red-50 text-red-500"
            delay={0.1}
          />
        </div>

        {/* Dossiers table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
        >
          {/* Table header */}
          <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer',
                    activeFilter === tab.key
                      ? 'bg-[#6199C1] text-white font-medium'
                      : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F9FA]'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#6B7280] bg-white hover:border-[#9CA3AF] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6199C1]/20"
              >
                <option value="">Tous types</option>
                <option value="INTER">INTER</option>
                <option value="INTRA">INTRA</option>
              </select>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-[#E5E7EB] rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6199C1]/20 focus:border-[#6199C1]/40 transition-colors w-48"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                  <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-5 py-3">
                    Entreprise
                  </th>
                  <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">
                    Formation
                  </th>
                  <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">
                    Statut
                  </th>
                  <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">
                    Financement
                  </th>
                  <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">
                    Activité
                  </th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {prospects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#9CA3AF]">
                      {allProspects.length === 0 ? 'Chargement…' : 'Aucun dossier trouvé'}
                    </td>
                  </tr>
                ) : (
                  prospects.map((p, i) => {
                    const financement = p.type_financement
                      ? FINANCEMENT_CONFIG[p.type_financement]
                      : null

                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        className="hover:bg-[#FAFAFA] transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <div>
                            <p className="font-medium text-[#1F2937] leading-tight">
                              {p.nom_entreprise}
                            </p>
                            <p className="text-[11px] text-[#9CA3AF] leading-tight">
                              {p.contact_prenom} {p.contact_nom}
                              {p.contact_fonction ? ` · ${p.contact_fonction}` : ''}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div>
                            <p className="text-[#1F2937] leading-tight truncate max-w-[180px]">
                              {p.catalogue_formations?.intitule ?? '—'}
                            </p>
                            <div className="mt-0.5">
                              {p.type_formation && (
                                <span
                                  className={cn(
                                    'text-[10px] font-semibold px-1.5 py-0.5 rounded',
                                    p.type_formation === 'INTER'
                                      ? 'bg-violet-50 text-violet-700'
                                      : 'bg-[#6199C1]/8 text-[#6199C1]'
                                  )}
                                >
                                  {p.type_formation}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <StatusPill statut={p.statut} />
                        </td>

                        <td className="px-4 py-3.5">
                          {financement && (
                            <span
                              className={cn(
                                'text-[11px] px-2 py-0.5 rounded-md font-medium',
                                financement.bg,
                                financement.text
                              )}
                            >
                              {financement.label}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="text-[12px] text-[#6B7280]">
                            {formatRelativeDate(p.updated_at)}
                          </p>
                        </td>

                        <td className="px-4 py-3.5">
                          <Link
                            href={`/dossiers/${p.id}`}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
                            aria-label={`Ouvrir la fiche ${p.nom_entreprise}`}
                          >
                            <ArrowUpRight size={14} className="text-[#6B7280]" />
                          </Link>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-[#F3F4F6] flex items-center justify-between">
            <p className="text-[11px] text-[#9CA3AF]">
              {prospects.length} dossier{prospects.length > 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
