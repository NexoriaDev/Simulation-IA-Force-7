'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, X, Clock, Euro, ImagePlus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
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

// ─── Placeholder gradient par initiale ───────────────────────────────────────

const GRADIENTS = [
  'from-[#EBF3FB] to-[#c8ddf2]',  // bleu
  'from-[#f0fdf4] to-[#bbf7d0]',  // vert
  'from-[#fdf4ff] to-[#e9d5ff]',  // violet
  'from-[#fff7ed] to-[#fed7aa]',  // orange
  'from-[#f0f9ff] to-[#bae6fd]',  // cyan
  'from-[#fefce8] to-[#fef08a]',  // jaune
]

function gradientFor(str: string) {
  const i = str.charCodeAt(0) % GRADIENTS.length
  return GRADIENTS[i]
}

// ─── Zone d'upload image ──────────────────────────────────────────────────────

function ImageUploadZone({ file, preview, onChange }: {
  file: File | null
  preview: string | null
  onChange: (f: File | null) => void
}) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)

  const handleFiles = useCallback((files: FileList | null) => {
    const f = files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    onChange(f)
  }, [onChange])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={e => handleFiles(e.target.files)}
      />

      {preview ? (
        <div className="relative h-44 rounded-xl overflow-hidden border border-[#E5E7EB]">
          <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = '' }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors cursor-pointer border border-[#E5E7EB]"
          >
            <Trash2 size={13} className="text-red-500" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[11px] font-medium text-[#374151] shadow-sm hover:bg-white transition-colors cursor-pointer border border-[#E5E7EB]"
          >
            Changer
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
          className={cn(
            'w-full h-36 rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer',
            drag
              ? 'border-[#1267A4] bg-[#EBF3FB]'
              : 'border-[#E5E7EB] hover:border-[#1267A4]/40 hover:bg-[#F8F9FA]'
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-[#EBF3FB] flex items-center justify-center">
            <ImagePlus size={18} className="text-[#1267A4]" strokeWidth={1.75} />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-[#374151]">Cliquez ou déposez une image</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">PNG, JPG, WebP — recommandé 800×450 px</p>
          </div>
        </button>
      )}
    </div>
  )
}

// ─── Modale création ──────────────────────────────────────────────────────────

function CreationModal({ onClose, onCreated }: { onClose: () => void; onCreated: (f: FormationRow) => void }) {
  const [intitule, setIntitule]   = useState('')
  const [categorie, setCategorie] = useState('')
  const [duree, setDuree]         = useState('')
  const [prix, setPrix]           = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview]     = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)

  // Preview via FileReader
  useEffect(() => {
    if (!imageFile) { setPreview(null); return }
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(imageFile)
  }, [imageFile])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!intitule.trim()) return
    setSaving(true)
    setError(null)
    try {
      let cover_image_url: string | null = null

      if (imageFile) {
        const supabase = createClient()
        const ext  = imageFile.name.split('.').pop()
        const path = `covers/${crypto.randomUUID()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('formations')
          .upload(path, imageFile, { cacheControl: '3600', upsert: false })
        if (uploadErr) throw new Error(`Upload image : ${uploadErr.message}`)
        const { data } = supabase.storage.from('formations').getPublicUrl(path)
        cover_image_url = data.publicUrl
      }

      const res = await fetch('/api/formations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intitule, categorie, duree, prix_standard: prix ? parseFloat(prix) : 0, cover_image_url }),
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
        className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-lg mx-4"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F3F4F6]">
          <h2 className="text-sm font-semibold text-[#1F2937]">Nouvelle formation</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] text-[#9CA3AF] cursor-pointer transition-colors">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 space-y-4">
          {/* Image de couverture */}
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">Image de couverture</label>
            <ImageUploadZone file={imageFile} preview={preview} onChange={setImageFile} />
          </div>

          {/* Intitulé */}
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">Intitulé *</label>
            <input
              autoFocus
              value={intitule}
              onChange={e => setIntitule(e.target.value)}
              placeholder="ex : Excel Avancé"
              className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
              required
            />
          </div>

          {/* Catégorie */}
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

          {/* Durée + Prix */}
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

// ─── Card ─────────────────────────────────────────────────────────────────────

function FormationCard({ f, index }: { f: FormationRow; index: number }) {
  return (
    <motion.a
      href={`/formations/${f.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className="block bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#1267A4]/30 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Image / placeholder */}
      <div className="h-32 relative overflow-hidden">
        {f.cover_image_url ? (
          <img
            src={f.cover_image_url}
            alt={f.intitule}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', gradientFor(f.intitule))}>
            <BookOpen size={28} className="text-[#1267A4]/40" strokeWidth={1.5} />
          </div>
        )}
        {/* Badge sessions */}
        <span className={cn(
          'absolute top-2 right-2 text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm',
          f.nb_sessions > 0
            ? 'bg-white/90 text-green-700'
            : 'bg-white/90 text-[#9CA3AF]'
        )}>
          {f.nb_sessions} session{f.nb_sessions !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1F2937] leading-snug mb-0.5 group-hover:text-[#1267A4] transition-colors line-clamp-2">
          {f.intitule}
        </h3>

        {f.categorie && (
          <p className="text-[11px] text-[#1267A4] font-medium mb-2">{f.categorie}</p>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-[#F3F4F6] mt-2">
          {f.duree && (
            <span className="flex items-center gap-1 text-[11px] text-[#6B7280]">
              <Clock size={10} className="shrink-0" />
              {f.duree}
            </span>
          )}
          {f.prix_standard > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-[#6B7280]">
              <Euro size={10} className="shrink-0" />
              {f.prix_standard.toLocaleString('fr-FR')} €
            </span>
          )}
        </div>
      </div>
    </motion.a>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    <>
      {/* Barre d'actions */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">
          {loading ? '' : `${formations.length} formation${formations.length !== 1 ? 's' : ''} au catalogue`}
        </p>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1267A4] text-white text-sm font-medium rounded-xl hover:bg-[#0f5a94] transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={14} />
          Créer une formation
        </button>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] h-52 animate-pulse" />
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

      <AnimatePresence>
        {modal && (
          <CreationModal
            onClose={() => setModal(false)}
            onCreated={f => { setFormations(prev => [f, ...prev]); setModal(false) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
