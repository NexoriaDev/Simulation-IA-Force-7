import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/sessions?avenir=true — sessions à venir avec formateur courant
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const today = new Date().toISOString().split('T')[0]

  let query = sb()
    .from('sessions_formation')
    .select(`
      id, date_debut, date_fin, statut_session, formateur_id,
      catalogue_formations(intitule),
      formateurs(nom, prenom)
    `)
    .order('date_debut')

  if (searchParams.get('avenir') === 'true') query = query.gt('date_debut', today)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sessions: data ?? [] })
}

// PATCH /api/sessions — assigne un formateur à une liste de sessions (remplace l'existant)
export async function PATCH(req: Request) {
  const { formateur_id, session_ids } = await req.json()

  if (!formateur_id || !Array.isArray(session_ids) || session_ids.length === 0) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { error } = await sb()
    .from('sessions_formation')
    .update({ formateur_id })
    .in('id', session_ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
