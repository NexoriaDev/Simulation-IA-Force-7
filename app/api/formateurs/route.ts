import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const { data, error } = await sb()
    .from('formateurs')
    .select(`
      id, nom, prenom, email, specialites, telephone, actif, statut_invitation, compte_cree_le,
      sessions_formation(id, date_debut, date_fin, statut_session, catalogue_formations(intitule))
    `)
    .order('nom')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ formateurs: data ?? [] })
}

export async function PATCH(req: Request) {
  const { id, actif } = await req.json()
  const { error } = await sb()
    .from('formateurs')
    .update({ actif })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
