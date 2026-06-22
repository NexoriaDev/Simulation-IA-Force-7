import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) as ReturnType<typeof createClient> & Record<string, unknown>
}

// ─── GET : lecture des 3 tables ──────────────────────────────────────────────

export async function GET() {
  const supabase = db() as any
  const [{ data: etapes, error: e1 }, { data: templates, error: e2 }, { data: relances, error: e3 }] =
    await Promise.all([
      supabase.from('etapes_process').select('*').order('ordre'),
      supabase.from('templates_email').select('*'),
      supabase.from('relances').select('*').order('ordre'),
    ])

  if (e1 || e2 || e3) {
    console.error('[API/communication-data] erreur Supabase:', e1 ?? e2 ?? e3)
    return NextResponse.json({ error: (e1 ?? e2 ?? e3)?.message }, { status: 500 })
  }

  return NextResponse.json({
    etapes:    etapes    ?? [],
    templates: templates ?? [],
    relances:  relances  ?? [],
  })
}

// ─── POST : mutations (create / update / delete) ──────────────────────────────

export async function POST(req: Request) {
  const body  = await req.json()
  const sb    = db() as any
  const { action } = body

  try {
    // ── Supprimer une étape (cascade sur template + relances via FK) ──────────
    if (action === 'delete') {
      const { etapeId, ordre } = body
      // Décale les ordres suivants
      const { data: suivantes } = await sb.from('etapes_process').select('id, ordre').gt('ordre', ordre)
      await Promise.all(
        (suivantes ?? []).map((e: { id: string; ordre: number }) =>
          sb.from('etapes_process').update({ ordre: e.ordre - 1 }).eq('id', e.id)
        )
      )
      await sb.from('etapes_process').delete().eq('id', etapeId)
      return NextResponse.json({ ok: true })
    }

    // ── Créer une nouvelle étape + email + relances ───────────────────────────
    if (action === 'create') {
      const { newOrdre, nom, objet, corps, mode, relances: relancesData } = body
      // Décale les étapes existantes >= newOrdre
      const { data: aDecaler } = await sb.from('etapes_process').select('id, ordre').gte('ordre', newOrdre)
      await Promise.all(
        (aDecaler ?? []).map((e: { id: string; ordre: number }) =>
          sb.from('etapes_process').update({ ordre: e.ordre + 1 }).eq('id', e.id)
        )
      )
      const { data: etapeRows } = await sb.from('etapes_process').insert({ ordre: newOrdre, nom }).select()
      const newEtape = etapeRows?.[0]
      if (!newEtape) return NextResponse.json({ error: 'échec insert étape' }, { status: 500 })

      const { data: tplRows } = await sb.from('templates_email')
        .insert({ etape_id: newEtape.id, objet, corps, mode }).select()
      const newTpl = tplRows?.[0]

      if (newTpl && relancesData?.length > 0) {
        await sb.from('relances').insert(
          relancesData.map((r: { objet: string; corps: string; delai_jours: number }, i: number) => ({
            template_email_id: newTpl.id, ordre: i + 1, ...r,
          }))
        )
      }
      return NextResponse.json({ ok: true })
    }

    // ── Mettre à jour une étape existante ─────────────────────────────────────
    if (action === 'update') {
      const { etapeId, templateId, nom, objet, corps, mode, relances: relancesData } = body
      await Promise.all([
        sb.from('etapes_process').update({ nom }).eq('id', etapeId),
        sb.from('templates_email').update({ objet, corps, mode }).eq('id', templateId),
      ])
      await sb.from('relances').delete().eq('template_email_id', templateId)
      if (relancesData?.length > 0) {
        await sb.from('relances').insert(
          relancesData.map((r: { objet: string; corps: string; delai_jours: number }, i: number) => ({
            template_email_id: templateId, ordre: i + 1, ...r,
          }))
        )
      }
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'action inconnue' }, { status: 400 })
  } catch (err) {
    console.error('[API/communication-data] erreur mutation:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
