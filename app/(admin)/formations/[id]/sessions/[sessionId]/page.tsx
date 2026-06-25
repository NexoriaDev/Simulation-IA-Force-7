import { Users, CheckCircle2, Hand, Minus } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// ─── Étapes du processus ──────────────────────────────────────────────────────
// mode 'a_valider'  → état intermédiaire = main orange (Iliès doit agir)
// mode 'automatique' → état intermédiaire = tiret (pas encore traité par le système)

const ETAPES = [
  { key: 'devis_envoye',        label: 'Devis envoyé', mode: 'a_valider'   as const },
  { key: 'devis_signe',         label: 'Devis signé',  mode: 'a_valider'   as const },
  { key: 'keypredict_cree',     label: 'Keypredict',   mode: 'a_valider'   as const },
  { key: 'test_envoye',         label: 'Test envoyé',  mode: 'automatique' as const },
  { key: 'edusign_cree',        label: 'Edusign',      mode: 'automatique' as const },
  { key: 'attestation_envoyee', label: 'Attestation',  mode: 'a_valider'   as const },
] as const

type StepStatus = 'done' | 'manual' | 'none'

const STATUT_RANK: Record<string, number> = {
  profil_cree:            1,
  profil_keypredict_cree: 2,
  tests_soumis:           3,
  profil_edusign_cree:    4,
  attestation_envoyee:    5,
}

function deriveSteps(a: {
  statut: string
  profil_keypredict_id: string | null
  profil_edusign_id: string | null
}): StepStatus[] {
  const rank  = STATUT_RANK[a.statut] ?? 0
  const hasKP = !!a.profil_keypredict_id
  const hasES = !!a.profil_edusign_id

  const reached = (mode: 'a_valider' | 'automatique'): StepStatus =>
    mode === 'a_valider' ? 'manual' : 'none'

  return [
    'done',
    rank >= 1 ? 'done' : reached('a_valider'),
    hasKP    ? 'done' : rank >= 1 ? reached('a_valider')  : 'none',
    rank >= 3 ? 'done' : hasKP   ? reached('automatique') : 'none',
    hasES    ? 'done' : rank >= 3 ? reached('automatique') : 'none',
    rank >= 5 ? 'done' : hasES   ? reached('a_valider')   : 'none',
  ]
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done')   return <CheckCircle2 size={16} className="text-green-500 mx-auto" />
  if (status === 'manual') return <Hand         size={16} className="text-orange-400 mx-auto" />
  return                          <Minus        size={14} className="text-[#D1D5DB] mx-auto" />
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = sb()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawApprenants: any[] = []
  const { data: a1 } = await supabase
    .from('apprenants')
    .select('id, prenom, nom, email, statut, profil_keypredict_id, profil_edusign_id, prospects_clients(nom_entreprise)')
    .eq('session_id', sessionId).order('nom')
  if (a1) {
    rawApprenants = a1
  } else {
    const { data: a2 } = await supabase
      .from('apprenants')
      .select('id, prenom, nom, email, statut')
      .eq('session_id', sessionId).order('nom')
    rawApprenants = a2 ?? []
  }

  const apprenantRows = rawApprenants.map(a => ({
    id:         a.id as string,
    prenom:     (a.prenom ?? '') as string,
    nom:        (a.nom ?? '') as string,
    email:      (a.email ?? null) as string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entreprise: ((a.prospects_clients as any)?.nom_entreprise ?? null) as string | null,
    steps:      deriveSteps({
      statut:               a.statut ?? '',
      profil_keypredict_id: a.profil_keypredict_id ?? null,
      profil_edusign_id:    a.profil_edusign_id ?? null,
    }),
  }))

  const total = apprenantRows.length

  return (
    <div className="space-y-6">

      {/* Compteurs — total apprenants (1ère carte) + 6 étapes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <p className="text-2xl font-bold text-[#1F2937]">{total}</p>
          <p className="text-[11px] text-[#6B7280] mt-1 leading-tight">Apprenant{total !== 1 ? 's' : ''}</p>
        </div>
        {ETAPES.map((e, i) => {
          const done = apprenantRows.filter(a => a.steps[i] === 'done').length
          return (
            <div key={e.key} className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
              <p className="text-2xl font-bold text-[#1F2937]">
                {done}<span className="text-base font-normal text-[#9CA3AF]">/{total}</span>
              </p>
              <p className="text-[11px] text-[#6B7280] mt-1 leading-tight">{e.label}</p>
            </div>
          )
        })}
      </div>

      {/* Tableau suivi */}
      {total === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] py-16 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF3FB] flex items-center justify-center mb-3">
            <Users size={20} className="text-[#1267A4]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-[#374151] mb-1">Aucun apprenant inscrit</p>
          <p className="text-xs text-[#9CA3AF]">Les apprenants inscrits à cette session apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px]">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-[#F3F4F6]">
                  <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-5 py-3 min-w-[160px]">Apprenant</th>
                  <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 min-w-[130px]">Entreprise</th>
                  {ETAPES.map(e => (
                    <th key={e.key} className="text-center text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-2 py-3 min-w-[76px] leading-tight">
                      {e.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apprenantRows.map(a => (
                  <tr key={a.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-[#1F2937]">{a.prenom} {a.nom}</p>
                      {a.email && <p className="text-[11px] text-[#9CA3AF] truncate max-w-[180px]">{a.email}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#6B7280]">
                      {a.entreprise ?? <span className="text-[#D1D5DB]">—</span>}
                    </td>
                    {a.steps.map((status, j) => (
                      <td key={j} className="px-2 py-3.5 text-center">
                        <StepIcon status={status} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Légende */}
          <div className="px-6 py-3 border-t border-[#F3F4F6] flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <CheckCircle2 size={13} className="text-green-500" /> Complété
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <Hand size={13} className="text-orange-400" /> À valider par Iliès
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <Minus size={12} className="text-[#D1D5DB]" /> Non atteint
            </span>
          </div>
        </div>
      )}

    </div>
  )
}
