'use client'

import { useState, useEffect, useRef, use } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Briefcase,
  Hash,
  Check,
  X,
  FileText,
  Award,
  BarChart2,
  Download,
  Send,
  Users,
  CalendarDays,
  Clock,
  MoreHorizontal,
  ClipboardList,
  PenLine,
  Sparkles,
  MessageSquare,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  STATUT_DOSSIER_CONFIG,
  STATUT_COLLECTE_CONFIG,
  FINANCEMENT_CONFIG,
  TYPE_DOCUMENT_LABELS,
  STATUT_DOCUMENT_CONFIG,
  computeMilestones,
  formatDateShort,
  formatDateTime,
  getTypeDossier,
} from '@/lib/utils/format'
import type { StatutDossier, Apprenant } from '@/lib/types'
import type { MilestoneState } from '@/lib/utils/format'
import { TimelineStepper } from '@/components/timeline/TimelineStepper'

// ─── Milestone dot ────────────────────────────────────────────────────────────

function MilestoneDot({ state, icon: Icon, label }: { state: MilestoneState; icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center',
          state === 'done'
            ? 'bg-[#16A34A]/12 text-[#16A34A]'
            : state === 'active'
              ? 'bg-[#6199C1]/12 text-[#6199C1]'
              : 'bg-[#F3F4F6] text-[#D1D5DB]'
        )}
      >
        {state === 'done' ? <Check size={13} strokeWidth={2.5} /> : <Icon size={13} strokeWidth={1.75} />}
      </div>
      <span
        className={cn(
          'text-[9px] text-center leading-tight max-w-[44px]',
          state === 'done' ? 'text-[#16A34A]' : state === 'active' ? 'text-[#6199C1] font-medium' : 'text-[#9CA3AF]'
        )}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Apprenant row ────────────────────────────────────────────────────────────

function ApprenantRow({ apprenant }: { apprenant: Apprenant }) {
  const milestones = computeMilestones(apprenant.statut)
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#FAFAFA] transition-colors rounded-lg">
      <div className="w-7 h-7 rounded-full bg-[#6199C1]/10 flex items-center justify-center shrink-0">
        <span className="text-[#6199C1] text-[11px] font-semibold">
          {apprenant.prenom[0]}{apprenant.nom[0]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1F2937] leading-tight">{apprenant.prenom} {apprenant.nom}</p>
        <p className="text-[11px] text-[#9CA3AF] leading-tight">{apprenant.fonction ?? apprenant.email}</p>
      </div>
      <div className="flex items-end gap-3 shrink-0">
        <MilestoneDot state={milestones.keypredict} icon={ClipboardList} label="Keypredict" />
        <MilestoneDot state={milestones.edusign} icon={PenLine} label="EduSign" />
        <MilestoneDot state={milestones.attestation} icon={Award} label="Attestation" />
        <MilestoneDot state={milestones.bex} icon={BarChart2} label="BEX" />
      </div>
      <div>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F8F9FA] text-[#6B7280]">
          {milestones.label}
        </span>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = ['profil', 'conversation', 'documents', 'parcours'] as const
type TabKey = (typeof TABS)[number]

const TAB_LABELS: Record<TabKey, string> = {
  profil: 'Profil',
  conversation: 'Conversation',
  documents: 'Documents',
  parcours: 'Parcours de formation',
}

// ─── ProfilTab ────────────────────────────────────────────────────────────────

function ProfilField({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={15} className="text-[#9CA3AF] mt-0.5 shrink-0" strokeWidth={1.75} />
      <div>
        <p className="text-[11px] text-[#9CA3AF] mb-0.5">{label}</p>
        <div className="text-sm text-[#1F2937]">{children}</div>
      </div>
    </div>
  )
}

function EditableField({ icon: Icon, label, value, onChange }: {
  icon: React.ElementType
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  return (
    <div className="group flex items-start gap-3">
      <Icon size={15} className="text-[#9CA3AF] mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#9CA3AF] mb-0.5">{label}</p>
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setEditing(false) }}
            className="text-sm text-[#1F2937] border-b border-[#6199C1] bg-transparent outline-none w-full pb-0.5"
          />
        ) : (
          <div className="flex items-center gap-1.5 cursor-text" onClick={() => setEditing(true)}>
            <span className="text-sm text-[#1F2937]">
              {value || <span className="text-[#D1D5DB]">—</span>}
            </span>
            <PenLine size={11} className="text-[#C4CDD8] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        )}
      </div>
    </div>
  )
}

