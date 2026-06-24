import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function sb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

type Conflit = { formation: string; date_debut: string; date_fin: string }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const debut = searchParams.get('debut')
  const fin = searchParams.get('fin')

  const supabase = sb()

  // Tous les formateurs, sans filtre actif
  const { data: formateurs, error } = await supabase
    .from('formateurs')
    .select('id, nom, prenom')
    .order('nom')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (!debut || !fin) {
    return NextResponse.json({ formateurs: (formateurs ?? []).map(f => ({ ...f, disponible: true, conflit: null })) })
  }

  // Sessions qui chevauchent [debut, fin] : date_debut <= fin ET date_fin >= debut
  const { data: overlapping } = await supabase
    .from('sessions_formation')
    .select('id, formateur_id, date_debut, date_fin, catalogue_formations(intitule)')
    .lte('date_debut', fin)
    .gte('date_fin', debut)

  // Map formateur_id → premier conflit connu (legacy formateur_id)
  const conflitMap = new Map<string, Conflit>()
  for (const s of overlapping ?? []) {
    if (s.formateur_id && !conflitMap.has(s.formateur_id)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      conflitMap.set(s.formateur_id, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formation: (s.catalogue_formations as any)?.intitule ?? 'Autre session',
        date_debut: s.date_debut,
        date_fin: s.date_fin,
      })
    }
  }

  // Compléter via session_formateurs (junction table — migrations 008+)
  const overlappingIds = (overlapping ?? []).map(s => s.id)
  if (overlappingIds.length > 0) {
    const { data: jRows } = await supabase
      .from('session_formateurs')
      .select('formateur_id, sessions_formation(date_debut, date_fin, catalogue_formations(intitule))')
      .in('session_id', overlappingIds)

    for (const row of jRows ?? []) {
      if (!conflitMap.has(row.formateur_id)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sf = row.sessions_formation as any
        conflitMap.set(row.formateur_id, {
          formation: sf?.catalogue_formations?.intitule ?? 'Autre session',
          date_debut: sf?.date_debut ?? '',
          date_fin: sf?.date_fin ?? '',
        })
      }
    }
  }

  return NextResponse.json({
    formateurs: (formateurs ?? []).map(f => ({
      ...f,
      disponible: !conflitMap.has(f.id),
      conflit: conflitMap.get(f.id) ?? null,
    })),
  })
}
