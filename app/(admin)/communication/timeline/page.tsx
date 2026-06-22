'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Mail, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  STEPS,
  TL_W, TL_BAR_Y, TL_BAR_H, TL_PIN_W, TL_PIN_H, TL_ICON, TL_H,
} from '@/components/timeline/TimelineStepper'

// Canvas étendu : même géométrie que la fiche prospect + cartes email sous les labels
const PIN_TOP   = TL_BAR_Y - TL_PIN_H / 2               // 127
const ICON_TOP  = PIN_TOP - 8 - TL_ICON                  // 59
const LABEL_TOP = TL_BAR_Y + TL_PIN_H / 2 + 8            // 201
const CARD_TOP  = TL_H + 8                               // 276
const CARD_H    = 76
const COMM_H    = CARD_TOP + CARD_H + 20                  // 372

// ─── Types ───────────────────────────────────────────────────────────────────

type ModeEmail   = 'automatique' | 'a_valider'
type RelanceForm = { objet: string; corps: string; delai_jours: number }
type Relance     = RelanceForm & { id: string; ordre: number }
type Template    = { id: string; etape_id: string; objet: string; corps: string; mode: ModeEmail; relances: Relance[] }
type Etape       = { id: string; ordre: number; nom: string; branche: string | null; templates_email: Template[] }
type FormState   = { nom: string; objet: string; corps: string; mode: ModeEmail; relances: RelanceForm[]; delaiJours: number }
type ModalMode   =
  | { type: 'create'; insertAfterOrdre: number }
  | { type: 'edit'; etape: Etape }
  | { type: 'config-email'; etape: Etape }

const EMPTY_FORM: FormState = { nom: '', objet: '', corps: '', mode: 'automatique', relances: [], delaiJours: 7 }

// ─── Mutation helper ──────────────────────────────────────────────────────────

