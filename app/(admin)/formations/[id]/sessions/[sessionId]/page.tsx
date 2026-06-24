import Link from 'next/link'
import { ArrowLeft, Calendar, Users, BookOpen } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>
}) {
  const { id, sessionId } = await params
  const supabase = sb()

  // Essai avec plafond_apprenants (migration 008+), fallback sans
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

  return (
    <div>
      {/* Fil d'ariane */}
      <nav className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href={`/formations/${id}`}
          className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#1267A4] transition-colors"
        >
          <ArrowLeft size={14} />
          {formation}
        </Link>
        {session && (
          <>
            <span className="text-[#D1D5DB]">/</span>
            <span className="text-[#1F2937] font-medium">
              Session du {fmtDate(session.date_debut)}
            </span>
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
              <span className="text-xs text-[#9CA3AF] bg-[#F8F9FA] px-3 py-1 rounded-full border border-[#E5E7EB]">
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

          {/* Placeholder contenu futur */}
          <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] py-16 flex flex-col items-center text-center">
            <p className="text-sm font-medium text-[#374151] mb-1">Dashboard de session</p>
            <p className="text-xs text-[#9CA3AF]">
              Apprenants inscrits, émargement et documents — à venir.
            </p>
          </div>
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
