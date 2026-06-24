import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = db()
  const { data: formations, error } = await supabase
    .from('catalogue_formations')
    .select('*, sessions_formation(id)')
    .order('intitule')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const result = (formations ?? []).map(f => ({
    ...f,
    nb_sessions: f.sessions_formation?.length ?? 0,
    sessions_formation: undefined,
  }))

  return NextResponse.json({ formations: result })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { intitule, categorie, duree, prix_standard } = body
  if (!intitule?.trim()) return NextResponse.json({ error: 'intitule requis' }, { status: 400 })

  const supabase = db()
  const { data, error } = await supabase
    .from('catalogue_formations')
    .insert({ intitule: intitule.trim(), categorie: categorie?.trim() || null, duree: duree?.trim() || '', prix_standard: prix_standard ?? 0 })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ formation: data }, { status: 201 })
}
