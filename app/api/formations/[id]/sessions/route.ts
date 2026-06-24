import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: formation_id } = await params
  const {
    date_debut, date_fin, type_formation,
    plafond_apprenants, formateur_ids = [], prospect_ids = [],
  } = await req.json()

  if (!date_debut || !date_fin || !type_formation) {
    return NextResponse.json({ error: 'date_debut, date_fin, type_formation requis' }, { status: 400 })
  }

  const supabase = sb()

  const { data: session, error: sErr } = await supabase
    .from('sessions_formation')
    .insert({ formation_id, date_debut, date_fin, type_formation, plafond_apprenants: plafond_apprenants ?? null })
    .select()
    .single()

  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 })

  if (formateur_ids.length > 0) {
    const { error: fErr } = await supabase
      .from('session_formateurs')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(formateur_ids.map((fid: any) => ({ session_id: session.id, formateur_id: fid })))
    if (fErr) return NextResponse.json({ error: fErr.message }, { status: 500 })
  }

  if (prospect_ids.length > 0) {
    const { data: prospects } = await supabase
      .from('prospects_clients')
      .select('id, contact_nom, contact_prenom, contact_email, contact_fonction')
      .in('id', prospect_ids)

    if (prospects?.length) {
      const { error: aErr } = await supabase
        .from('apprenants')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(prospects.map((p: any) => ({
          session_id: session.id,
          prospect_client_id: p.id,
          nom: p.contact_nom,
          prenom: p.contact_prenom,
          email: p.contact_email,
          fonction: p.contact_fonction,
        })))
      if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 })
    }
  }

  return NextResponse.json({ session }, { status: 201 })
}
