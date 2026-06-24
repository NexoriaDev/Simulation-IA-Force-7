'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Plus, Clock, Euro, Users, Calendar,
  BookOpen, X, Check, Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { CatalogueFormation, TypeFormation } from '@/lib/types'

// ─── Types locaux ─────────────────────────────────────────────────────────────

type SessionRow = {
  id: string
  date_debut: string
  date_fin: string
  type_formation: TypeFormation
  plafond_apprenants: number | null
  statut_session: string
  nb_apprenants: number
  formateurs: { id: string; nom: string; prenom: string }[]
}

type FormateurDispo = { id: string; nom: string; prenom: string; disponible: boolean }

type ProspectItem = {
  id: string
  nom_entreprise: string
  contact_nom: string
  contact_prenom: string
  formation_souhaitee: string | null
}

// ─── Utils ────────────────────────────────────────────────────────────────────

const GRADIENTS = [
  'from-[#EBF3FB] to-[#c8ddf2]',
  'from-[#f0fdf4] to-[#bbf7d0]',
  'from-[#fdf4ff] to-[#e9d5ff]',
  'from-[#fff7ed] to-[#fed7aa]',
  'from-[#f0f9ff] to-[#bae6fd]',
  'from-[#fefce8] to-[#fef08a]',
]
const gradientFor = (s: string) => GRADIENTS[s.charCodeAt(0) % GRADIENTS.length]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function nbSemaines(debut: string, fin: string) {
  return Math.max(1, Math.round(
    (new Date(fin).getTime() - new Date(debut).getTime()) / (7 * 24 * 60 * 60 * 1000)
  ))
}

const STATUT_LABEL: Record<string, string> = {
  en_preparation: 'En préparation',
  planifie: 'Planifiée',
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  termine: 'Terminée',
}
const STATUT_STYLE: Record<string, string> = {
  en_cours: 'bg-green-50 text-green-700',
  terminee: 'bg-gray-100 text-[#9CA3AF]',
  termine: 'bg-gray-100 text-[#9CA3AF]',
}

// ─── CreateSessionModal ────────────────────────────────────────────────────────

