import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const debut = searchParams.get('debut')
  const fin = searchParams.get('fin')

  const supabase = sb()

  const { data: formateurs, error } = await supabase
    .from('formateurs')
    .select('id, nom, prenom')
    .eq('actif', true)
    .order('nom')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!debut || !fin) {
    return NextResponse.json({ formateurs: (formateurs ?? []).map(f => ({ ...f, disponible: true })) })
  }

  // Find sessions that overlap [debut, fin]: start <= fin AND end >= debut
  const { data: overlapping } = await supabase
    .from('sessions_formation')
    .select('id, formateur_id')
    .lte('date_debut', fin)
    .gte('date_fin', debut)

  const occupiedLegacy = new Set(
    (overlapping ?? []).map(s => s.formateur_id).filter(Boolean)
  )

  const overlappingIds = (overlapping ?? []).map(s => s.id)
  const occupiedJunction = new Set<string>()

  if (overlappingIds.length > 0) {
    const { data: jRows } = await supabase
      .from('session_formateurs')
      .select('formateur_id')
      .in('session_id', overlappingIds)
    ;(jRows ?? []).forEach(r => occupiedJunction.add(r.formateur_id))
  }

  const occupied = new Set([...occupiedLegacy, ...occupiedJunction])

  return NextResponse.json({
    formateurs: (formateurs ?? []).map(f => ({ ...f, disponible: !occupied.has(f.id) })),
  })
}
