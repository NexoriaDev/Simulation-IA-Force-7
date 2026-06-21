import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: seLinks } = await supabase
    .from('session_entreprises')
    .select('session_id')
    .eq('prospect_client_id', id)

  const sessionIds = (seLinks ?? []).map((s: any) => s.session_id)
  if (sessionIds.length === 0) return NextResponse.json([])

  const [{ data: sessions }, { data: allSE }, { data: allApprenants }] = await Promise.all([
    supabase
      .from('sessions_formation')
      .select('*, catalogue_formations(intitule), formateurs(nom, prenom)')
      .in('id', sessionIds),
    supabase
      .from('session_entreprises')
      .select('*, prospects_clients(nom_entreprise)')
      .in('session_id', sessionIds),
    supabase
      .from('apprenants')
      .select('*')
      .in('session_id', sessionIds),
  ])

  const result = (sessions ?? []).map((session: any) => ({
    ...session,
    session_entreprises: (allSE ?? [])
      .filter((se: any) => se.session_id === session.id)
      .map((se: any) => ({
        ...se,
        apprenants: (allApprenants ?? []).filter(
          (a: any) => a.session_id === session.id && a.prospect_client_id === se.prospect_client_id
        ),
      })),
  }))

  return NextResponse.json(result)
}
