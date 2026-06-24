import Link from 'next/link'
import { ArrowLeft, Calendar, Users, BookOpen, CheckCircle2, Timer, Minus } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Étapes du processus ──────────────────────────────────────────────────────

const ETAPES = [
  { key: 'devis_envoye',        label: 'Devis envoyé' },
  { key: 'devis_signe',         label: 'Devis signé' },
  { key: 'keypredict_cree',     label: 'Keypredict' },
  { key: 'test_envoye',         label: 'Test envoyé' },
  { key: 'edusign_cree',        label: 'Edusign' },
  { key: 'attestation_envoyee', label: 'Attestation' },
] as const

type StepStatus = 'done' | 'pending' | 'none'

// Rang de progression du statut apprenant
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
  const rank = STATUT_RANK[a.statut] ?? 0
  const hasKP = !!a.profil_keypredict_id
  const hasES = !!a.profil_edusign_id
  return [
    'done',                                           // Devis envoyé — vrai si l'apprenant est inscrit
    rank >= 1 ? 'done'    : 'pending',                // Devis signé
    hasKP    ? 'done'    : rank >= 1 ? 'pending' : 'none',  // Keypredict créé
    rank >= 3 ? 'done'   : hasKP    ? 'pending' : 'none',  // Test envoyé
    hasES    ? 'done'    : rank >= 3 ? 'pending' : 'none',  // Edusign créé
    rank >= 5 ? 'done'   : hasES    ? 'pending' : 'none',  // Attestation
  ]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>
}) {
  const { id, sessionId } = await params
  const supabase = sb()

  // Session — fallback si migration 008 non appliquée
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let session: Record<string, any> | null = null
  const { data: s1 } = await supabase
    .from('sessions_formation')
    .select('id, date_debut, date_fin, type_formation, statut_session, plafond_apprenants, catalogue_formations(intitule)')
    .eq('id', sessionId)
    .single()
  if (s1) {
    session = s1
  } else {
    const { data: s2 } = await supabase
      .from('sessions_formation')
      .select('id, date_debut, date_fin, type_formation, statut_session, catalogue_formations(intitule)')
      .eq('id', sessionId)
      .single()
    session = s2
  }

  const formation = (session?.catalogue_formations as { intitule?: string } | null)?.intitule ?? 'Formation'

  // Apprenants — avec join entreprise, fallback si colonne manquante
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawApprenants: any[] = []
  const { data: a1 } = await supabase
    .from('apprenants')
    .select('id, prenom, nom, email, statut, profil_keypredict_id, profil_edusign_id, prospects_clients(nom_entreprise)')
    .eq('session_id', sessionId)
    .order('nom')
  if (a1) {
    rawApprenants = a1
  } else {
    const { data: a2 } = await supabase
      .from('apprenants')
      .select('id, prenom, nom, email, statut')
      .eq('session_id', sessionId)
      .order('nom')
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
    <div>
      {/* Fil d'ariane */}
      <nav className="flex items-center gap-2 mb-6 text-sm">
        <Link href={`/formations/${id}`} className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#1267A4] transition-colors">
          <ArrowLeft size={14} />
          {formation}
        </Link>
        {session && (
          <>
            <span className="text-[#D1D5DB]">/</span>
            <span className="text-[#1F2937] font-medium">Session du {fmtDate(session.date_debut)}</span>
          </>
        )}
      </nav>

      {session ? (
        <div className="space-y-6">

          {/* En-tête session */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                session.type_formation === 'INTER' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
              }`}>
                {session.type_formation}
              </span>
              <span className="text-xs text-[#6B7280] bg-[#F8F9FA] px-3 py-1 rounded-full border border-[#E5E7EB]">
                {session.statut_session}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-[#1267A4] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Période</p>
                  <p className="text-sm font-medium text-[#1F2937]">{fmtDate(session.date_debut)}</p>
                  <p className="text-xs text-[#9CA3AF]">→ {fmtDate(session.date_fin)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={16} className="text-[#1267A4] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Plafond</p>
                  <p className="text-sm font-medium text-[#1F2937]">
                    {session.plafond_apprenants ? `${session.plafond_apprenants} apprenants` : 'Sans plafond'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen size={16} className="text-[#1267A4] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-[#9CA3AF] mb-0.5">Formation</p>
                  <p className="text-sm font-medium text-[#1F2937]">{formation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total — bandeau bleu */}
          <div className="bg-[#1267A4] text-white rounded-2xl px-6 py-5 flex items-center gap-5">
            <span className="text-5xl font-bold">{total}</span>
            <div>
              <p className="text-sm font-semibold opacity-90">apprenant{total !== 1 ? 's' : ''} inscrits</p>
              <p className="text-[11px] opacity-60 mt-0.5">à cette session</p>
            </div>
          </div>

          {/* Compteurs par étape */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ETAPES.map((e, i) => {
              const done = apprenantRows.filter(a => a.steps[i] === 'done').length
              const pct  = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={e.key} className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
                  <p className="text-2xl font-bold text-[#1F2937]">
                    {done}<span className="text-base font-normal text-[#9CA3AF]">/{total}</span>
                  </p>
                  <p className="text-[11px] text-[#6B7280] mt-1 leading-tight mb-2">{e.label}</p>
                  {/* Barre de progression */}
                  <div className="h-1 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1267A4] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
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
              <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1F2937]">Suivi par apprenant</h3>
                <span className="text-xs text-[#9CA3AF]">{total} apprenant{total !== 1 ? 's' : ''}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[740px]">
                  <thead>
                    <tr className="bg-[#F8F9FA] border-b border-[#F3F4F6]">
                      <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-5 py-3 min-w-[160px]">Apprenant</th>
                      <th className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-4 py-3 min-w-[130px]">Entreprise</th>
                      {ETAPES.map(e => (
                        <th key={e.key} className="text-center text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-2 py-3 min-w-[76px] leading-tight">{e.label}</th>
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
                            {status === 'done' ? (
                              <CheckCircle2 size={16} className="text-green-500 mx-auto" />
                            ) : status === 'pending' ? (
                              <Timer size={16} className="text-orange-400 mx-auto" />
                            ) : (
                              <Minus size={14} className="text-[#D1D5DB] mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] py-16 flex flex-col items-center text-center">
          <p className="text-sm font-medium text-[#374151] mb-2">Session introuvable</p>
          <Link href={`/formations/${id}`} className="text-xs text-[#1267A4] hover:underline">
            ← Retour à la formation
          </Link>
        </div>
      )}
    </div>
  )
}
