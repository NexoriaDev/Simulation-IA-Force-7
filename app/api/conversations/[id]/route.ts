import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('historique_conversations')
    .select('*')
    .eq('prospect_client_id', id)
    .order('date', { ascending: true })
  return NextResponse.json(data ?? [])
}
