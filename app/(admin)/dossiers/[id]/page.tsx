'use client'

import { useState, useEffect, use } from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  STATUT_DOSSIER_CONFIG,
  STATUTS_DOSSIER_ORDER,
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
                        ? 'bg-[#6199C1] border-[#6199C1] text-white shadow-[0_0_0_4px_rgba(97,153,193,0.15)]'
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
                      ? 'text-[#6199C1] font-semibold'
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

function ProfilTab({ prospect }: { prospect: Record<string, any> }) {
  const p = prospect as any
  const formation = p.catalogue_formations as { intitule: string } | null
  const financementCfg = p.type_financement
    ? FINANCEMENT_CONFIG[p.type_financement as keyof typeof FINANCEMENT_CONFIG]
    : null

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-[#F3F4F6]">
        {/* Colonne Contact */}
        <div className="p-6 space-y-5">
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Contact</p>
          {p.contact_email && (
            <ProfilField icon={Mail} label="Email">{p.contact_email}</ProfilField>
          )}
          {p.contact_telephone && (
            <ProfilField icon={Phone} label="Téléphone">{p.contact_telephone}</ProfilField>
          )}
          {p.contact_fonction && (
            <ProfilField icon={Briefcase} label="Fonction">{p.contact_fonction}</ProfilField>
          )}
          {!p.contact_email && !p.contact_telephone && !p.contact_fonction && (
            <p className="text-sm text-[#9CA3AF]">Aucune information de contact</p>
          )}
        </div>

        {/* Colonne Formation & dossier */}
        <div className="p-6 space-y-5">
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Formation & dossier</p>
          {formation && (
            <ProfilField icon={Briefcase} label="Formation souhaitée">{formation.intitule}</ProfilField>
          )}
          {p.type_formation && (
            <ProfilField icon={Users} label="Type">
              <span
                className={cn(
                  'inline-block text-[11px] font-semibold px-2 py-0.5 rounded',
                  p.type_formation === 'INTER'
                    ? 'bg-violet-50 text-violet-700'
                    : 'bg-[#6199C1]/8 text-[#6199C1]'
                )}
              >
                {p.type_formation}
              </span>
            </ProfilField>
          )}
          {financementCfg && (
            <ProfilField icon={FileText} label="Financement">
              <span className={cn('inline-block text-[11px] font-medium px-2 py-0.5 rounded-md', financementCfg.bg, financementCfg.text)}>
                {financementCfg.label}
              </span>
            </ProfilField>
          )}
          {p.nombre_stagiaires_estime && (
            <ProfilField icon={Users} label="Stagiaires estimés">
              {p.nombre_stagiaires_estime} stagiaire{p.nombre_stagiaires_estime > 1 ? 's' : ''}
            </ProfilField>
          )}
          {p.siret && (
            <ProfilField icon={Hash} label="SIRET">{p.siret}</ProfilField>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── ConversationTab ──────────────────────────────────────────────────────────

function ConversationTab({ conversations, onValidate }: { conversations: any[]; onValidate: (id: string) => void }) {
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
        const isValidated = msg.statut_validation === 'valide' || msg.statut_validation === 'modifie_et_valide'

        return (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.25 }}>
            {isPending ? (
              <div className="rounded-xl border-2 border-[#FEE700]/40 bg-amber-50/60 overflow-hidden">
                <div className="px-4 py-2.5 bg-[#FEE700]/15 border-b border-[#FEE700]/20 flex items-center gap-2">
                  <Sparkles size={13} className="text-amber-600 shrink-0" />
                  <p className="text-xs font-semibold text-amber-700">Email préparé par l'IA — en attente de validation Iliès</p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-[#9CA3AF] mb-3">{formatDateTime(msg.date)}</p>
                  <p className="text-sm text-[#1F2937] whitespace-pre-wrap leading-relaxed">{msg.contenu}</p>
                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#FEE700]/20">
                    <button
                      onClick={() => onValidate(msg.id)}
                      className="flex items-center gap-1.5 bg-[#FEE700] hover:bg-[#FEE700]/90 text-[#6199C1] text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
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
              <div className={cn('rounded-xl border overflow-hidden', isIncoming ? 'bg-[#F8F9FA] border-[#E5E7EB]' : isValidated ? 'bg-blue-50/40 border-blue-100' : 'bg-white border-[#E5E7EB]')}>
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isIncoming ? (
                        <span className="flex items-center gap-1.5 text-[11px] text-[#6B7280]"><Mail size={11} />Email entrant</span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[11px] text-[#6199C1]">
                          <Send size={11} />
                          {isValidated ? (msg.statut_validation === 'modifie_et_valide' ? 'Modifié et validé' : 'Validé et envoyé') : 'Envoyé'}
                        </span>
                      )}
                      {isValidated && (
                        <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                          {msg.statut_validation === 'modifie_et_valide' ? 'Modifié et validé' : 'Validé'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">{formatDateTime(msg.date)}</p>
                  </div>
                  <p className="text-sm text-[#1F2937] whitespace-pre-wrap leading-relaxed">{msg.contenu}</p>
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
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
              <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-md', statutCfg.bg, statutCfg.text)}>
                {statutCfg.label}
              </span>
              {doc.url_stockage_plateforme && (
                <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer" aria-label="Télécharger">
                  <Download size={14} />
                </button>
              )}
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
          <span className="text-[#1F2937] font-medium truncate max-w-[200px]">{p.nom_entreprise}</span>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="px-8 py-6 space-y-5">
        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="px-6 pt-5 pb-4">
            {/* Nom entreprise + badge type */}
            <div className="flex items-start justify-between gap-4 mb-1">
              <h1 className="text-xl font-semibold text-[#1F2937] leading-tight">{p.nom_entreprise}</h1>
              <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-lg border shrink-0', typeBadgeStyle)}>
                {type}
              </span>
            </div>

            {/* Contact */}
            {(p.contact_prenom || p.contact_nom) && (
              <p className="text-sm text-[#6B7280] mb-3">
                {p.contact_prenom} {p.contact_nom}
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
            <StatusStepper statut={p.statut} />
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
              {activeTab === 'conversation' && <ConversationTab conversations={convData} onValidate={handleValidate} />}
              {activeTab === 'documents' && <DocumentsTab documents={docData} />}
              {activeTab === 'parcours' && <ParcoursFormationTab prospectId={id} sessions={parcoursData} />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