async function mutate(action: string, payload: Record<string, unknown>) {
  const res = await fetch('/api/communication-data', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ action, ...payload }),
  })
  if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TimelineEmailsPage() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const [etapes,        setEtapes]        = useState<Etape[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [modal,         setModal]         = useState<ModalMode | null>(null)
  const [form,          setForm]          = useState<FormState>(EMPTY_FORM)
  const [saving,        setSaving]        = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Etape | null>(null)
  const [deleting,      setDeleting]      = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/communication-data')
      if (!res.ok) throw new Error(`[${res.status}] ${await res.text()}`)
      const { etapes: rawE, templates: rawT, relances: rawR } = await res.json()

      setEtapes(rawE.map((e: Record<string, unknown>) => ({
        ...e,
        templates_email: rawT
          .filter((t: Record<string, unknown>) => t.etape_id === e.id)
          .map((t: Record<string, unknown>) => ({
            ...t,
            relances: rawR
              .filter((r: Record<string, unknown>) => r.template_email_id === t.id)
              .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
                (a.ordre as number) - (b.ordre as number)),
          })),
      })) as Etape[])
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  function openCreate(insertAfterOrdre: number) {
    setForm(EMPTY_FORM)
    setModal({ type: 'create', insertAfterOrdre })
  }

  function openEdit(etape: Etape) {
    const tpl = etape.templates_email[0]
    const relances = tpl?.relances.map(r => ({ objet: r.objet, corps: r.corps, delai_jours: r.delai_jours })) ?? []
    setForm({
      nom:        etape.nom,
      objet:      tpl?.objet ?? '',
      corps:      tpl?.corps ?? '',
      mode:       tpl?.mode ?? 'automatique',
      relances,
      delaiJours: relances[0]?.delai_jours ?? 7,
    })
    setModal({ type: 'edit', etape })
  }

  function openConfigEmail(etape: Etape) {
    setForm({ ...EMPTY_FORM, nom: etape.nom })
    setModal({ type: 'config-email', etape })
  }

  function handleDelete(etape: Etape) {
    setConfirmDelete(etape)
  }

  async function executeDelete() {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      await mutate('delete', { etapeId: confirmDelete.id, ordre: confirmDelete.ordre })
      setConfirmDelete(null)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    } finally {
      setDeleting(false)
    }
  }

  async function handleSave() {
    if (modal?.type === 'create'      && !form.nom.trim())  return
    if (modal?.type === 'config-email' && !form.objet.trim()) return
    if (modal?.type === 'edit'        && (!form.nom.trim() || !form.objet.trim())) return
    setSaving(true)
    try {
      if (modal?.type === 'create') {
        await mutate('create', { newOrdre: modal.insertAfterOrdre + 1, nom: form.nom })
      } else if (modal?.type === 'config-email') {
        await mutate('config-email', {
          etapeId:  modal.etape.id,
          objet:    form.objet,
          corps:    form.corps,
          mode:     form.mode,
          relances: form.relances,
        })
      } else if (modal?.type === 'edit') {
        const tpl = modal.etape.templates_email[0]
        await mutate('update', {
          etapeId:    modal.etape.id,
          templateId: tpl?.id,
          nom:        form.nom,
          objet:      form.objet,
          corps:      form.corps,
          mode:       form.mode,
          relances:   form.relances,
        })
      }
      setModal(null)
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  function setRelancesCount(n: number) {
    const c = Math.min(5, Math.max(0, n))
    setForm(f => ({
      ...f,
      relances: c > f.relances.length
        ? [...f.relances, ...Array(c - f.relances.length).fill(null).map(() => ({ objet: '', corps: '', delai_jours: f.delaiJours }))]
        : f.relances.slice(0, c),
    }))
  }

  const scroll = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * TL_W * 3, behavior: 'smooth' })

  const n        = etapes.length
  const barLeft  = TL_W / 2
  const barWidth = Math.max(0, n - 1) * TL_W

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="px-10 py-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">Timeline & Emails</h1>
          <p className="text-sm text-gray-400 mt-1">Configurez les étapes du processus et leurs emails associés</p>
        </div>
        <button
          onClick={() => openCreate(n > 0 ? etapes[n - 1].ordre : 0)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1267A4] text-white text-sm font-medium hover:bg-[#0f5390] transition-colors cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          Ajouter une étape
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Chargement…</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-mono break-all">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-6">
          <div className="relative">
            {/* Flèches scroll */}
            <button onClick={() => scroll(-1)}
              className="absolute left-0 z-20 w-8 h-8 rounded-full bg-white shadow border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#1267A4] hover:border-[#1267A4] transition-colors cursor-pointer"
              style={{ top: TL_BAR_Y - 16 }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll(1)}
              className="absolute right-0 z-20 w-8 h-8 rounded-full bg-white shadow border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#1267A4] hover:border-[#1267A4] transition-colors cursor-pointer"
              style={{ top: TL_BAR_Y - 16 }}>
              <ChevronRight size={16} />
            </button>

            {/* Zone scroll */}
            <div ref={scrollRef}
              className="overflow-x-auto mx-10 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}>
              <div className="relative select-none" style={{ width: n * TL_W, height: COMM_H }}>

                {/* Barre grise (fond) */}
                <div className="absolute rounded-full bg-[#E5E7EB]"
                  style={{ top: TL_BAR_Y - TL_BAR_H / 2, left: barLeft, width: barWidth, height: TL_BAR_H, zIndex: 1 }} />

                {/* Barre bleue (toute la longueur en mode config) */}
                <div className="absolute rounded-full bg-[#6199C1]"
                  style={{ top: TL_BAR_Y - TL_BAR_H / 2, left: barLeft, width: barWidth, height: TL_BAR_H, zIndex: 2 }} />

                {/* Boutons "+" entre étapes */}
                {etapes.slice(0, -1).map((_, i) => (
                  <button key={`plus-${i}`}
                    onClick={() => openCreate(etapes[i].ordre)}
                    title="Insérer une étape"
                    className="absolute z-[15] w-6 h-6 rounded-full bg-white border-2 border-[#6199C1] text-[#6199C1] hover:bg-[#6199C1] hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                    style={{ top: TL_BAR_Y - 12, left: (i + 1) * TL_W - 12 }}>
                    <Plus size={11} strokeWidth={2.5} />
                  </button>
                ))}

                {/* Colonnes */}
                {etapes.map((etape, i) => {
                  const tpl  = etape.templates_email[0]
                  const step = STEPS[etape.ordre - 1] ?? STEPS[0]

                  return (
                    <div key={etape.id}
                      className="absolute group"
                      style={{ left: i * TL_W, width: TL_W, top: 0, height: COMM_H, zIndex: 10 }}>

                      {/* Crayon + corbeille (survol) */}
                      <div className="absolute flex gap-1"
                        style={{ top: ICON_TOP, right: 6, zIndex: 20 }}>
                        <button onClick={() => openEdit(etape)}
                          className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#1267A4] hover:bg-[#1267A4] hover:text-white transition-colors cursor-pointer">
                          <Pencil size={10} />
                        </button>
                        <button onClick={() => handleDelete(etape)}
                          className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer">
                          <Trash2 size={10} />
                        </button>
                      </div>

                      {/* Icône illustrée */}
                      <div className="absolute flex items-center justify-center"
                        style={{ top: ICON_TOP, left: '50%', transform: 'translateX(-50%)', width: TL_ICON, height: TL_ICON }}>
                        <img src={`/images/timeline-icons/${step.icon}`} alt={etape.nom}
                          width={TL_ICON} height={TL_ICON} style={{ objectFit: 'contain' }} />
                      </div>

                      {/* Pin (tous atteints en mode config) */}
                      <div className="absolute"
                        style={{ top: PIN_TOP, left: '50%', transform: 'translateX(-50%)', width: TL_PIN_W, height: TL_PIN_H }}>
                        <img src="/images/timeline-icons/pin-atteint.png" alt=""
                          width={TL_PIN_W} height={TL_PIN_H} style={{ objectFit: 'contain' }} />
                      </div>

                      {/* Label depuis la DB */}
                      <p className="absolute text-center leading-snug font-semibold text-[#1267A4]"
                        style={{ top: LABEL_TOP, left: 6, right: 6, fontSize: 12 }}>
                        {etape.nom}
                      </p>

                      {/* Mini-carte email */}
                      {/* Bulle callout */}
                      <div className="absolute left-2 right-2" style={{ top: CARD_TOP - 14 }}>
                        {/* Pointe triangulaire (double couche = effet bordure) */}
                        <div className="flex justify-center" style={{ height: 14, position: 'relative' }}>
                          <span style={{ position: 'absolute', bottom: 0, width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderBottom: '14px solid #6199C1' }} />
                          <span style={{ position: 'absolute', bottom: 1, width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '13px solid white' }} />
                        </div>
                        <button
                          onClick={() => tpl ? openEdit(etape) : openConfigEmail(etape)}
                          className="w-full rounded-xl border border-[#6199C1]/40 bg-white hover:border-[#1267A4]/60 hover:bg-[#EEF4FB] transition-colors p-2 text-left cursor-pointer"
                          style={{ height: CARD_H }}>
                          {tpl ? (
                            <>
                              <div className="flex items-start gap-1.5 mb-1.5">
                                <Mail size={9} className="text-gray-400 shrink-0 mt-0.5" />
                                <p className="text-[9px] text-[#1267A4] leading-tight line-clamp-2 flex-1">{tpl.objet}</p>
                              </div>
                              <span className={cn(
                                'inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-semibold',
                                tpl.mode === 'automatique' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              )}>
                                {tpl.mode === 'automatique' ? 'Automatique' : 'À valider'}
                              </span>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-1.5">
                              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                                <Plus size={11} className="text-gray-400" />
                              </div>
                              <p className="text-[9px] text-gray-400 text-center leading-tight">Configurer<br/>l'email</p>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modale création / édition / config-email ───────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.45)' }}
            onClick={e => e.target === e.currentTarget && setModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-base font-bold text-[#1F2937]">
                  {modal.type === 'create' ? 'Nouvelle étape' : modal.type === 'config-email' ? "Configurer l'email" : "Modifier l'étape"}
                </h2>
                <button onClick={() => setModal(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-lg hover:bg-gray-100">
                  <X size={17} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                {/* Nom — uniquement pour create et edit */}
                {modal.type !== 'config-email' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Nom de l'étape</label>
                    <input type="text" value={form.nom}
                      onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-[#1F2937] focus:outline-none focus:border-[#1267A4] focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
                      placeholder="Ex : Devis généré" autoFocus />
                  </div>
                )}

                {/* Champs email — uniquement pour edit et config-email */}
                {modal.type !== 'create' && (
                  <>
                    {modal.type === 'edit' && (
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Email associé</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Objet</label>
                      <input type="text" value={form.objet}
                        onChange={e => setForm(f => ({ ...f, objet: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-[#1F2937] focus:outline-none focus:border-[#1267A4] focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
                        placeholder="Objet de l'email"
                        autoFocus={modal.type === 'config-email'} />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Corps</label>
                      <textarea value={form.corps}
                        onChange={e => setForm(f => ({ ...f, corps: e.target.value }))}
                        rows={8}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-mono text-[#1F2937] focus:outline-none focus:border-[#1267A4] focus:ring-2 focus:ring-[#1267A4]/10 transition-colors resize-none"
                        placeholder="Corps de l'email…" />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Mode d'envoi</label>
                      <div className="flex gap-2">
                        {(['automatique', 'a_valider'] as ModeEmail[]).map(m => (
                          <button key={m} onClick={() => setForm(f => ({ ...f, mode: m }))}
                            className={cn(
                              'flex-1 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer',
                              form.mode === m
                                ? m === 'automatique' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-orange-50 border-orange-300 text-orange-700'
                                : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                            )}>
                            {m === 'automatique' ? 'Automatique' : 'À valider'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-4 mb-3">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0">Relances</p>
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-xs text-gray-500">Nombre :</span>
                          <input type="number" min={0} max={5} value={form.relances.length}
                            onChange={e => setRelancesCount(parseInt(e.target.value) || 0)}
                            className="w-12 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[#1267A4] transition-colors" />
                        </div>
                        {form.relances.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Délai :</span>
                            <input type="number" min={1} value={form.delaiJours}
                              onChange={e => {
                                const d = parseInt(e.target.value) || 1
                                setForm(f => ({ ...f, delaiJours: d, relances: f.relances.map(r => ({ ...r, delai_jours: d })) }))
                              }}
                              className="w-12 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:border-[#1267A4] transition-colors" />
                            <span className="text-xs text-gray-500">j.</span>
                          </div>
                        )}
                      </div>
                      {form.relances.map((r, i) => (
                        <div key={i} className="mb-3 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                          <p className="text-[11px] font-semibold text-[#1267A4]">Relance {i + 1}</p>
                          <input type="text" value={r.objet} placeholder="Objet"
                            onChange={e => setForm(f => { const rl = [...f.relances]; rl[i] = { ...rl[i], objet: e.target.value }; return { ...f, relances: rl } })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#1267A4] transition-colors" />
                          <textarea value={r.corps} rows={3} placeholder="Corps…"
                            onChange={e => setForm(f => { const rl = [...f.relances]; rl[i] = { ...rl[i], corps: e.target.value }; return { ...f, relances: rl } })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#1267A4] transition-colors resize-none" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end shrink-0">
                <button onClick={() => setModal(null)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
                  Annuler
                </button>
                <button onClick={handleSave}
                  disabled={
                    saving ||
                    (modal.type === 'create'       && !form.nom.trim()) ||
                    (modal.type === 'config-email' && !form.objet.trim()) ||
                    (modal.type === 'edit'         && (!form.nom.trim() || !form.objet.trim()))
                  }
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#1267A4] text-white hover:bg-[#0f5390] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Modale confirmation suppression ──────────────────────────────────── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.45)' }}
            onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">

              <div className="px-6 pt-6 pb-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <h2 className="text-base font-bold text-[#1F2937] mb-1">Supprimer cette étape ?</h2>
                <p className="text-sm text-gray-500">
                  L'étape <span className="font-semibold text-[#1F2937]">« {confirmDelete.nom} »</span> et son email associé seront définitivement supprimés.
                </p>
              </div>

              <div className="px-6 pb-6 flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
                  Annuler
                </button>
                <button
                  onClick={executeDelete}
                  disabled={deleting}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2">
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