function ProfilTab({ prospect }: { prospect: Record<string, any> }) {
  const p = prospect as any
  const formation = p.catalogue_formations as { intitule: string } | null

  const [fields, setFields] = useState({
    contact_email: p.contact_email ?? '',
    contact_telephone: p.contact_telephone ?? '',
    contact_fonction: p.contact_fonction ?? '',
    type_formation: p.type_formation ?? '',
    type_financement: p.type_financement ?? '',
    nombre_stagiaires_estime: p.nombre_stagiaires_estime?.toString() ?? '',
    siret: p.siret ?? '',
  })
  const set = (k: keyof typeof fields) => (v: string) => setFields(f => ({ ...f, [k]: v }))

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-[#F3F4F6]">
        {/* Colonne Contact */}
        <div className="p-6 space-y-5">
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Contact</p>
          <EditableField icon={Mail} label="Email" value={fields.contact_email} onChange={set('contact_email')} />
          <EditableField icon={Phone} label="Téléphone" value={fields.contact_telephone} onChange={set('contact_telephone')} />
          <EditableField icon={Briefcase} label="Fonction" value={fields.contact_fonction} onChange={set('contact_fonction')} />
        </div>

        {/* Colonne Formation & dossier */}
        <div className="p-6 space-y-5">
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Formation & dossier</p>
          {formation && (
            <ProfilField icon={Briefcase} label="Formation souhaitée">{formation.intitule}</ProfilField>
          )}
          <EditableField icon={Users} label="Type (INTER / INTRA)" value={fields.type_formation} onChange={set('type_formation')} />
          <EditableField icon={FileText} label="Financement" value={fields.type_financement} onChange={set('type_financement')} />
          <EditableField icon={Users} label="Stagiaires estimés" value={fields.nombre_stagiaires_estime} onChange={set('nombre_stagiaires_estime')} />
          <EditableField icon={Hash} label="SIRET" value={fields.siret} onChange={set('siret')} />
        </div>
      </div>
    </div>
  )
}

// ─── ConversationTab ──────────────────────────────────────────────────────────

function ConversationTab({
  conversations,
  prospect,
  onValidate,
}: {
  conversations: any[]
  prospect: any
  onValidate: (id: string) => void
}) {
  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-10 text-center">
        <MessageSquare size={32} className="mx-auto text-[#D1D5DB] mb-3" />
        <p className="text-sm text-[#9CA3AF]">Aucun échange enregistré</p>
      </div>
    )
  }

  const contactName = [prospect?.contact_prenom, prospect?.contact_nom].filter(Boolean).join(' ') || 'Contact'
  const contactInitials = [prospect?.contact_prenom?.[0], prospect?.contact_nom?.[0]].filter(Boolean).join('').toUpperCase() || '?'

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#F3F4F6] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#6199C1]/10 flex items-center justify-center">
          <span className="text-[#6199C1] text-xs font-semibold">{contactInitials}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-[#1F2937]">{contactName}</p>
          <p className="text-[11px] text-[#9CA3AF]">{prospect?.nom_entreprise}</p>
        </div>
        <span className="ml-auto text-[11px] text-[#9CA3AF]">{conversations.length} messages</span>
      </div>

      {/* Messages */}
      <div className="px-4 py-5 space-y-4 max-h-[600px] overflow-y-auto">
        {conversations.map((msg, i) => {
          const isIncoming = msg.sens === 'entrant'
          const isPending = msg.statut_validation === 'en_attente'

          if (isPending) {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.22 }}
                className="flex flex-col items-end gap-1"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles size={11} className="text-amber-500" />
                  <span className="text-[10px] font-semibold text-amber-600">Brouillon IA — en attente de validation Iliès</span>
                </div>
                <div className="max-w-[72%] rounded-2xl rounded-tr-sm border-2 border-[#FEE700] bg-amber-50/80 px-4 py-3 shadow-sm">
                  <p className="text-sm text-[#1F2937] whitespace-pre-wrap leading-relaxed">{msg.contenu}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-1.5">{formatDateTime(msg.date)}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => onValidate(msg.id)}
                    className="flex items-center gap-1.5 bg-[#FEE700] hover:bg-[#FEE700]/80 text-[#1267A4] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Check size={12} strokeWidth={2.5} />
                    Valider et envoyer
                  </button>
                  <button className="text-xs text-[#6B7280] hover:text-[#1F2937] px-3 py-1.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F8F9FA] transition-colors cursor-pointer">
                    Modifier
                  </button>
                </div>
              </motion.div>
            )
          }

          if (isIncoming) {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.22 }}
                className="flex items-end gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0 mb-0.5">
                  <span className="text-[#6B7280] text-[10px] font-semibold">{contactInitials}</span>
                </div>
                <div className="max-w-[68%]">
                  <p className="text-[10px] text-[#9CA3AF] mb-1 ml-1">{contactName}</p>
                  <div className="bg-[#F3F4F6] rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <p className="text-sm text-[#1F2937] leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] mt-1 ml-1">{formatDateTime(msg.date)}</p>
                </div>
              </motion.div>
            )
          }

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.22 }}
              className="flex items-end justify-end gap-2"
            >
              <div className="max-w-[68%]">
                <p className="text-[10px] text-[#9CA3AF] mb-1 mr-1 text-right">Force 7 — Iliès</p>
                <div className="bg-[#6199C1] rounded-2xl rounded-tr-sm px-4 py-2.5">
                  <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-1 mr-1">
                  {(msg.statut_validation === 'valide' || msg.statut_validation === 'modifie_et_valide') && (
                    <Check size={10} className="text-[#16A34A]" strokeWidth={2.5} />
                  )}
                  <p className="text-[10px] text-[#9CA3AF]">{formatDateTime(msg.date)}</p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#1267A4] flex items-center justify-center shrink-0 mb-0.5">
                <span className="text-white text-[10px] font-bold">F7</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── DocumentsTab ─────────────────────────────────────────────────────────────

