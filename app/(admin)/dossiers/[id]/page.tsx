'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Briefcase,
  Check,
  X,
  AlertTriangle,
  FileText,
  FileCheck,
  Award,
  BarChart2,
  Download,
  Send,
  Users,
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  ClipboardList,
  PenLine,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getProspect,
  getCatalogueFormation,
  getFormateur,
  getSessionsForProspect,
  getSessionEntreprisesForSession,
  getApprenantsForSession,
  MOCK_CONVERSATIONS,
  MOCK_DOCUMENTS,
  MOCK_PROSPECTS,
} from '@/lib/data/mock'
import {
  STATUT_DOSSIER_CONFIG,
  STATUTS_DOSSIER_ORDER,
  STATUT_COLLECTE_CONFIG,
  FINANCEMENT_CONFIG,
  TYPE_DOCUMENT_LABELS,
  STATUT_DOCUMENT_CONFIG,
  computeMilestones,
  formatRelativeDate,
  formatDateShort,
  formatDateTime,
} from '@/lib/utils/format'
import type { StatutDossier, Apprenant } from '@/lib/types'
import type { MilestoneState } from '@/lib/utils/format'

// ─── Status stepper ───────────────────────────────────────────────────────────

function StatusStepper({ statut }: { statut: StatutDossier }) {
  const isPerdu = statut === 'prospect_perdu'
  const currentStep = STATUTS_DOSSIER_ORDER.indexOf(statut)

  return (
    <div className="relative">
      <div className="flex items-start gap-0">
        {STATUTS_DOSSIER_ORDER.map((step, i) => {
          const isCompleted = !isPerdu && currentStep > i
          const isCurrent = !isPerdu && currentStep === i

          return (
            <div key={step} className="flex items-start flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 z-10',
                    isCompleted
                      ? 'bg-[#16A34A] border-[#16A34A] text-white'
                      : isCurrent
                        ? 'bg-[#0A4D8C] border-[#0A4D8C] text-white shadow-[0_0_0_4px_rgba(10,77,140,0.12)]'
                        : 'bg-white border-[#D1D5DB] text-[#9CA3AF]'
                  )}
                >
                  {isCompleted ? (
                    <Check size={12} strokeWidth={2.5} />
                  ) : (
                    <span className="text-[11px] font-semibold">{i + 1}</span>
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-[10px] text-center leading-tight mt-2 max-w-[64px] px-1',
                    isCurrent
                      ? 'text-[#0A4D8C] font-semibold'
                      : isCompleted
                        ? 'text-[#6B7280]'
                        : 'text-[#9CA3AF]'
                  )}
                >
                  {STATUT_DOSSIER_CONFIG[step].label}
                </span>
              </div>

              {i < STATUTS_DOSSIER_ORDER.length - 1 && (
                <div className="flex-1 mt-3.5 mx-1 relative">
                  <motion.div
                    className={cn('h-0.5 w-full', isCompleted ? 'bg-[#16A34A]' : 'bg-[#E5E7EB]')}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                    style={{ transformOrigin: 'left' }}
                  />
                  {step === 'prospect_gagne' && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      → Client
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isPerdu && (
        <div className="mt-3 flex items-center gap-2 text-[#DC2626]">
          <X size={14} strokeWidth={2} />
          <span className="text-sm font-medium">Prospect perdu</span>
        </div>
      )}

      {!isPerdu && (
        <div className="mt-3 flex items-center gap-1.5 text-[#9CA3AF]">
          <X size={11} strokeWidth={1.75} />
          <span className="text-[11px]">Prospect perdu (branche alternative)</span>
        </div>
      )}
    </div>
  )
}

// ─── Milestone dot ────────────────────────────────────────────────────────────

function MilestoneDot({
  state,
  icon: Icon,
  label,
}: {
  state: MilestoneState
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center',
          state === 'done'
            ? 'bg-[#16A34A]/12 text-[#16A34A]'
            : state === 'active'
              ? 'bg-[#0A4D8C]/12 text-[#0A4D8C]'
              : 'bg-[#F3F4F6] text-[#D1D5DB]'
        )}
      >
        {state === 'done' ? (
          <Check size={13} strokeWidth={2.5} />
        ) : (
          <Icon size={13} strokeWidth={1.75} />
        )}
      </div>
      <span
        className={cn(
          'text-[9px] text-center leading-tight max-w-[44px]',
          state === 'done'
            ? 'text-[#16A34A]'
            : state === 'active'
              ? 'text-[#0A4D8C] font-medium'
              : 'text-[#9CA3AF]'
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
      <div className="w-7 h-7 rounded-full bg-[#0A4D8C]/10 flex items-center justify-center shrink-0">
        <span className="text-[#0A4D8C] text-[11px] font-semibold">
          {apprenant.prenom[0]}{apprenant.nom[0]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1F2937] leading-tight">
          {apprenant.prenom} {apprenant.nom}
        </p>
        <p className="text-[11px] text-[#9CA3AF] leading-tight">{apprenant.fonction ?? apprenant.email}</p>
      </div>
      <div className="flex items-end gap-3 shrink-0">
        <MilestoneDot state={milestones.keypredict} icon={ClipboardList} label="Keypredict" />
        <MilestoneDot state={milestones.edusign} icon={PenLine} label="EduSign" />
        <MilestoneDot state={milestones.attestation} icon={Award} label="Attestation" />
        <MilestoneDot state={milestones.bex} icon={BarChart2} label="BEX" />
      </div>
      <div>
        <span className={cn(
          'text-[10px] font-medium px-2 py-0.5 rounded-md',
          'bg-[#F8F9FA] text-[#6B7280]'
        )}>
          {milestones.label}
        </span>
      </div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = ['overview', 'conversation', 'documents', 'sessions'] as const
type TabKey = (typeof TABS)[number]

const TAB_LABELS: Record<TabKey, string> = {
  overview: "Vue d'ensemble",
  conversation: 'Conversation',
  documents: 'Documents',
  sessions: 'Sessions',
}

// ─── Tab contents ─────────────────────────────────────────────────────────────

function OverviewTab({ prospectId, statut }: { prospectId: string; statut: StatutDossier }) {
  const NEXT_ACTION: Record<StatutDossier, string> = {
    profil_cree: 'Qualifier le prospect et préparer le devis',
    devis_en_attente: 'Générer et valider le devis',
    devis_genere: 'Valider et envoyer le devis au prospect',
    devis_envoye: "Email de relance en attente de validation — à valider avant envoi",
    devis_signe: 'Générer et valider la convention de formation',
    prospect_gagne: 'Assigner un formateur pour la session',
    valide: 'Convention signée — session en cours de préparation',
    prospect_perdu: 'Dossier archivé — aucune action requise',
  }

  const conversations = MOCK_CONVERSATIONS[prospectId] ?? []
  const recentEvents = [...conversations]
    .reverse()
    .slice(0, 4)
    .map((c) => ({
      label:
        c.sens === 'entrant'
          ? `Email reçu de ${c.contenu.split('\n')[0].slice(0, 50)}…`
          : c.statut_validation === 'en_attente'
            ? 'Email IA préparé — en attente de validation'
            : 'Email envoyé',
      date: c.date,
      type: c.sens === 'entrant' ? 'in' : 'out',
      pending: c.statut_validation === 'en_attente',
    }))

  return (
    <div className="space-y-4">
      {/* Next action */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="border-l-4 border-[#F5B400] px-5 py-4">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-[#F5B400] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">
                Prochaine action
              </p>
              <p className="text-sm font-medium text-[#1F2937]">{NEXT_ACTION[statut]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent events */}
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="px-5 py-3.5 border-b border-[#F3F4F6]">
          <p className="text-sm font-semibold text-[#1F2937]">Activité récente</p>
        </div>
        <div className="divide-y divide-[#F8F9FA]">
          {recentEvents.length === 0 ? (
            <p className="px-5 py-6 text-sm text-[#9CA3AF]">Aucune activité</p>
          ) : (
            recentEvents.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 px-5 py-3"
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    ev.pending
                      ? 'bg-[#F5B400]/20 text-[#F5B400]'
                      : ev.type === 'in'
                        ? 'bg-[#F3F4F6] text-[#6B7280]'
                        : 'bg-[#0A4D8C]/10 text-[#0A4D8C]'
                  )}
                >
                  {ev.pending ? (
                    <Clock size={10} />
                  ) : ev.type === 'in' ? (
                    <Mail size={10} />
                  ) : (
                    <Send size={10} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1F2937] leading-snug">{ev.label}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{formatDateTime(ev.date)}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function ConversationTab({
  prospectId,
  onValidate,
}: {
  prospectId: string
  onValidate: (id: string) => void
}) {
  const conversations = MOCK_CONVERSATIONS[prospectId] ?? []

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-10 text-center">
        <Mail size={32} className="mx-auto text-[#D1D5DB] mb-3" />
        <p className="text-sm text-[#9CA3AF]">Aucun échange enregistré</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {conversations.map((msg, i) => {
        const isIncoming = msg.sens === 'entrant'
        const isPending = msg.statut_validation === 'en_attente'
        const isValidated =
          msg.statut_validation === 'valide' || msg.statut_validation === 'modifie_et_valide'

        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
          >
            {/* Pending AI email — special treatment */}
            {isPending ? (
              <div className="rounded-xl border-2 border-[#F5B400]/40 bg-amber-50/60 overflow-hidden">
                <div className="px-4 py-2.5 bg-[#F5B400]/15 border-b border-[#F5B400]/20 flex items-center gap-2">
                  <Sparkles size={13} className="text-amber-600 shrink-0" />
                  <p className="text-xs font-semibold text-amber-700">
                    Email préparé par l'IA — en attente de validation Iliès
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-[#9CA3AF] mb-3">{formatDateTime(msg.date)}</p>
                  <p className="text-sm text-[#1F2937] whitespace-pre-wrap leading-relaxed">
                    {msg.contenu}
                  </p>
                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#F5B400]/20">
                    <button
                      onClick={() => onValidate(msg.id)}
                      className="flex items-center gap-1.5 bg-[#F5B400] hover:bg-[#F5B400]/90 text-[#0A4D8C] text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check size={14} strokeWidth={2.5} />
                      Valider et envoyer
                    </button>
                    <button className="flex items-center gap-1.5 border border-[#E5E7EB] bg-white hover:bg-[#F8F9FA] text-[#6B7280] text-sm px-4 py-2 rounded-lg transition-colors cursor-pointer">
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'rounded-xl border overflow-hidden',
                  isIncoming
                    ? 'bg-[#F8F9FA] border-[#E5E7EB]'
                    : isValidated
                      ? 'bg-blue-50/40 border-blue-100'
                      : 'bg-white border-[#E5E7EB]'
                )}
              >
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isIncoming ? (
                        <span className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                          <Mail size={11} />
                          Email entrant
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[11px] text-[#0A4D8C]">
                          <Send size={11} />
                          {isValidated ? (
                            msg.statut_validation === 'modifie_et_valide'
                              ? 'Modifié et validé'
                              : 'Validé et envoyé'
                          ) : (
                            'Envoyé'
                          )}
                        </span>
                      )}
                      {isValidated && (
                        <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                          {msg.statut_validation === 'modifie_et_valide'
                            ? 'Modifié et validé'
                            : 'Validé'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">{formatDateTime(msg.date)}</p>
                  </div>
                  <p className="text-sm text-[#1F2937] whitespace-pre-wrap leading-relaxed">
                    {msg.contenu}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function DocumentsTab({ prospectId }: { prospectId: string }) {
  const documents = MOCK_DOCUMENTS[prospectId] ?? []

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] px-5 py-10 text-center">
        <FileText size={32} className="mx-auto text-[#D1D5DB] mb-3" />
        <p className="text-sm text-[#9CA3AF]">Aucun document généré</p>
      </div>
    )
  }

  const grouped = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    const key = doc.type_document
    if (!acc[key]) acc[key] = []
    acc[key].push(doc)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="divide-y divide-[#F3F4F6]">
        {Object.entries(grouped).map(([type, docs]) =>
          docs.map((doc, i) => {
            const typeLabel = TYPE_DOCUMENT_LABELS[doc.type_document] ?? doc.type_document
            const statutCfg = STATUT_DOCUMENT_CONFIG[doc.statut]
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="p-2 rounded-lg bg-[#F3F4F6]">
                  <FileText size={16} className="text-[#6B7280]" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F2937]">{typeLabel}</p>
                  <p className="text-[11px] text-[#9CA3AF]">Généré le {formatDateShort(doc.created_at)}</p>
                </div>
                <span
                  className={cn(
                    'text-[11px] font-medium px-2 py-0.5 rounded-md',
                    statutCfg.bg,
                    statutCfg.text
                  )}
                >
                  {statutCfg.label}
                </span>
                {doc.url_stockage_plateforme && (
                  <button
                    className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer"
                    aria-label="Télécharger"
                  >
                    <Download size={14} />
                  </button>
                )}
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

function SessionsTab({ prospectId }: { prospectId: string }) {
  const sessions = getSessionsForProspect(prospectId)

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
        const formation = getCatalogueFormation(session.formation_id)
        const formateur = getFormateur(session.formateur_id ?? '')
        const isInter = session.type_formation === 'INTER'

        if (isInter) {
          // INTER : show per-company sections
          const sessionEntreprises = getSessionEntreprisesForSession(session.id)

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
            >
              {/* Session header */}
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-violet-50 text-violet-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        INTER
                      </span>
                      <h3 className="text-sm font-semibold text-[#1F2937]">
                        {formation?.intitule ?? 'Formation'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {formatDateShort(session.date_debut)} → {formatDateShort(session.date_fin)}
                      </span>
                      {formateur && (
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {formateur.prenom} {formateur.nom}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#F8F9FA] text-[#6B7280] px-2 py-0.5 rounded-md">
                    {session.statut_session}
                  </span>
                </div>
              </div>

              {/* Per-company sections */}
              <div className="divide-y divide-[#F8F9FA]">
                {sessionEntreprises.map((se) => {
                  const entreprise = MOCK_PROSPECTS.find((p) => p.id === se.prospect_client_id)
                  const collecteCfg = STATUT_COLLECTE_CONFIG[se.statut_collecte_infos]
                  const apprenants = getApprenantsForSession(session.id, se.prospect_client_id)
                  const isCurrentCompany = se.prospect_client_id === prospectId

                  return (
                    <div key={se.id} className={cn('', isCurrentCompany && 'bg-[#0A4D8C]/2')}>
                      {/* Company sub-header */}
                      <div className="px-5 py-3 flex items-center justify-between bg-[#FAFAFA] border-b border-[#F3F4F6]">
                        <div className="flex items-center gap-2">
                          <Building2 size={13} className="text-[#9CA3AF]" />
                          <p className="text-xs font-semibold text-[#1F2937]">
                            {entreprise?.nom_entreprise ?? se.prospect_client_id}
                          </p>
                          {isCurrentCompany && (
                            <span className="text-[9px] bg-[#0A4D8C]/10 text-[#0A4D8C] font-semibold px-1.5 py-0.5 rounded">
                              CE DOSSIER
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              collecteCfg.dot
                            )}
                          />
                          <span
                            className={cn(
                              'text-[11px] font-medium px-2 py-0.5 rounded-md',
                              collecteCfg.bg,
                              collecteCfg.text
                            )}
                          >
                            {collecteCfg.label}
                          </span>
                        </div>
                      </div>

                      {/* Apprenants */}
                      {apprenants.length > 0 ? (
                        <div className="py-1">
                          {/* Column headers */}
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
                          {apprenants.map((apprenant) => (
                            <ApprenantRow key={apprenant.id} apprenant={apprenant} />
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-3.5 flex items-center gap-2 text-[#9CA3AF]">
                          <Clock size={13} />
                          <p className="text-xs">
                            En attente des informations stagiaires
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        } else {
          // INTRA : single company, show apprenants directly
          const apprenants = getApprenantsForSession(session.id, prospectId)

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.1 }}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
            >
              {/* Session header */}
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#0A4D8C]/8 text-[#0A4D8C] text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        INTRA
                      </span>
                      <h3 className="text-sm font-semibold text-[#1F2937]">
                        {formation?.intitule ?? 'Formation'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={11} />
                        {formatDateShort(session.date_debut)} → {formatDateShort(session.date_fin)}
                      </span>
                      {formateur && (
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {formateur.prenom} {formateur.nom}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#F8F9FA] text-[#6B7280] px-2 py-0.5 rounded-md">
                    {session.statut_session}
                  </span>
                </div>
              </div>

              {/* Apprenants */}
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
                  {apprenants.map((apprenant) => (
                    <ApprenantRow key={apprenant.id} apprenant={apprenant} />
                  ))}
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
  const prospect = getProspect(id)

  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [validatedMessages, setValidatedMessages] = useState<Set<string>>(new Set())

  const handleValidate = (msgId: string) => {
    setValidatedMessages((prev) => new Set([...prev, msgId]))
  }

  if (!prospect) {
    return (
      <div className="min-h-full bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-[#1F2937]">Dossier introuvable</p>
          <Link href="/dashboard" className="text-sm text-[#3B82C4] hover:underline mt-2 block">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  const formation = getCatalogueFormation(prospect.formation_souhaitee ?? '')
  const statutCfg = STATUT_DOSSIER_CONFIG[prospect.statut]
  const financementCfg = FINANCEMENT_CONFIG[prospect.type_financement]

  const conversations = MOCK_CONVERSATIONS[id] ?? []
  const hasPendingMessage = conversations.some(
    (c) => c.statut_validation === 'en_attente' && !validatedMessages.has(c.id)
  )
  const sessionsCount = getSessionsForProspect(id).length

  // Tab badges
  const tabBadges: Partial<Record<TabKey, number>> = {
    conversation: conversations.length,
    documents: (MOCK_DOCUMENTS[id] ?? []).length,
    sessions: sessionsCount > 0 ? sessionsCount : undefined,
  }

  return (
    <div className="min-h-full bg-[#F8F9FA]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 hover:text-[#1F2937] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Tableau de bord
          </Link>
          <span>/</span>
          <span className="text-[#1F2937] font-medium truncate max-w-[200px]">
            {prospect.nom_entreprise}
          </span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="px-8 py-6 max-w-5xl mx-auto space-y-5">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
        >
          <div className="px-6 pt-5 pb-4">
            {/* Name + status */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h1 className="text-xl font-semibold text-[#1F2937] leading-tight">
                  {prospect.nom_entreprise}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-[13px] text-[#6B7280]">
                  {prospect.contact_prenom && (
                    <span>
                      {prospect.contact_prenom} {prospect.contact_nom}
                    </span>
                  )}
                  {prospect.contact_fonction && (
                    <>
                      <span className="text-[#D1D5DB]">·</span>
                      <span>{prospect.contact_fonction}</span>
                    </>
                  )}
                  {prospect.contact_email && (
                    <>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="flex items-center gap-1">
                        <Mail size={11} />
                        {prospect.contact_email}
                      </span>
                    </>
                  )}
                  {prospect.contact_telephone && (
                    <>
                      <span className="text-[#D1D5DB]">·</span>
                      <span className="flex items-center gap-1">
                        <Phone size={11} />
                        {prospect.contact_telephone}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium border',
                    statutCfg.bg,
                    statutCfg.text,
                    statutCfg.border
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  {statutCfg.label}
                </span>
              </div>
            </div>

            {/* Metadata row */}
            <div className="flex items-center gap-4 text-[12px] text-[#6B7280] mb-4">
              {formation && (
                <span className="flex items-center gap-1.5">
                  <Briefcase size={12} />
                  {formation.intitule}
                </span>
              )}
              {prospect.type_formation && (
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded',
                    prospect.type_formation === 'INTER'
                      ? 'bg-violet-50 text-violet-700'
                      : 'bg-[#0A4D8C]/8 text-[#0A4D8C]'
                  )}
                >
                  {prospect.type_formation}
                </span>
              )}
              {financementCfg && (
                <span
                  className={cn('text-[11px] font-medium px-2 py-0.5 rounded-md', financementCfg.bg, financementCfg.text)}
                >
                  {financementCfg.label}
                </span>
              )}
              {prospect.nombre_stagiaires_estime && (
                <span className="flex items-center gap-1.5">
                  <Users size={12} />
                  {prospect.nombre_stagiaires_estime} stagiaire
                  {prospect.nombre_stagiaires_estime > 1 ? 's' : ''} estimé
                  {prospect.nombre_stagiaires_estime > 1 ? 's' : ''}
                </span>
              )}
              {prospect.siret && (
                <span className="text-[#9CA3AF]">SIRET {prospect.siret}</span>
              )}
            </div>

            {/* Action buttons */}
            {hasPendingMessage && (
              <button
                onClick={() => setActiveTab('conversation')}
                className="flex items-center gap-2 bg-[#F5B400] hover:bg-[#F5B400]/90 text-[#0A4D8C] text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles size={14} />
                Valider l'email IA en attente
              </button>
            )}
          </div>

          {/* Stepper */}
          <div className="px-6 py-4 border-t border-[#F8F9FA] bg-[#FAFAFA]">
            <StatusStepper statut={prospect.statut} />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
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
                      ? 'border-[#0A4D8C] text-[#0A4D8C]'
                      : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#D1D5DB]'
                  )}
                >
                  {TAB_LABELS[tab]}
                  {badge !== undefined && badge > 0 && (
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none',
                        isActive
                          ? 'bg-[#0A4D8C]/10 text-[#0A4D8C]'
                          : 'bg-[#F3F4F6] text-[#9CA3AF]'
                      )}
                    >
                      {badge}
                    </span>
                  )}
                  {tab === 'conversation' && hasPendingMessage && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B400]" />
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
              {activeTab === 'overview' && (
                <OverviewTab prospectId={id} statut={prospect.statut} />
              )}
              {activeTab === 'conversation' && (
                <ConversationTab
                  prospectId={id}
                  onValidate={handleValidate}
                />
              )}
              {activeTab === 'documents' && <DocumentsTab prospectId={id} />}
              {activeTab === 'sessions' && <SessionsTab prospectId={id} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