function CreateSessionModal({
  formationId,
  onClose,
  onCreated,
}: {
  formationId: string
  onClose: () => void
  onCreated: (s: SessionRow) => void
}) {
  const [dateDebut, setDateDebut]       = useState('')
  const [dateFin, setDateFin]           = useState('')
  const [type, setType]                 = useState<TypeFormation>('INTER')
  const [plafond, setPlafond]           = useState('')
  const [sansPlafond, setSansPlafond]   = useState(false)
  const [selectedForms, setSelectedForms]       = useState<string[]>([])
  const [selectedProspects, setSelectedProspects] = useState<string[]>([])
  const [prospectSearch, setProspectSearch]     = useState('')
  const [prospectFilter, setProspectFilter]     = useState<'tous' | 'formation'>('tous')

  const [formateurs, setFormateurs]     = useState<FormateurDispo[]>([])
  const [prospects, setProspects]       = useState<ProspectItem[]>([])
  const [loadingForms, setLoadingForms] = useState(false)
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/prospects-data')
      .then(r => r.json())
      .then(({ prospects }) => setProspects(prospects ?? []))
  }, [])

  useEffect(() => {
    if (!dateDebut || !dateFin || dateFin < dateDebut) { setFormateurs([]); return }
    setLoadingForms(true)
    fetch(`/api/formateurs/dispo?debut=${dateDebut}&fin=${dateFin}`)
      .then(r => r.json())
      .then(({ formateurs }) => setFormateurs(formateurs ?? []))
      .finally(() => setLoadingForms(false))
  }, [dateDebut, dateFin])

  const toggleForm     = (id: string) => setSelectedForms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleProspect = (id: string) => setSelectedProspects(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const filteredProspects = prospects.filter(p => {
    if (prospectFilter === 'formation' && p.formation_souhaitee !== formationId) return false
    if (!prospectSearch) return true
    const q = prospectSearch.toLowerCase()
    return p.nom_entreprise.toLowerCase().includes(q) ||
      `${p.contact_prenom} ${p.contact_nom}`.toLowerCase().includes(q)
  })

  const sw = dateDebut && dateFin && dateFin >= dateDebut ? nbSemaines(dateDebut, dateFin) : null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!dateDebut || !dateFin) return
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/formations/${formationId}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date_debut: dateDebut, date_fin: dateFin, type_formation: type,
          plafond_apprenants: sansPlafond ? null : (plafond ? parseInt(plafond) : null),
          formateur_ids: selectedForms,
          prospect_ids: selectedProspects,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const { session } = await res.json()
      onCreated({
        ...session,
        nb_apprenants: selectedProspects.length,
        formateurs: formateurs.filter(f => selectedForms.includes(f.id)),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F3F4F6] shrink-0">
          <h2 className="text-sm font-semibold text-[#1F2937]">Nouvelle session</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] text-[#9CA3AF] cursor-pointer transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <form id="create-session" onSubmit={submit} className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-6">

            {/* Dates */}
            <section>
              <p className="text-xs font-semibold text-[#374151] mb-3">Dates</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#6B7280] mb-1.5">Date de début *</label>
                  <input
                    type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6B7280] mb-1.5">Date de fin *</label>
                  <input
                    type="date" value={dateFin} min={dateDebut || undefined} onChange={e => setDateFin(e.target.value)} required
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors"
                  />
                </div>
              </div>
              {sw !== null && (
                <p className="text-[11px] text-[#1267A4] font-medium mt-2">
                  {sw} semaine{sw > 1 ? 's' : ''}
                </p>
              )}
            </section>

            {/* Type */}
            <section>
              <p className="text-xs font-semibold text-[#374151] mb-3">Type de session</p>
              <div className="flex gap-3">
                {(['INTER', 'INTRA'] as TypeFormation[]).map(t => (
                  <button
                    key={t} type="button" onClick={() => setType(t)}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer',
                      type === t
                        ? 'bg-[#1267A4] text-white border-[#1267A4]'
                        : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#1267A4]/40 hover:text-[#1267A4]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* Plafond */}
            <section>
              <p className="text-xs font-semibold text-[#374151] mb-3">Plafond d'apprenants</p>
              <input
                type="number" min="1"
                value={sansPlafond ? '' : plafond}
                onChange={e => setPlafond(e.target.value)}
                disabled={sansPlafond}
                placeholder="ex : 12"
                className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-2"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={sansPlafond}
                  onChange={e => { setSansPlafond(e.target.checked); if (e.target.checked) setPlafond('') }}
                  className="w-3.5 h-3.5 accent-[#1267A4] cursor-pointer"
                />
                <span className="text-xs text-[#6B7280]">Pas de plafond</span>
              </label>
            </section>

            {/* Formateurs */}
            <section>
              <p className="text-xs font-semibold text-[#374151] mb-1">Formateurs</p>
              <p className="text-[11px] text-[#9CA3AF] mb-3">
                {!dateDebut || !dateFin ? 'Sélectionnez des dates pour voir les disponibilités' : 'Disponibilité calculée sur la période sélectionnée'}
              </p>
              {!dateDebut || !dateFin ? (
                <div className="rounded-xl border border-dashed border-[#E5E7EB] py-6 flex items-center justify-center">
                  <p className="text-xs text-[#9CA3AF] italic">Dates requises</p>
                </div>
              ) : loadingForms ? (
                <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] py-3">
                  <Loader2 size={12} className="animate-spin" />
                  Vérification des disponibilités…
                </div>
              ) : (
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {formateurs.map(f => (
                    <button
                      key={f.id} type="button"
                      onClick={() => f.disponible && toggleForm(f.id)}
                      disabled={!f.disponible}
                      className={cn(
                        'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-colors',
                        !f.disponible
                          ? 'border-[#E5E7EB] bg-[#F8F9FA] opacity-50 cursor-not-allowed'
                          : selectedForms.includes(f.id)
                            ? 'border-[#1267A4] bg-[#EBF3FB] cursor-pointer'
                            : 'border-[#E5E7EB] hover:border-[#1267A4]/40 cursor-pointer'
                      )}
                    >
                      <span className={cn('font-medium text-sm', selectedForms.includes(f.id) ? 'text-[#1267A4]' : 'text-[#1F2937]')}>
                        {f.prenom} {f.nom}
                      </span>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', f.disponible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                        {f.disponible ? 'Disponible' : 'Occupé'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Apprenants */}
            <section>
              <p className="text-xs font-semibold text-[#374151] mb-1">Apprenants</p>
              <p className="text-[11px] text-[#9CA3AF] mb-3">Sélectionner depuis Prospects & Clients</p>
              <div className="flex gap-2 mb-2">
                {(['tous', 'formation'] as const).map(f => (
                  <button
                    key={f} type="button" onClick={() => setProspectFilter(f)}
                    className={cn(
                      'px-3 py-1 text-[11px] font-medium rounded-full border transition-colors cursor-pointer',
                      prospectFilter === f
                        ? 'bg-[#1267A4] text-white border-[#1267A4]'
                        : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#1267A4]/40'
                    )}
                  >
                    {f === 'tous' ? 'Tous' : 'Cette formation'}
                  </button>
                ))}
              </div>
              <input
                type="text" value={prospectSearch} onChange={e => setProspectSearch(e.target.value)}
                placeholder="Rechercher par entreprise ou nom…"
                className="w-full px-3.5 py-2.5 text-sm border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#1267A4]/50 focus:ring-2 focus:ring-[#1267A4]/10 transition-colors mb-2"
              />
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {filteredProspects.length === 0 ? (
                  <p className="text-[11px] text-[#9CA3AF] italic text-center py-4">Aucun prospect</p>
                ) : (
                  filteredProspects.slice(0, 30).map(p => (
                    <button
                      key={p.id} type="button" onClick={() => toggleProspect(p.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm transition-colors cursor-pointer text-left',
                        selectedProspects.includes(p.id) ? 'border-[#1267A4] bg-[#EBF3FB]' : 'border-[#E5E7EB] hover:border-[#1267A4]/40'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1F2937] text-xs truncate">{p.contact_prenom} {p.contact_nom}</p>
                        <p className="text-[11px] text-[#9CA3AF] truncate">{p.nom_entreprise}</p>
                      </div>
                      {selectedProspects.includes(p.id) && <Check size={14} className="text-[#1267A4] shrink-0" />}
                    </button>
                  ))
                )}
              </div>
              {selectedProspects.length > 0 && (
                <p className="text-[11px] text-[#1267A4] font-medium mt-2">
                  {selectedProspects.length} apprenant{selectedProspects.length > 1 ? 's' : ''} sélectionné{selectedProspects.length > 1 ? 's' : ''}
                </p>
              )}
            </section>

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F3F4F6] shrink-0 flex gap-3">
          <button
            type="button" onClick={onClose}
            className="flex-1 py-2.5 text-sm border border-[#E5E7EB] rounded-xl text-[#6B7280] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="submit" form="create-session" disabled={saving}
            className="flex-1 py-2.5 text-sm bg-[#1267A4] text-white rounded-xl hover:bg-[#0f5a94] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer font-medium"
          >
            {saving ? 'Création…' : 'Créer la session'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [formation, setFormation] = useState<CatalogueFormation | null>(null)
  const [sessions, setSessions]   = useState<SessionRow[]>([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/formations/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(({ formation, sessions }) => { setFormation(formation); setSessions(sessions) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-7 w-56 bg-[#F3F4F6] rounded-xl" />
        <div className="h-48 bg-[#F3F4F6] rounded-2xl" />
        <div className="h-64 bg-[#F3F4F6] rounded-2xl" />
      </div>
    )
  }

  if (!formation) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium text-[#374151]">Formation introuvable</p>
        <Link href="/formations" className="text-xs text-[#1267A4] mt-2 hover:underline">
          ← Retour au catalogue
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Fil d'ariane */}
      <nav className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/formations" className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#1267A4] transition-colors">
          <ArrowLeft size={14} />
          Formations
        </Link>
        <span className="text-[#D1D5DB]">/</span>
        <span className="text-[#1F2937] font-medium truncate max-w-sm">{formation.intitule}</span>
      </nav>

      {/* En-tête formation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-8"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Cover */}
          <div className="h-48 sm:h-auto sm:w-64 shrink-0">
            {formation.cover_image_url ? (
              <img src={formation.cover_image_url} alt={formation.intitule} className="w-full h-full object-cover" />
            ) : (
              <div className={cn('w-full h-full min-h-48 bg-gradient-to-br flex items-center justify-center', gradientFor(formation.intitule))}>
                <BookOpen size={40} className="text-[#1267A4]/30" strokeWidth={1.5} />
              </div>
            )}
          </div>
          {/* Meta */}
          <div className="p-6 flex flex-col justify-center gap-3">
            {formation.categorie && (
              <span className="text-[11px] font-semibold text-[#1267A4] uppercase tracking-wide">{formation.categorie}</span>
            )}
            <h1 className="text-xl font-bold text-[#1F2937] leading-tight">{formation.intitule}</h1>
            <div className="flex flex-wrap gap-2">
              {formation.duree && (
                <span className="flex items-center gap-1.5 text-xs text-[#6B7280] bg-[#F8F9FA] px-3 py-1.5 rounded-full border border-[#E5E7EB]">
                  <Clock size={11} />{formation.duree}
                </span>
              )}
              {formation.prix_standard > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-[#6B7280] bg-[#F8F9FA] px-3 py-1.5 rounded-full border border-[#E5E7EB]">
                  <Euro size={11} />{formation.prix_standard.toLocaleString('fr-FR')} €
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-[#6B7280] bg-[#F8F9FA] px-3 py-1.5 rounded-full border border-[#E5E7EB]">
                <Calendar size={11} />{sessions.length} session{sessions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Titre section sessions + bouton */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[#1F2937]">
          Sessions{sessions.length > 0 && <span className="text-[#9CA3AF] font-normal ml-1.5">({sessions.length})</span>}
        </h2>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1267A4] text-white text-sm font-medium rounded-xl hover:bg-[#0f5a94] transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={14} />
          Créer une session
        </button>
      </div>

      {/* Liste des sessions */}
      {sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] py-16 flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EBF3FB] flex items-center justify-center mb-3">
            <Calendar size={20} className="text-[#1267A4]" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-[#374151] mb-1">Aucune session planifiée</p>
          <p className="text-xs text-[#9CA3AF] mb-5">Créez la première session pour cette formation.</p>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1267A4] text-white text-sm font-medium rounded-xl hover:bg-[#0f5a94] transition-colors cursor-pointer"
          >
            <Plus size={14} />
            Créer une session
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-[#F8F9FA]">
                {['Période', 'Type', 'Apprenants', 'Formateur(s)', 'Statut'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F8F9FA] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#1F2937]">{fmtDate(s.date_debut)}</p>
                    <p className="text-[11px] text-[#9CA3AF]">→ {fmtDate(s.date_fin)}</p>
                    <p className="text-[11px] text-[#1267A4] font-medium mt-0.5">
                      {nbSemaines(s.date_debut, s.date_fin)} sem.
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      'text-[11px] font-semibold px-2.5 py-1 rounded-full',
                      s.type_formation === 'INTER' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    )}>
                      {s.type_formation}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-[#374151]">
                      <Users size={13} className="text-[#9CA3AF]" />
                      {s.nb_apprenants}
                      {s.plafond_apprenants ? (
                        <span className="text-[#9CA3AF]">/ {s.plafond_apprenants}</span>
                      ) : (
                        <span className="text-[#9CA3AF]">/ ∞</span>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {s.formateurs.length === 0 ? (
                      <span className="text-[11px] text-[#9CA3AF] italic">Non assigné</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {s.formateurs.map(f => (
                          <span key={f.id} className="text-[11px] bg-[#EBF3FB] text-[#1267A4] px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                            {f.prenom} {f.nom}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      'text-[11px] font-medium px-2.5 py-1 rounded-full',
                      STATUT_STYLE[s.statut_session] ?? 'bg-[#EBF3FB] text-[#1267A4]'
                    )}>
                      {STATUT_LABEL[s.statut_session] ?? s.statut_session}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {modal && (
          <CreateSessionModal
            formationId={id!}
            onClose={() => setModal(false)}
            onCreated={s => { setSessions(prev => [...prev, s]); setModal(false) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
