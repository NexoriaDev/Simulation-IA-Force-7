'use client'

import { useState, Fragment } from 'react'
import { Eye, X, CheckCircle2, XCircle, ChevronRight, FileText, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Données fictives ─────────────────────────────────────────────────────────

const APPRENANTS = ['Thomas Renard', 'Julien Fontaine', 'Stéphane Perrin', 'Adrien Martin']

const SEMAINES = [
  {
    label:   'Semaine 1',
    periode: 'du 7 au 11 juillet 2026',
    jours:   ['Lun 7', 'Mar 8', 'Mer 9', 'Jeu 10', 'Ven 11'],
  },
  {
    label:   'Semaine 2',
    periode: 'du 14 au 18 juillet 2026',
    jours:   ['Lun 14', 'Mar 15', 'Mer 16', 'Jeu 17', 'Ven 18'],
  },
  {
    label:   'Semaine 3',
    periode: 'du 21 au 25 juillet 2026',
    jours:   ['Lun 21', 'Mar 22', 'Mer 23', 'Jeu 24', 'Ven 25'],
  },
]

const PRESENCES: Record<string, Record<string, boolean[]>> = {
  'Thomas Renard': {
    'Semaine 1': [true,  true,  true,  true,  true ],
    'Semaine 2': [true,  true,  false, true,  true ],
    'Semaine 3': [true,  true,  true,  false, true ],
  },
  'Julien Fontaine': {
    'Semaine 1': [true,  true,  true,  true,  false],
    'Semaine 2': [true,  false, true,  true,  true ],
    'Semaine 3': [false, true,  true,  true,  true ],
  },
  'Stéphane Perrin': {
    'Semaine 1': [true,  false, true,  false, true ],
    'Semaine 2': [true,  true,  true,  true,  true ],
    'Semaine 3': [true,  true,  false, true,  false],
  },
  'Adrien Martin': {
    'Semaine 1': [false, true,  true,  true,  false],
    'Semaine 2': [true,  true,  false, true,  true ],
    'Semaine 3': [true,  false, true,  false, true ],
  },
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function PresenceBadge({ days }: { days: boolean[] }) {
  const count = days.filter(Boolean).length
  const total = days.length
  const color =
    count === total      ? 'text-green-600' :
    count >= total * 0.8 ? 'text-green-500' :
    count >= total * 0.6 ? 'text-orange-500' :
                           'text-red-500'
  return (
    <span className={`font-semibold text-sm tabular-nums ${color}`}>
      {count}<span className="text-[#9CA3AF] font-normal text-xs">/{total}</span>
    </span>
  )
}

// ─── Feuilles d'émargement (données fictives demo) ───────────────────────────

const FEUILLES = [
  { nom: 'Émargement_Semaine_1.pdf', date: '12 juillet 2026' },
  { nom: 'Émargement_Semaine_2.pdf', date: '19 juillet 2026' },
  { nom: 'Émargement_Semaine_3.pdf', date: '26 juillet 2026' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmargementPage() {
  const [view, setView]             = useState<'semaines' | 'feuilles'>('semaines')
  const [expanded, setExpanded]     = useState<Set<number>>(new Set())
  const [semaineIdx, setSemaineIdx] = useState<number | null>(null)

  function toggleWeek(idx: number) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  const semaine = semaineIdx != null ? SEMAINES[semaineIdx] : null

  return (
    <>
      {/* Sub-nav secondaire */}
      <div className="flex items-center gap-1.5 mb-4">
        {([
          { key: 'semaines', label: 'Vue par semaine' },
          { key: 'feuilles', label: 'Feuilles d\'émargement' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer',
              view === key
                ? 'bg-[#EBF3FB] text-[#1267A4] border-[#1267A4]/30'
                : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#1267A4]/20 hover:text-[#1267A4]'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'feuilles' ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden divide-y divide-[#F3F4F6]">
          {FEUILLES.map(f => (
            <div key={f.nom} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors">
              <div className="p-2 rounded-lg bg-[#EFF6FF] shrink-0">
                <FileText size={16} className="text-[#6199C1]" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1F2937]">{f.nom}</p>
                <p className="text-[11px] text-[#9CA3AF]">Importé le {f.date}</p>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#EBF3FB] text-[#1267A4] shrink-0">
                Importé depuis EduSign
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 rounded-lg hover:bg-[#EFF6FF] text-[#9CA3AF] hover:text-[#6199C1] transition-colors cursor-pointer" aria-label="Visionner">
                  <Eye size={14} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[#EFF6FF] text-[#9CA3AF] hover:text-[#6199C1] transition-colors cursor-pointer" aria-label="Télécharger">
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#F3F4F6]">
              <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-5 py-3 min-w-[160px]">Numéro de la semaine</th>
              <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3">Semaine</th>
              <th className="text-center text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 w-24">Présences</th>
              <th className="text-center text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 w-16">Liste</th>
            </tr>
          </thead>
          <tbody>
            {SEMAINES.map((sem, si) => (
              <Fragment key={si}>

                {/* En-tête accordéon */}
                <tr
                  className="border-y border-[#E5E7EB] bg-white cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  onClick={() => toggleWeek(si)}
                >
                  <td className="px-5 py-3 text-sm font-semibold text-[#1267A4]">{sem.label}</td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">{sem.periode}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={e => { e.stopPropagation(); setSemaineIdx(si) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto text-[#9CA3AF] hover:bg-white hover:text-[#1267A4] transition-colors cursor-pointer"
                      title="Voir le détail émargement"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <motion.span
                      className="text-[#9CA3AF] flex items-center justify-center"
                      animate={{ rotate: expanded.has(si) ? 90 : 0 }}
                      transition={{ duration: 0.18, ease: 'easeInOut' }}
                    >
                      <ChevronRight size={14} />
                    </motion.span>
                  </td>
                </tr>

                {/* Lignes apprenants */}
                {expanded.has(si) && APPRENANTS.map((apprenant, ai) => (
                  <tr key={ai} className="border-b border-[#F3F4F6] hover:bg-[#FAFBFC] transition-colors">
                    <td colSpan={3} className="px-5 py-3.5 text-sm font-medium text-[#1F2937]">{apprenant}</td>
                    <td className="px-4 py-3.5 text-center">
                      <PresenceBadge days={PRESENCES[apprenant][sem.label]} />
                    </td>
                  </tr>
                ))}

              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      )}

      {/* Modale émargement — tous les apprenants × tous les jours */}
      <AnimatePresence>
        {semaine && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSemaineIdx(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6"
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-base font-semibold text-[#1F2937]">Émargement — {semaine.label}</p>
                  <p className="text-sm text-[#6B7280] mt-0.5">{semaine.periode}</p>
                </div>
                <button
                  onClick={() => setSemaineIdx(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#9CA3AF] hover:bg-[#F3F4F6] transition-colors cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F3F4F6]">
                    <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide pb-3 pr-4 min-w-[140px]">Apprenant</th>
                    {semaine.jours.map(j => (
                      <th key={j} className="text-center text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide pb-3 px-2 whitespace-nowrap">{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {APPRENANTS.map((apprenant, ai) => {
                    const days = PRESENCES[apprenant][semaine.label]
                    return (
                      <tr key={ai} className="border-b border-[#F3F4F6] last:border-0">
                        <td className="py-3 pr-4 text-sm font-medium text-[#1F2937]">{apprenant}</td>
                        {days.map((present, i) => (
                          <td key={i} className="py-3 px-2 text-center">
                            {present
                              ? <CheckCircle2 size={18} className="text-green-500 mx-auto" />
                              : <XCircle      size={18} className="text-red-400 mx-auto" />
                            }
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
