import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { FORMATIONS_BY_CATEGORIE } from '@/lib/data/formations-force7'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) as any
}

// Logique : OR au sein d'un même cle, ET entre cles différents.
// 'categorie' → résout les noms de formations depuis les données statiques.
// 'formation' → cherche les IDs correspondants dans catalogue_formations.
async function computeCount(sb: any, criteres: { cle: string; valeur: string }[]): Promise<number> {
  const grouped: Record<string, string[]> = {}
  for (const cr of criteres) {
    if (!grouped[cr.cle]) grouped[cr.cle] = []
    grouped[cr.cle].push(cr.valeur)
  }

  let query = sb.from('prospects_clients').select('id', { count: 'exact', head: true })

  if (grouped.statut?.length)         query = query.in('statut', grouped.statut)
  if (grouped.type_formation?.length) query = query.in('type_formation', grouped.type_formation)

  // Résolution des noms de formations → IDs
  const selectedFormations = grouped.formation ?? []
  const selectedCategories = grouped.categorie ?? []

  let formationNames: string[] = []
  if (selectedFormations.length > 0) {
    formationNames = selectedFormations
  } else if (selectedCategories.length > 0) {
    formationNames = [...new Set(selectedCategories.flatMap(c => FORMATIONS_BY_CATEGORIE[c] ?? []))]
  }

  if (formationNames.length > 0) {
    const { data: frmns } = await sb.from('catalogue_formations')
      .select('id').in('intitule', formationNames)
    const ids = (frmns ?? []).map((f: { id: string }) => f.id)
    if (ids.length === 0) return 0
    query = query.in('formation_souhaitee', ids)
  }

  const { count } = await query
  return count ?? 0
}

// ─── GET : liste des campagnes + métadonnées de ciblage ──────────────────────

export async function GET() {
  const sb = db()

  const [
    { data: campagnes, error: e1 },
    { data: criteres,  error: e2 },
    { data: statuts,   error: e3 },
  ] = await Promise.all([
    sb.from('campagnes_email').select('*').order('created_at', { ascending: false }),
    sb.from('campagnes_email_criteres').select('*'),
    sb.rpc('get_statut_dossier_values'),
  ])

  if (e1 || e2 || e3) {
    const err = e1 ?? e2 ?? e3
    console.error('[API/campagnes-email] GET error:', err)
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }

  const campagnesWithCount = await Promise.all(
    (campagnes ?? []).map(async (c: Record<string, unknown>) => {
      const cc = (criteres ?? []).filter((cr: Record<string, unknown>) => cr.campagne_id === c.id)
      const nb_destinataires = await computeCount(sb, cc as { cle: string; valeur: string }[])
      return { ...c, criteres: cc, nb_destinataires }
    })
  )

  return NextResponse.json({ campagnes: campagnesWithCount, statuts: statuts ?? [] })
}

// ─── POST : mutations ────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.json()
  const sb   = db()
  const { action } = body

  try {
    if (action === 'create') {
      const { nom, objet, corps, actif, mode_envoi, envoyer_le, criteres } = body
      const { data: rows } = await sb.from('campagnes_email')
        .insert({ nom, objet, corps, actif, mode_envoi, envoyer_le }).select()
      const campagne = rows?.[0]
      if (!campagne) return NextResponse.json({ error: 'échec insert campagne' }, { status: 500 })
      if (criteres?.length > 0) {
        await sb.from('campagnes_email_criteres').insert(
          criteres.map((c: { cle: string; valeur: string }) =>
            ({ campagne_id: campagne.id, cle: c.cle, valeur: c.valeur })
          )
        )
      }
      return NextResponse.json({ ok: true })
    }

    if (action === 'update') {
      const { id, nom, objet, corps, actif, mode_envoi, envoyer_le, criteres } = body
      await sb.from('campagnes_email').update({ nom, objet, corps, actif, mode_envoi, envoyer_le }).eq('id', id)
      await sb.from('campagnes_email_criteres').delete().eq('campagne_id', id)
      if (criteres?.length > 0) {
        await sb.from('campagnes_email_criteres').insert(
          criteres.map((c: { cle: string; valeur: string }) =>
            ({ campagne_id: id, cle: c.cle, valeur: c.valeur })
          )
        )
      }
      return NextResponse.json({ ok: true })
    }

    if (action === 'delete') {
      await sb.from('campagnes_email').delete().eq('id', body.id)
      return NextResponse.json({ ok: true })
    }

    if (action === 'toggle') {
      await sb.from('campagnes_email').update({ actif: body.actif }).eq('id', body.id)
      return NextResponse.json({ ok: true })
    }

    if (action === 'duplicate') {
      const { data: src, error } = await sb.from('campagnes_email').select('*').eq('id', body.id).single()
      if (error || !src) return NextResponse.json({ error: 'campagne introuvable' }, { status: 404 })
      const { data: newRows } = await sb.from('campagnes_email')
        .insert({ nom: `${src.nom} (copie)`, objet: src.objet, corps: src.corps, actif: false, mode_envoi: src.mode_envoi, envoyer_le: src.envoyer_le })
        .select()
      const newCampagne = newRows?.[0]
      if (!newCampagne) return NextResponse.json({ error: 'échec duplication' }, { status: 500 })
      const { data: srcCriteres } = await sb.from('campagnes_email_criteres').select('*').eq('campagne_id', body.id)
      if (srcCriteres?.length > 0) {
        await sb.from('campagnes_email_criteres').insert(
          srcCriteres.map((c: { cle: string; valeur: string }) =>
            ({ campagne_id: newCampagne.id, cle: c.cle, valeur: c.valeur })
          )
        )
      }
      return NextResponse.json({ ok: true })
    }

    if (action === 'count') {
      const count = await computeCount(sb, body.criteres ?? [])
      return NextResponse.json({ count })
    }

    return NextResponse.json({ error: 'action inconnue' }, { status: 400 })
  } catch (err) {
    console.error('[API/campagnes-email] POST error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
