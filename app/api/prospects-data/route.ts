import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [{ data: prospects }, { count: sessions }, { count: notifs }] = await Promise.all([
    supabase
      .from('prospects_clients')
      .select('*, catalogue_formations(intitule)')
      .order('updated_at', { ascending: false }),
    supabase.from('sessions_formation').select('*', { count: 'exact', head: true }),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('lu', false),
  ])

  return NextResponse.json({
    prospects: prospects ?? [],
    sessions: sessions ?? 0,
    notifs: notifs ?? 0,
  })
}
