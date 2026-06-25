import Link from 'next/link'
import { Hand, ArrowRight, Bell } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Même logique que page.tsx (Suivi administratif)
const STATUT_RANK: Record<string, number> = {
  profil_cree:            1,
  profil_keypredict_cree: 2,
  test_envoye:            3,
  test_complete:          4,
  profil_edusign_cree:    5,
  attestation_envoyee:    6,
}

const ETAPES = [
  { label: 'Devis envoyé',  action: 'Envoyer le devis' },
  { label: 'Devis signé',   action: 'Valider la signature du devis' },
  { label: 'Keypredict',    action: 'Créer le profil Keypredict' },
  { label: 'Test envoyé',   action: null }, // automatique
  { label: 'Edusign',       action: null }, // automatique
  { label: 'Attestation',   action: 'Envoyer l\'attestation de fin de formation' },
] as const

function deriveManualSteps(a: {
  statut: string
  profil_keypredict_id: string | null
  profil_edusign_id:    string | null
}): number[] {
  const rank  = STATUT_RANK[a.statut] ?? 0
  const hasKP = !!a.profil_keypredict_id
  const hasES = !!a.profil_edusign_id

  const statuses = [
    'done',
    rank >= 1 ? 'done' : 'manual',
    hasKP    ? 'done' : rank >= 1 ? 'manual' : 'none',
    'none',   // test_envoye = automatique
    'none',   // edusign     = automatique
    rank >= 5 ? 'done' : hasES ? 'manual' : 'none',
  ]

  return statuses.reduce<number[]>((acc, s, i) => s === 'manual' ? [...acc, i] : acc, [])
}

export default async function NotificationsSessionPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>
}) {
  const { sessionId } = await params
  const supabase = sb()

  const { data: raw } = await supabase
    .from('apprenants')
    .select('id, prenom, nom, statut, profil_keypredict_id, profil_edusign_id, prospects_clients(id)')
    .eq('session_id', sessionId)
    .order('nom')

  type Notif = { key: string; action: string; apprenant: string; dossierId: string | null }

  const notifs: Notif[] = (raw ?? []).flatMap(a => {
    const pc = a.prospects_clients as unknown as { id: string } | null
    const manualIdxs = deriveManualSteps({
      statut:               a.statut as string,
      profil_keypredict_id: a.profil_keypredict_id as string | null,
      profil_edusign_id:    a.profil_edusign_id    as string | null,
    })
    return manualIdxs
      .filter(i => ETAPES[i].action !== null)
      .map(i => ({
        key:        `${a.id}-${i}`,
        action:     ETAPES[i].action!,
        apprenant:  `${a.prenom} ${a.nom}`,
        dossierId:  pc?.id ?? null,
      }))
  })

  if (notifs.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-16 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-3">
          <Bell size={20} className="text-green-500" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-[#1F2937] mb-1">Aucune action en attente</p>
        <p className="text-xs text-[#9CA3AF]">Toutes les étapes manuelles de cette session sont à jour.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#F3F4F6] flex items-center justify-between">
        <p className="text-sm font-semibold text-[#1F2937]">Actions à valider</p>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-500">
          {notifs.length}
        </span>
      </div>

      <div className="divide-y divide-[#F9FAFB]">
        {notifs.map(n => (
          <div key={n.key} className="flex items-start gap-3 px-5 py-3.5 bg-[#FAFCFF] hover:bg-[#FFF7ED]/60 transition-colors">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-orange-50">
              <Hand size={14} className="text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1F2937] leading-snug">{n.action}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{n.apprenant} · À valider par Iliès</p>
            </div>
            {n.dossierId && (
              <Link
                href={`/dossiers/${n.dossierId}`}
                className="flex items-center gap-1 shrink-0 text-[11px] text-[#6199C1] hover:text-[#1267A4] font-medium transition-colors mt-0.5"
              >
                Voir <ArrowRight size={11} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
