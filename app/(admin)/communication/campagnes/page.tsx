'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Copy, Trash2, Loader2, X, Users, Mail, Calendar, Zap, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STATUT_DOSSIER_CONFIG } from '@/lib/utils/format'
import type { StatutDossier, CampagneEmail, CritereCle, ModeEnvoiCampagne } from '@/lib/types'
import { FORMATIONS_BY_CATEGORIE, CATEGORIES, ALL_FORMATIONS } from '@/lib/data/formations-force7'

// ─── Types locaux ─────────────────────────────────────────────────────────────

interface CritereItem { cle: CritereCle; valeur: string }

interface CampagneForm {
  nom: string; objet: string; corps: string; actif: boolean
  mode_envoi: ModeEnvoiCampagne; envoyer_le: string
  criteres: CritereItem[]
}

const EMPTY: CampagneForm = {
  nom: '', objet: '', corps: '', actif: false,
  mode_envoi: 'maintenant', envoyer_le: '', criteres: [],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function api(action: string, payload: Record<string, unknown> = {}) {
  const res = await fetch('/api/campagnes-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

const statutLabel = (v: string) =>
  STATUT_DOSSIER_CONFIG[v as StatutDossier]?.label ?? v

const CRITERE_LABELS: Record<CritereCle, string> = {
  statut:         'Statut dossier',
  type_formation: 'Type de formation',
  categorie:      'Catégorie',
  formation:      'Formation',
}

// ─── MultiSelectDropdown ──────────────────────────────────────────────────────

function MultiSelectDropdown({
  options, selected, onChange, placeholder, searchable = false,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  placeholder: string
  searchable?: boolean
}) {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filtered = searchable && search
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options

  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v])

  const label = selected.length === 0
    ? placeholder
    : selected.length === 1
    ? selected[0]
    : `${selected.length} sélectionnés`

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-sm bg-white cursor-pointer hover:border-[#1267A4] transition-colors',
          open ? 'border-[#1267A4]' : 'border-gray-200'
        )}
      >
        <span className={cn('truncate', selected.length === 0 ? 'text-gray-400' : 'text-gray-900')}>
          {label}
        </span>
        <ChevronDown size={14} className={cn('shrink-0 text-gray-400 transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une formation…"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#1267A4]"
                autoFocus
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 px-4 py-3">Aucun résultat</p>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors',
                    selected.includes(opt) ? 'bg-[#EBF3FB] text-[#1267A4]' : 'hover:bg-gray-50 text-gray-700'
                  )}
                >
                  <span className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                    selected.includes(opt) ? 'bg-[#1267A4] border-[#1267A4]' : 'border-gray-300'
                  )}>
                    {selected.includes(opt) && <Check size={11} className="text-white" />}
                  </span>
                  <span className="truncate">{opt}</span>
                </button>
              ))
            )}
          </div>
          {selected.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {selected.length} sélectionné{selected.length > 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CampagnesPage() {
  const [campagnes,    setCampagnes]    = useState<CampagneEmail[]>([])
  const [statuts,      setStatuts]      = useState<string[]>([])
  const [loading,      setLoading]      = useState(true)
  const [modal,        setModal]        = useState<null | { mode: 'create' } | { mode: 'edit'; c: CampagneEmail }>(null)
  const [form,         setForm]         = useState<CampagneForm>(EMPTY)
  const [shownSelects, setShownSelects] = useState<Set<CritereCle>>(new Set())
  const [saving,       setSaving]       = useState(false)
  const [confirmDel,   setConfirmDel]   = useState<CampagneEmail | null>(null)
  const [deleting,     setDeleting]     = useState(false)
  const [nbDest,       setNbDest]       = useState<number | null>(null)
  const [counting,     setCounting]     = useState(false)
  const countTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  async function load() {
    setLoading(true)
    const res  = await fetch('/api/campagnes-email')
    const data = await res.json()
    setCampagnes(data.campagnes ?? [])
    setStatuts(data.statuts?.map((s: { valeur: string }) => s.valeur) ?? [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  // Comptage destinataires avec debounce 350ms
  useEffect(() => {
    if (!modal) return
    clearTimeout(countTimer.current)
    setCounting(true)
    countTimer.current = setTimeout(async () => {
      try {
        const { count } = await api('count', { criteres: form.criteres })
        setNbDest(count)
      } finally {
        setCounting(false)
      }
    }, 350)
    return () => clearTimeout(countTimer.current)
  }, [form.criteres, modal])

  function closeModal() {
    setModal(null)
    setShownSelects(new Set())
  }

  function openCreate() {
    setForm(EMPTY)
    setNbDest(null)
    setShownSelects(new Set())
    setModal({ mode: 'create' })
  }
  function openEdit(c: CampagneEmail) {
    setForm({
      nom: c.nom, objet: c.objet, corps: c.corps, actif: c.actif,
      mode_envoi: c.mode_envoi,
      envoyer_le: c.envoyer_le ? c.envoyer_le.slice(0, 16) : '',
      criteres: c.criteres.map(cr => ({ cle: cr.cle, valeur: cr.valeur })),
    })
    setNbDest(c.nb_destinataires)
    setShownSelects(new Set(c.criteres.map(cr => cr.cle)))
    setModal({ mode: 'edit', c })
  }

  async function save() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        envoyer_le: form.mode_envoi === 'programme' && form.envoyer_le ? form.envoyer_le : null,
      }
      if (modal?.mode === 'create') {
        await api('create', payload)
      } else if (modal?.mode === 'edit') {
        await api('update', { id: (modal as { mode: 'edit'; c: CampagneEmail }).c.id, ...payload })
      }
      closeModal()
      await load()
    } catch (err) {
      console.error('[campagnes] save error:', err)
    } finally {
      setSaving(false)
    }
  }

  async function toggle(c: CampagneEmail) {
    await api('toggle', { id: c.id, actif: !c.actif })
    await load()
  }
  async function duplicate(c: CampagneEmail) {
    await api('duplicate', { id: c.id })
    await load()
  }
  async function executeDelete() {
    if (!confirmDel) return
    setDeleting(true)
    try {
      await api('delete', { id: confirmDel.id })
      setConfirmDel(null)
      await load()
    } finally {
      setDeleting(false)
    }
  }

  // ─── Helpers ciblage ─────────────────────────────────────────────────────────

  function getSelected(cle: CritereCle): string[] {
    return form.criteres.filter(c => c.cle === cle).map(c => c.valeur)
  }
  function setSelected(cle: CritereCle, vals: string[]) {
    setForm(f => ({
      ...f,
      criteres: [...f.criteres.filter(c => c.cle !== cle), ...vals.map(valeur => ({ cle, valeur }))],
    }))
  }

  // Filtre unique (statut, type_formation)
  function addCritere(cle: 'statut' | 'type_formation') {
    if (form.criteres.some(c => c.cle === cle)) return
    const defaultValeur = cle === 'statut' ? (statuts[0] ?? '') : 'INTER'
    setForm(f => ({ ...f, criteres: [...f.criteres, { cle, valeur: defaultValeur }] }))
  }
  function removeCritere(cle: CritereCle) {
    setForm(f => ({ ...f, criteres: f.criteres.filter(c => c.cle !== cle) }))
  }
  function setCritereVal(cle: CritereCle, valeur: string) {
    setForm(f => ({ ...f, criteres: f.criteres.map(c => c.cle === cle ? { ...c, valeur } : c) }))
  }

  // Filtres multi-sélection (categorie, formation)
  function addFilter(cle: 'categorie' | 'formation') {
    setShownSelects(s => new Set([...s, cle]))
  }
  function hideFilter(cle: 'categorie' | 'formation') {
    setShownSelects(s => { const n = new Set(s); n.delete(cle); return n })
    setForm(f => ({ ...f, criteres: f.criteres.filter(c => c.cle !== cle) }))
  }

  function handleCategoriesChange(vals: string[]) {
    setForm(f => {
      const newCriteres = [
        ...f.criteres.filter(c => c.cle !== 'categorie'),
        ...vals.map(valeur => ({ cle: 'categorie' as CritereCle, valeur })),
      ]
      // Si on restreint les catégories, supprimer les formations qui n'appartiennent plus
      if (vals.length > 0) {
        const valid = new Set(vals.flatMap(c => FORMATIONS_BY_CATEGORIE[c] ?? []))
        const filteredForms = f.criteres.filter(c => c.cle === 'formation' && valid.has(c.valeur))
        return { ...f, criteres: [...newCriteres.filter(c => c.cle !== 'formation'), ...filteredForms] }
      }
      return { ...f, criteres: newCriteres }
    })
  }

  // Formations disponibles selon les catégories sélectionnées
  const selectedCats = form.criteres.filter(c => c.cle === 'categorie').map(c => c.valeur)
  const availableFormations = selectedCats.length > 0
    ? [...new Set(selectedCats.flatMap(c => FORMATIONS_BY_CATEGORIE[c] ?? []))].sort()
    : ALL_FORMATIONS

  const allFiltersActive =
    form.criteres.some(c => c.cle === 'statut') &&
    form.criteres.some(c => c.cle === 'type_formation') &&
    shownSelects.has('categorie') &&
    shownSelects.has('formation')

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Barre d'actions */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">
          {loading ? '' : `${campagnes.length} campagne${campagnes.length !== 1 ? 's' : ''}`}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1267A4] text-white text-sm font-medium hover:bg-[#0f5390] transition-colors cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          Nouvelle campagne
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Chargement…</span>
        </div>
      )}

      {/* État vide */}
      {!loading && campagnes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-gray-200 bg-white text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <Mail size={22} className="text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Aucune campagne d'emailing</p>
            <p className="text-xs text-gray-400 mt-1">Créez votre première campagne pour cibler vos prospects</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1267A4] text-white text-sm font-medium hover:bg-[#0f5390] transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            Créer une campagne
          </button>
        </div>
      )}

      {/* Liste des campagnes */}
      {!loading && campagnes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Nom', 'Statut', 'Destinataires', "Mode d'envoi", 'Créée le', ''].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campagnes.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18, delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 leading-tight">{c.nom}</p>
                    {c.objet && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{c.objet}</p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggle(c)}
                      title={c.actif ? 'Désactiver' : 'Activer'}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors cursor-pointer',
                        c.actif
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      )}
                    >
                      <span className={cn('w-1.5 h-1.5 rounded-full', c.actif ? 'bg-emerald-500' : 'bg-gray-300')} />
                      {c.actif ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Users size={13} className="text-gray-400 shrink-0" />
                      <span className="font-medium">{c.nb_destinataires}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {c.mode_envoi === 'maintenant' ? (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Zap size={12} className="text-[#6199C1] shrink-0" />
                        Immédiat
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Calendar size={12} className="text-[#6199C1] shrink-0" />
                        {c.envoyer_le
                          ? new Date(c.envoyer_le).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                          : 'Programmé'}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-400">
                    {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        title="Modifier"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1267A4] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => duplicate(c)}
                        title="Dupliquer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#1267A4] hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDel(c)}
                        title="Supprimer"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Modale création / édition ────────────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={closeModal}
            />

            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* En-tête modale */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                <h2 className="text-base font-semibold text-gray-900">
                  {modal.mode === 'create' ? 'Nouvelle campagne' : 'Modifier la campagne'}
                </h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Corps modale (scrollable) */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Nom */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Nom de la campagne
                  </label>
                  <input
                    type="text"
                    placeholder="Ex. : Relance devis non signés"
                    value={form.nom}
                    onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1267A4]/20 focus:border-[#1267A4] transition-colors"
                  />
                </div>

                {/* Objet */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Objet de l'email
                  </label>
                  <input
                    type="text"
                    placeholder="Objet qui apparaîtra dans la boîte de réception"
                    value={form.objet}
                    onChange={e => setForm(f => ({ ...f, objet: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1267A4]/20 focus:border-[#1267A4] transition-colors"
                  />
                </div>

                {/* Corps */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Corps de l'email
                  </label>
                  <textarea
                    rows={7}
                    placeholder="Rédigez votre message ici…"
                    value={form.corps}
                    onChange={e => setForm(f => ({ ...f, corps: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1267A4]/20 focus:border-[#1267A4] transition-colors resize-none"
                  />
                </div>

                {/* ─── Ciblage ─────────────────────────────────────────────────── */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Ciblage des destinataires <span className="font-normal normal-case text-gray-400">(combinés en ET)</span>
                  </label>

                  <div className="space-y-2.5">
                    {/* Filtres single-select actifs (statut, type_formation) */}
                    {form.criteres.filter(c => c.cle === 'statut' || c.cle === 'type_formation').map(cr => (
                      <div key={cr.cle} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 w-36 shrink-0">
                          {CRITERE_LABELS[cr.cle]}
                        </span>
                        <select
                          value={cr.valeur}
                          onChange={e => setCritereVal(cr.cle, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1267A4]/20 focus:border-[#1267A4] bg-white cursor-pointer"
                        >
                          {cr.cle === 'statut' && statuts.map(s => (
                            <option key={s} value={s}>{statutLabel(s)}</option>
                          ))}
                          {cr.cle === 'type_formation' && (
                            <>
                              <option value="INTER">INTER — Inter-entreprises</option>
                              <option value="INTRA">INTRA — Intra-entreprise</option>
                            </>
                          )}
                        </select>
                        <button
                          onClick={() => removeCritere(cr.cle)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}

                    {/* Filtre Catégorie (multi-select) */}
                    {shownSelects.has('categorie') && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 w-36 shrink-0">
                          {CRITERE_LABELS.categorie}
                        </span>
                        <MultiSelectDropdown
                          options={CATEGORIES}
                          selected={getSelected('categorie')}
                          onChange={handleCategoriesChange}
                          placeholder="Sélectionner des catégories…"
                        />
                        <button
                          onClick={() => hideFilter('categorie')}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    )}

                    {/* Filtre Formation (multi-select + recherche) */}
                    {shownSelects.has('formation') && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 w-36 shrink-0">
                          {CRITERE_LABELS.formation}
                        </span>
                        <MultiSelectDropdown
                          options={availableFormations}
                          selected={getSelected('formation')}
                          onChange={vals => setSelected('formation', vals)}
                          placeholder="Sélectionner des formations…"
                          searchable
                        />
                        <button
                          onClick={() => hideFilter('formation')}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    )}

                    {/* Boutons d'ajout */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {!form.criteres.some(c => c.cle === 'statut') && (
                        <button
                          type="button"
                          onClick={() => addCritere('statut')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-xs text-gray-500 hover:border-[#1267A4] hover:text-[#1267A4] transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                          {CRITERE_LABELS.statut}
                        </button>
                      )}
                      {!form.criteres.some(c => c.cle === 'type_formation') && (
                        <button
                          type="button"
                          onClick={() => addCritere('type_formation')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-xs text-gray-500 hover:border-[#1267A4] hover:text-[#1267A4] transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                          {CRITERE_LABELS.type_formation}
                        </button>
                      )}
                      {!shownSelects.has('categorie') && (
                        <button
                          type="button"
                          onClick={() => addFilter('categorie')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-xs text-gray-500 hover:border-[#1267A4] hover:text-[#1267A4] transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                          {CRITERE_LABELS.categorie}
                        </button>
                      )}
                      {!shownSelects.has('formation') && (
                        <button
                          type="button"
                          onClick={() => addFilter('formation')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-gray-300 text-xs text-gray-500 hover:border-[#1267A4] hover:text-[#1267A4] transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                          {CRITERE_LABELS.formation}
                        </button>
                      )}
                      {allFiltersActive && (
                        <span className="text-xs text-gray-400 italic self-center">Tous les filtres sont actifs</span>
                      )}
                    </div>
                  </div>

                  {/* Compteur destinataires */}
                  <div className="mt-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F8F9FA] border border-gray-100">
                    <Users size={14} className="text-[#6199C1] shrink-0" />
                    {counting ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-gray-400" />
                        <span className="text-sm text-gray-400">Calcul…</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-700">
                        <strong className="text-[#1267A4]">{nbDest ?? 0}</strong>
                        {' '}prospect{(nbDest ?? 0) !== 1 ? 's' : ''} ciblé{(nbDest ?? 0) !== 1 ? 's' : ''}
                        {form.criteres.length === 0 && !shownSelects.size && (
                          <span className="text-gray-400"> — sans filtre (tous les prospects)</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* ─── Mode d'envoi ─────────────────────────────────────────────── */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Mode d'envoi
                  </label>
                  <div className="flex gap-3">
                    {(['maintenant', 'programme'] as ModeEnvoiCampagne[]).map(mode => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, mode_envoi: mode }))}
                        className={cn(
                          'flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer',
                          form.mode_envoi === mode
                            ? 'bg-[#EBF3FB] border-[#1267A4] text-[#1267A4]'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        )}
                      >
                        {mode === 'maintenant' ? <Zap size={15} /> : <Calendar size={15} />}
                        {mode === 'maintenant' ? 'Envoyer maintenant' : 'Programmer'}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {form.mode_envoi === 'programme' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="datetime-local"
                          value={form.envoyer_le}
                          onChange={e => setForm(f => ({ ...f, envoyer_le: e.target.value }))}
                          className="mt-2.5 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1267A4]/20 focus:border-[#1267A4] transition-colors"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ─── Activation ───────────────────────────────────────────────── */}
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Campagne active</p>
                    <p className="text-xs text-gray-400 mt-0.5">Une campagne inactive ne sera jamais envoyée</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, actif: !f.actif }))}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0',
                      form.actif ? 'bg-[#1267A4]' : 'bg-gray-200'
                    )}
                  >
                    <motion.span
                      layout
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                      animate={{ left: form.actif ? '1.375rem' : '0.25rem' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* Pied de modale */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={save}
                  disabled={!form.nom.trim() || saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1267A4] text-white text-sm font-medium hover:bg-[#0f5390] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  {modal.mode === 'create' ? 'Créer la campagne' : 'Enregistrer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Modale confirmation suppression ──────────────────────────────────── */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setConfirmDel(null)}
            />
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <h3 className="text-base font-semibold text-gray-900 mb-2">Supprimer la campagne ?</h3>
              <p className="text-sm text-gray-500 mb-5">
                <strong>"{confirmDel.nom}"</strong> sera supprimée définitivement.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDel(null)}
                  className="px-5 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={executeDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {deleting && <Loader2 size={13} className="animate-spin" />}
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