function DocumentsTab({ documents }: { documents: any[] }) {
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-10 text-center">
        <FileText size={32} className="mx-auto text-[#D1D5DB] mb-3" />
        <p className="text-sm text-[#9CA3AF]">Aucun document généré</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="divide-y divide-[#F3F4F6]">
        {documents.map((doc, i) => {
          const typeLabel = TYPE_DOCUMENT_LABELS[doc.type_document as keyof typeof TYPE_DOCUMENT_LABELS] ?? doc.type_document
          const statutCfg = STATUT_DOCUMENT_CONFIG[doc.statut as keyof typeof STATUT_DOCUMENT_CONFIG]
          const url = doc.url_stockage_plateforme
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors"
            >
              <div className="p-2 rounded-lg bg-[#EFF6FF]">
                <FileText size={16} className="text-[#6199C1]" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1F2937]">{typeLabel}</p>
                <p className="text-[11px] text-[#9CA3AF]">Généré le {formatDateShort(doc.created_at)}</p>
              </div>
              <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-md', statutCfg.bg, statutCfg.text)}>
                {statutCfg.label}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {url ? (
                  <>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-[#EFF6FF] text-[#9CA3AF] hover:text-[#6199C1] transition-colors"
                      aria-label="Ouvrir"
                    >
                      <Eye size={14} />
                    </a>
                    <a
                      href={url}
                      download
                      className="p-1.5 rounded-lg hover:bg-[#EFF6FF] text-[#9CA3AF] hover:text-[#6199C1] transition-colors"
                      aria-label="Télécharger"
                    >
                      <Download size={14} />
                    </a>
                  </>
                ) : (
                  <span className="text-[10px] text-[#D1D5DB] px-2">—</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ParcoursFormationTab ─────────────────────────────────────────────────────

function ParcoursFormationTab({ prospectId, sessions }: { prospectId: string; sessions: any[] }) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-10 text-center">
        <CalendarDays size={32} className="mx-auto text-[#D1D5DB] mb-3" />
        <p className="text-sm text-[#9CA3AF]">Aucune session liée à ce dossier</p>
        <p className="text-xs text-[#9CA3AF] mt-1">La session sera créée après signature de la convention</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session, si) => {
        const formation = session.catalogue_formations as { intitule: string } | null
        const formateur = session.formateurs as { nom: string; prenom: string } | null
        const isInter = session.type_formation === 'INTER'

        if (isInter) {
          const sessionEntreprises = session.session_entreprises ?? []
          return (
            <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-violet-50 text-violet-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">INTER</span>
                      <h3 className="text-sm font-semibold text-[#1F2937]">{formation?.intitule ?? 'Formation'}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                      <span className="flex items-center gap-1"><CalendarDays size={11} />{formatDateShort(session.date_debut)} → {formatDateShort(session.date_fin)}</span>
                      {formateur && <span className="flex items-center gap-1"><Users size={11} />{formateur.prenom} {formateur.nom}</span>}
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#F8F9FA] text-[#6B7280] px-2 py-0.5 rounded-md">{session.statut_session}</span>
                </div>
              </div>
              <div className="divide-y divide-[#F8F9FA]">
                {sessionEntreprises.map((se: any) => {
                  const entreprise = se.prospects_clients as { nom_entreprise: string } | null
                  const collecteCfg = STATUT_COLLECTE_CONFIG[se.statut_collecte_infos as keyof typeof STATUT_COLLECTE_CONFIG]
                  const apprenants = se.apprenants ?? []
                  const isCurrentCompany = se.prospect_client_id === prospectId
                  return (
                    <div key={se.id} className={cn('', isCurrentCompany && 'bg-[#6199C1]/2')}>
                      <div className="px-5 py-3 flex items-center justify-between bg-[#FAFAFA] border-b border-[#F3F4F6]">
                        <div className="flex items-center gap-2">
                          <Building2 size={13} className="text-[#9CA3AF]" />
                          <p className="text-xs font-semibold text-[#1F2937]">{entreprise?.nom_entreprise ?? se.prospect_client_id}</p>
                          {isCurrentCompany && (
                            <span className="text-[9px] bg-[#6199C1]/10 text-[#6199C1] font-semibold px-1.5 py-0.5 rounded">CE DOSSIER</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={cn('w-1.5 h-1.5 rounded-full', collecteCfg.dot)} />
                          <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-md', collecteCfg.bg, collecteCfg.text)}>{collecteCfg.label}</span>
                        </div>
                      </div>
                      {apprenants.length > 0 ? (
                        <div className="py-1">
                          <div className="flex items-center gap-4 px-4 py-1.5">
                            <div className="flex-1" />
                            <div className="flex items-end gap-3 shrink-0 text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                              <span className="w-10 text-center">Keypredict</span>
                              <span className="w-10 text-center">EduSign</span>
                              <span className="w-10 text-center">Attestation</span>
                              <span className="w-10 text-center">BEX</span>
                            </div>
                            <div className="w-[100px]" />
                          </div>
                          {apprenants.map((apprenant: Apprenant) => <ApprenantRow key={apprenant.id} apprenant={apprenant} />)}
                        </div>
                      ) : (
                        <div className="px-5 py-3.5 flex items-center gap-2 text-[#9CA3AF]">
                          <Clock size={13} />
                          <p className="text-xs">En attente des informations stagiaires</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        } else {
          const apprenants = (session.session_entreprises ?? [])
            .find((se: any) => se.prospect_client_id === prospectId)?.apprenants ?? []
          return (
            <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#6199C1]/8 text-[#6199C1] text-[10px] font-semibold px-1.5 py-0.5 rounded">INTRA</span>
                      <h3 className="text-sm font-semibold text-[#1F2937]">{formation?.intitule ?? 'Formation'}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                      <span className="flex items-center gap-1"><CalendarDays size={11} />{formatDateShort(session.date_debut)} → {formatDateShort(session.date_fin)}</span>
                      {formateur && <span className="flex items-center gap-1"><Users size={11} />{formateur.prenom} {formateur.nom}</span>}
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#F8F9FA] text-[#6B7280] px-2 py-0.5 rounded-md">{session.statut_session}</span>
                </div>
              </div>
              {apprenants.length > 0 ? (
                <div className="py-1">
                  <div className="flex items-center gap-4 px-4 py-1.5">
                    <div className="flex-1" />
                    <div className="flex items-end gap-3 shrink-0 text-[9px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                      <span className="w-10 text-center">Keypredict</span>
                      <span className="w-10 text-center">EduSign</span>
                      <span className="w-10 text-center">Attestation</span>
                      <span className="w-10 text-center">BEX</span>
                    </div>
                    <div className="w-[100px]" />
                  </div>
                  {apprenants.map((apprenant: Apprenant) => <ApprenantRow key={apprenant.id} apprenant={apprenant} />)}
                </div>
              ) : (
                <div className="px-5 py-6 flex items-center gap-2 text-[#9CA3AF]">
                  <Clock size={14} />
                  <p className="text-sm">En attente des informations stagiaires</p>
                </div>
              )}
            </motion.div>
          )
        }
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FicheDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [prospect, setProspect] = useState<any>(null)
  const [convData, setConvData] = useState<any[]>([])
  const [docData, setDocData] = useState<any[]>([])
  const [parcoursData, setParcoursData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/prospect/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/conversations/${id}`).then((r) => r.json()),
      fetch(`/api/documents/${id}`).then((r) => r.json()),
      fetch(`/api/parcours/${id}`).then((r) => r.json()),
    ]).then(([prospect, convs, docs, parcours]) => {
      setProspect(prospect)
      setConvData(convs ?? [])
      setDocData(docs ?? [])
      setParcoursData(parcours ?? [])
      setLoading(false)
    })
  }, [id])

  const [activeTab, setActiveTab] = useState<TabKey>('profil')
  const [validatedMessages, setValidatedMessages] = useState<Set<string>>(new Set())

  const handleValidate = (msgId: string) => {
    setValidatedMessages((prev) => new Set([...prev, msgId]))
  }

  if (loading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <p className="text-sm text-[#9CA3AF]">Chargement…</p>
      </div>
    )
  }

  if (!prospect) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-[#1F2937]">Dossier introuvable</p>
          <Link href="/prospects" className="text-sm text-[#3B82C4] hover:underline mt-2 block">
            Retour aux prospects
          </Link>
        </div>
      </div>
    )
  }

  const p = prospect as any

  const hasPendingMessage = convData.some(
    (c) => c.statut_validation === 'en_attente' && !validatedMessages.has(c.id)
  )

  const type = getTypeDossier(p.statut)
  const typeBadgeStyle =
    type === 'Client'
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : type === 'Perdu'
        ? 'bg-red-50 text-red-600 border-red-200'
        : 'bg-gray-50 text-gray-600 border-gray-200'

  const tabBadges: Partial<Record<TabKey, number>> = {
    conversation: convData.length,
    documents: docData.length,
    parcours: parcoursData.length > 0 ? parcoursData.length : undefined,
  }

  return (
    <div className="min-h-full bg-white">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Link href="/prospects" className="flex items-center gap-1.5 hover:text-[#1F2937] transition-colors cursor-pointer">
            <ArrowLeft size={14} />
            Prospects & Clients
          </Link>
          <span>/</span>
          <span className="text-[#1F2937] font-medium truncate max-w-[200px]">{p.contact_prenom} {p.contact_nom}</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="px-8 py-6 space-y-5">
        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="px-6 pt-5 pb-4">
            {/* Nom contact + badge type */}
            <div className="flex items-start justify-between gap-4 mb-1">
              <h1 className="text-xl font-semibold text-[#1F2937] leading-tight">{p.contact_prenom} {p.contact_nom}</h1>
              <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-lg border shrink-0', typeBadgeStyle)}>
                {type}
              </span>
            </div>

            {/* Entreprise */}
            {p.nom_entreprise && (
              <p className="text-sm text-[#6B7280] mb-3">
                {p.nom_entreprise}
              </p>
            )}

            {/* Bouton email IA en attente */}
            {hasPendingMessage && (
              <button
                onClick={() => setActiveTab('conversation')}
                className="flex items-center gap-2 bg-[#FEE700] hover:bg-[#FEE700]/90 text-[#6199C1] text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer mt-2"
              >
                <Sparkles size={14} />
                Valider l'email IA en attente
              </button>
            )}
          </div>

          {/* Stepper */}
          <div className="px-6 py-4 border-t border-[#F8F9FA] bg-[#FAFAFA]">
            <TimelineStepper mode="progress" statut={p.statut} />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-1 border-b border-[#E5E7EB] mb-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab
              const badge = tabBadges[tab]
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer -mb-px',
                    isActive
                      ? 'border-[#6199C1] text-[#6199C1]'
                      : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#D1D5DB]'
                  )}
                >
                  {TAB_LABELS[tab]}
                  {badge !== undefined && badge > 0 && (
                    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none', isActive ? 'bg-[#6199C1]/10 text-[#6199C1]' : 'bg-[#F3F4F6] text-[#9CA3AF]')}>
                      {badge}
                    </span>
                  )}
                  {tab === 'conversation' && hasPendingMessage && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FEE700]" />
                  )}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'profil' && <ProfilTab prospect={prospect} />}
              {activeTab === 'conversation' && <ConversationTab conversations={convData} prospect={prospect} onValidate={handleValidate} />}
              {activeTab === 'documents' && <DocumentsTab documents={docData} />}
              {activeTab === 'parcours' && <ParcoursFormationTab prospectId={id} sessions={parcoursData} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
