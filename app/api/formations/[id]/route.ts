import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = sb()

  const { data: formation, error: fErr } = await supabase
    .from('catalogue_formations').select('*').eq('id', id).single()

  if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 })
  if (!formation) return NextResponse.json({ error: 'Formation introuvable' }, { status: 404 })

  // Fetch sessions — degrade gracefully if migrations 008/009 not yet applied
  const { data: sessions } = await supabase
    .from('sessions_formation')
    .select('id, date_debut, date_fin, type_formation, plafond_apprenants, statut_session, apprenants(id), session_formateurs(formateur_id, formateurs(id, nom, prenom))')
    .eq('formation_id', id)
    .order('date_debut')

  // Fallback if junction table / column missing
  const { data: sessionsFallback } = sessions
    ? { data: null }
    : await supabase
        .from('sessions_formation')
        .select('id, date_debut, date_fin, type_formation, statut_session, formateur_id, formateurs(id, nom, prenom), apprenants(id)')
        .eq('formation_id', id)
        .order('date_debut')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanSessions = (sessions ?? sessionsFallback ?? []).map((s: any) => ({
    id: s.id,
    date_debut: s.date_debut,
    date_fin: s.date_fin,
    type_formation: s.type_formation,
    plafond_apprenants: s.plafond_apprenants ?? null,
    statut_session: s.statut_session,
    nb_apprenants: (s.apprenants ?? []).length,
    formateurs: s.session_formateurs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (s.session_formateurs ?? []).map((sf: any) => sf.formateurs).filter(Boolean)
      : (s.formateurs ? [s.formateurs] : []),
  }))

  return NextResponse.json({ formation, sessions: cleanSessions })
}
