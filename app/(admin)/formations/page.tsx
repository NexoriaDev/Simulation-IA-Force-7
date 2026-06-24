'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, X, Clock, Euro, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CatalogueFormation } from '@/lib/types'

type FormationRow = CatalogueFormation & { nb_sessions: number }

const CATEGORIES = [
  'Accompagnement & Coaching',
  'Bureautique & Digital',
  'Commercial & Achats',
  'Communication',
  'Comptabilité & Gestion',
  'Développement personnel',
  'HSE',
  'Informatique',
  'Langues',
  'Management & RH',
  'Transport & Logistique',
]

// ─── Modale création ─────────────────────────────────────────────────────────

function CreationModal({ onClose, onCreated }: { onClose: () => void; onCreated: (f: FormationRow) => void }) {
  const [intitule, setIntitule]     = useState('')
  const [categorie, setCategorie]   = useState('')
  const [duree, setDuree]           = useState('')
  const [prix, setPrix]             = useState('')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!intitule.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/formations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intitule, categorie, duree, prix_standard: prix ? parseFloat(prix) : 0 }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const { formation } = await res.json()
      onCreated({ ...formation, nb_sessions: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F3F4F6]">
          <h2 className="text-sm font-semibold text-[#1F2937]">Nouvelle formation</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] text-[#9CA3AF] cursor-pointer transition-colors">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">Intitulé *</label>
            <input
              ref={inputRef}
              value={intitule}
              onChange={e => setIntitule(e.target.value)}
              placeholder="ex : Excel Avancé"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">Catégorie</label>
            <select
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors bg-white text-[#374151] cursor-pointer"
            >
              <option value="">Sans catégorie</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Durée</label>
              <input
                value={duree}
                onChange={e => setDuree(e.target.value)}
                placeholder="ex : 2 jours (14h)"
                className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1.5">Prix standard (€)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={prix}
                onChange={e => setPrix(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm border border-[#E5E7EB] rounded-xl text-[#6B7280] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !intitule.trim()}
              className="flex-1 py-2.5 text-sm bg-[#1267A4] text-white rounded-xl hover:bg-[#0f5a94] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
            >
              {saving ? 'Création…' : 'Créer la formation'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

function FormationCard({ f, index }: { f: FormationRow; index: number }) {
  return (
    <motion.a
      href={`/formations/${f.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="block bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:border-[#1267A4]/30 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#EBF3FB] flex items-center justify-center shrink-0">
          <BookOpen size={16} className="text-[#1267A4]" strokeWidth={1.75} />
        </div>
        <span className={cn(
          'text-[10px] font-semibold px-2 py-1 rounded-full',
          f.nb_sessions > 0 ? 'bg-green-50 text-green-700' : 'bg-[#F3F4F6] text-[#9CA3AF]'
        )}>
          {f.nb_sessions} session{f.nb_sessions !== 1 ? 's' : ''}
        </span>
      </div>

      <h3 className="text-sm font-semibold text-[#1F2937] leading-snug mb-1 group-hover:text-[#1267A4] transition-colors">
        {f.intitule}
      </h3>

      {f.categorie && (
        <p className="text-[11px] text-[#1267A4] font-medium mb-3">{f.categorie}</p>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F3F4F6]">
        {f.duree && (
          <span className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
            <Clock size={11} className="shrink-0" />
            {f.duree}
          </span>
        )}
        {f.prix_standard > 0 && (
          <span className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
            <Euro size={11} className="shrink-0" />
            {f.prix_standard.toLocaleString('fr-FR')} €
          </span>
        )}
      </div>
    </motion.a>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FormationsPage() {
  const [formations, setFormations] = useState<FormationRow[]>([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(false)

  useEffect(() => {
    fetch('/api/formations')
      .then(r => r.json())
      .then(({ formations }) => { setFormations(formations); setLoading(false) })
  }, [])

  return (
    <div className="min-h-full bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EBF3FB] flex items-center justify-center">
            <Layers size={15} className="text-[#1267A4]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#1F2937]">Formations</h1>
            <p className="text-[11px] text-[#9CA3AF]">{formations.length} formation{formations.length !== 1 ? 's' : ''} au catalogue</p>
          </div>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1267A4] text-white text-sm font-medium rounded-xl hover:bg-[#0f5a94] transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={14} />
          Créer une formation
        </button>
      </div>

      {/* Grid */}
      <div className="px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 h-36 animate-pulse" />
            ))}
          </div>
        ) : formations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF3FB] flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-[#1267A4]" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-[#374151] mb-1">Aucune formation au catalogue</p>
            <p className="text-xs text-[#9CA3AF] mb-5">Commencez par créer votre première formation.</p>
            <button
              onClick={() => setModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1267A4] text-white text-sm font-medium rounded-xl hover:bg-[#0f5a94] transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Créer une formation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {formations.map((f, i) => (
              <FormationCard key={f.id} f={f} index={i} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <CreationModal
            onClose={() => setModal(false)}
            onCreated={f => { setFormations(prev => [f, ...prev]); setModal(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
