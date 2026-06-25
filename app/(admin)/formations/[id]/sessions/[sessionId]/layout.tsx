import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { SessionTabsNav } from '@/components/layout/SessionTabsNav'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function SessionLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string; sessionId: string }>
}) {
  const { id, sessionId } = await params
  const supabase = sb()

  const { data: session } = await supabase
    .from('sessions_formation')
    .select('id, date_debut, catalogue_formations(intitule)')
    .eq('id', sessionId)
    .single()

  const formation = (session?.catalogue_formations as { intitule?: string } | null)?.intitule ?? 'Formation'

  return (
    <div>
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
      <SessionTabsNav id={id} sessionId={sessionId} />
      {children}
    </div>
  )
}
