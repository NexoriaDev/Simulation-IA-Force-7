import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('prospects_clients')
    .select('*, catalogue_formations(intitule)')
    .eq('id', id)
    .single()
  if (!data) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(data)
}
