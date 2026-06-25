import Link from 'next/link'
import { Eye } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { STATUT_DOSSIER_CONFIG } from '@/lib/utils/format'
import type { StatutDossier } from '@/lib/types'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Identique à prospects/page.tsx
const STATUT_PILL_STYLE: Record<StatutDossier, string> = {
  profil_cree:      'bg-gray-50 text-gray-500 border-gray-200',
  devis_en_attente: 'bg-gray-50 text-gray-500 border-gray-200',
  devis_genere:     'bg-gray-50 text-gray-500 border-gray-200',
  devis_envoye:     'bg-gray-50 text-gray-500 border-gray-200',
  devis_signe:      'bg-gray-50 text-gray-500 border-gray-200',
  prospect_gagne:   'bg-green-50 text-green-700 border-green-200',
  valide:           'bg-green-50 text-green-700 border-green-200',
  prospect_perdu:   'bg-red-50 text-red-500 border-red-200',
}

function StatusPill({ statut }: { statut: StatutDossier }) {
  const cfg = STATUT_DOSSIER_CONFIG[statut]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border', STATUT_PILL_STYLE[statut])}>
      {cfg.label}
    </span>
  )
}

export default async function ApprenantsPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = sb()

  const { data: session } = await supabase
    .from('sessions_formation')
    .select('type_formation, catalogue_formations(intitule)')
    .eq('id', sessionId)
    .single()

  const formation    = (session?.catalogue_formations as { intitule?: string } | null)?.intitule ?? '—'
  const typeFormation = session?.type_formation ?? null

  const { data: raw } = await supabase
    .from('apprenants')
    .select('id, prenom, nom, prospects_clients(id, nom_entreprise, statut)')
    .eq('session_id', sessionId)
    .order('nom')

  const rows = (raw ?? []).map(a => {
    const pc = a.prospects_clients as unknown as { id: string; nom_entreprise: string; statut: string } | null
    return {
      id:         a.id as string,
      prenom:     a.prenom as string,
      nom:        a.nom as string,
      entreprise: pc?.nom_entreprise ?? '—',
      dossierId:  pc?.id ?? null,
      statut:     (pc?.statut ?? 'profil_cree') as StatutDossier,
    }
  })

  return (
    <div className="bg-white rounded-2xl border border-[#6199C1]/25 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              {['Nom complet', 'Entreprise', 'Formation', 'Statut formation', 'Statut dossier', ''].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest px-6 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#9CA3AF]">
                  Aucun apprenant inscrit à cette session
                </td>
              </tr>
            ) : rows.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-[#1F2937] leading-tight">{r.prenom} {r.nom}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[#4B5563] leading-tight">{r.entreprise}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[#4B5563] truncate max-w-[180px] leading-tight">{formation}</p>
                </td>
                <td className="px-6 py-4">
                  {typeFormation ? (
                    <span className={cn(
                      'text-[10px] font-semibold px-2 py-1 rounded-full',
                      typeFormation === 'INTER' ? 'bg-violet-50 text-violet-700' : 'bg-[#6199C1]/10 text-[#6199C1]'
                    )}>
                      {typeFormation}
                    </span>
                  ) : <span className="text-[#9CA3AF] text-[11px]">—</span>}
                </td>
                <td className="px-6 py-4">
                  <StatusPill statut={r.statut} />
                </td>
                <td className="px-6 py-4">
                  {r.dossierId ? (
                    <Link
                      href={`/dossiers/${r.dossierId}`}
                      className="flex items-center justify-center w-7 h-7 rounded-full text-[#9CA3AF] hover:text-[#6199C1] hover:bg-[#6199C1]/10 transition-colors"
                      aria-label={`Ouvrir la fiche de ${r.prenom} ${r.nom}`}
                    >
                      <Eye size={14} />
                    </Link>
                  ) : (
                    <span className="text-[#D1D5DB] text-[11px] px-2">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-[#F3F4F6]">
        <p className="text-[11px] text-[#9CA3AF]">{rows.length} apprenant{rows.length > 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}
