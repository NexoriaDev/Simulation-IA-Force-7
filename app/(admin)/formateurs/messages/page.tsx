'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils/format'

type Sens = 'entrant' | 'sortant'
type Msg  = { id: string; sens: Sens; contenu: string; date: string }
type Conv = {
  id: string
  formateur: { id: string; nom: string; prenom: string }
  sujet: string
  messages: Msg[]
}

const TODAY_D     = new Date().toDateString()
const YESTERDAY_D = new Date(Date.now() - 86_400_000).toDateString()

function fmtConvDate(iso: string) {
  const d = new Date(iso)
  if (d.toDateString() === TODAY_D)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === YESTERDAY_D) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function initiales(prenom: string, nom: string) {
  return ((prenom[0] ?? '') + (nom[0] ?? '')).toUpperCase()
}

function lastMsg(conv: Conv) {
  return conv.messages[conv.messages.length - 1]
}

const CONVS: Conv[] = [
  // ── 1 ────────────────────────────────────────────────────────────────────
  {
    id: 'c1',
    formateur: { id: 'f1', nom: 'Vaillant', prenom: 'Marc' },
    sujet: 'Préparation session HSE — 7 juillet',
    messages: [
      { id: 'm1', sens: 'entrant', contenu: "Bonjour, je voulais confirmer les modalités logistiques pour la session HSE du 7 juillet. Quel est le lieu exact ?", date: '2026-06-18T10:00:00Z' },
      { id: 'm2', sens: 'sortant', contenu: "Bonjour Marc, la session se tiendra dans les locaux de Chantiers Maritimes de Normandie, salle R2. Je vous envoie le plan d'accès en début de semaine prochaine.", date: '2026-06-18T14:30:00Z' },
      { id: 'm3', sens: 'entrant', contenu: "Parfait, merci. Auriez-vous des informations sur le groupe ? Combien de participants et quels sont leurs profils ?", date: '2026-06-20T09:15:00Z' },
      { id: 'm4', sens: 'entrant', contenu: "Bonjour, petite relance — avez-vous des informations sur les participants ?", date: '2026-06-23T08:45:00Z' },
    ],
  },
  // ── 2 ────────────────────────────────────────────────────────────────────
  {
    id: 'c4',
    formateur: { id: 'f4', nom: 'Bernard', prenom: 'Sophie' },
    sujet: 'Première session — Développement personnel',
    messages: [
      { id: 'm12', sens: 'sortant', contenu: "Bonjour Sophie, nous avons planifié une première mission pour vous : Développement personnel, le 8 septembre. Êtes-vous disponible ?", date: '2026-06-22T09:00:00Z' },
      { id: 'm13', sens: 'entrant', contenu: "Bonjour Iliès, oui tout à fait, le 8 septembre me convient parfaitement. Merci pour cette première opportunité !", date: '2026-06-22T14:30:00Z' },
    ],
  },
  // ── 3 ────────────────────────────────────────────────────────────────────
  {
    id: 'c5',
    formateur: { id: 'f5', nom: 'Nguyen', prenom: 'Paul' },
    sujet: 'Session Anglais professionnel — disponibilités octobre',
    messages: [
      { id: 'n1', sens: 'sortant', contenu: "Bonjour Paul, nous avons un client qui souhaite une session Anglais professionnel en octobre. Seriez-vous disponible sur la 2e ou 3e semaine ?", date: '2026-06-21T09:00:00Z' },
      { id: 'n2', sens: 'entrant', contenu: "Bonjour Iliès, oui, la semaine du 12 octobre me convient. Pouvez-vous m'envoyer le niveau des participants et la durée prévue ?", date: '2026-06-21T14:15:00Z' },
    ],
  },
  // ── 4 ────────────────────────────────────────────────────────────────────
  {
    id: 'c6',
    formateur: { id: 'f1', nom: 'Vaillant', prenom: 'Marc' },
    sujet: 'Matériel pédagogique — session Transport septembre',
    messages: [
      { id: 'v1', sens: 'sortant', contenu: "Bonjour Marc, pour la session Transport de septembre, avez-vous besoin de matériel particulier ? Véhicule, équipements de sécurité ?", date: '2026-06-17T11:00:00Z' },
      { id: 'v2', sens: 'entrant', contenu: "Bonjour, oui — un vidéoprojecteur et une salle avec espace dégagé pour les exercices pratiques. Un accès à un véhicule serait un plus.", date: '2026-06-19T08:30:00Z' },
    ],
  },
  // ── 5 ────────────────────────────────────────────────────────────────────
  {
    id: 'c7',
    formateur: { id: 'f2', nom: 'Chevalier', prenom: 'Nathalie' },
    sujet: 'Salle de formation — session 21 juillet',
    messages: [
      { id: 'ch1', sens: 'entrant', contenu: "Bonjour, pourriez-vous me confirmer le lieu de la session du 21 juillet ? La salle dispose-t-elle d'un paperboard et d'un vidéoprojecteur ?", date: '2026-06-15T10:00:00Z' },
      { id: 'ch2', sens: 'sortant', contenu: "Bonjour Nathalie, la session se tiendra salle B2 au centre de formation de Gonfreville. Paperboard et vidéoprojecteur disponibles, aucun souci.", date: '2026-06-16T14:00:00Z' },
      { id: 'ch3', sens: 'entrant', contenu: "Parfait, merci pour la confirmation !", date: '2026-06-17T09:00:00Z' },
    ],
  },
  // ── 6 ────────────────────────────────────────────────────────────────────
  {
    id: 'c3',
    formateur: { id: 'f3', nom: 'Amara', prenom: 'Karim' },
    sujet: 'Report session Bureautique / IA — août',
    messages: [
      { id: 'm9',  sens: 'entrant', contenu: "Bonjour, suite à un imprévu, je ne serai pas disponible le 4 août. Est-il possible de reporter la session Bureautique / IA ?", date: '2026-06-10T14:00:00Z' },
      { id: 'm10', sens: 'sortant', contenu: "Bonjour Karim, je comprends. Seriez-vous disponible sur la semaine du 18 août ?", date: '2026-06-11T10:00:00Z' },
      { id: 'm11', sens: 'entrant', contenu: "La semaine du 18 août me conviendrait, le 19 ou 20 de préférence.", date: '2026-06-12T16:00:00Z' },
    ],
  },
  // ── 7 ────────────────────────────────────────────────────────────────────
  {
    id: 'c8',
    formateur: { id: 'f3', nom: 'Amara', prenom: 'Karim' },
    sujet: 'Accès à la plateforme e-learning',
    messages: [
      { id: 'a1', sens: 'entrant', contenu: "Bonjour, je n'arrive pas à me connecter à la plateforme e-learning pour accéder aux ressources de la session de juillet. Mon identifiant ne fonctionne pas.", date: '2026-06-07T14:30:00Z' },
      { id: 'a2', sens: 'sortant', contenu: "Bonjour Karim, désolé pour le désagrément. J'ai réinitialisé votre accès. Vous recevrez un email avec un nouveau lien de connexion dans quelques minutes.", date: '2026-06-08T09:00:00Z' },
    ],
  },
  // ── 8 ────────────────────────────────────────────────────────────────────
  {
    id: 'c9',
    formateur: { id: 'f6', nom: 'Renard', prenom: 'Thomas' },
    sujet: 'Première prise de contact — Excel avancé',
    messages: [
      { id: 'r1', sens: 'sortant', contenu: "Bonjour Thomas, j'ai eu vos coordonnées via notre réseau. Nous cherchons un formateur pour des sessions Excel avancé. Seriez-vous intéressé ?", date: '2026-06-02T10:00:00Z' },
      { id: 'r2', sens: 'entrant', contenu: "Bonjour Iliès, oui tout à fait ! J'ai 8 ans d'expérience en formation bureautique. Je serais ravi d'en discuter. Quels sont les profils des participants ?", date: '2026-06-03T16:30:00Z' },
    ],
  },
  // ── 9 ────────────────────────────────────────────────────────────────────
  {
    id: 'c10',
    formateur: { id: 'f4', nom: 'Bernard', prenom: 'Sophie' },
    sujet: 'Planning prévisionnel — automne 2026',
    messages: [
      { id: 'b1', sens: 'sortant', contenu: "Bonjour Sophie, je prépare le planning pour l'automne. Pourriez-vous me donner vos disponibilités entre septembre et novembre 2026 ?", date: '2026-05-28T11:00:00Z' },
      { id: 'b2', sens: 'entrant', contenu: "Bonjour Iliès, je suis disponible toutes les semaines sauf la semaine du 19 octobre. N'hésitez pas à me proposer des sessions.", date: '2026-05-29T14:00:00Z' },
      { id: 'b3', sens: 'sortant', contenu: "Merci Sophie, je prends note. Je reviens vers vous dès que les dossiers sont confirmés.", date: '2026-05-30T09:30:00Z' },
    ],
  },
  // ── 10 ───────────────────────────────────────────────────────────────────
  {
    id: 'c2',
    formateur: { id: 'f2', nom: 'Chevalier', prenom: 'Nathalie' },
    sujet: 'Supports de formation — Management juillet',
    messages: [
      { id: 'm5', sens: 'entrant', contenu: "Bonjour, les supports pour la session Management du 21 juillet sont-ils disponibles sur la plateforme OneDrive ?", date: '2026-05-20T11:00:00Z' },
      { id: 'm6', sens: 'sortant', contenu: "Bonjour Nathalie, oui, je viens de les déposer dans votre espace personnel. Vous devriez y avoir accès immédiatement.", date: '2026-05-21T09:30:00Z' },
      { id: 'm7', sens: 'entrant', contenu: "Reçu, merci beaucoup !", date: '2026-05-21T15:00:00Z' },
      { id: 'm8', sens: 'sortant', contenu: "Parfait ! N'hésitez pas si vous avez des questions sur le contenu.", date: '2026-05-21T15:05:00Z' },
    ],
  },
]

export default function MessagesPage() {
  const [convs, setConvs]           = useState<Conv[]>(CONVS)
  const [selectedId, setSelectedId] = useState<string>(CONVS[0].id)
  const [query, setQuery]           = useState('')
  const [draft, setDraft]           = useState('')
  const bottomRef                   = useRef<HTMLDivElement>(null)

  const filtered = convs.filter(c =>
    query === '' ||
    `${c.formateur.prenom} ${c.formateur.nom}`.toLowerCase().includes(query.toLowerCase()) ||
    c.sujet.toLowerCase().includes(query.toLowerCase())
  )
  const selected = convs.find(c => c.id === selectedId) ?? convs[0]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, convs])

  function send() {
    const txt = draft.trim()
    if (!txt) return
    setConvs(cs => cs.map(c => c.id !== selectedId ? c : {
      ...c,
      messages: [...c.messages, {
        id: `m-${Date.now()}`, sens: 'sortant', contenu: txt,
        date: new Date().toISOString(),
      }],
    }))
    setDraft('')
  }

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[560px] rounded-2xl border border-[#6199C1]/25 overflow-hidden shadow-sm bg-white">

      {/* ── Colonne gauche ── */}
      <div className="w-[290px] shrink-0 border-r border-[#F3F4F6] flex flex-col">

        {/* Recherche */}
        <div className="p-3 border-b border-[#F3F4F6]">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm text-[#1F2937] placeholder-[#9CA3AF] bg-[#F8F9FA] border border-transparent rounded-lg focus:outline-none focus:border-[#1267A4]/30 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F9FAFB]">
          {filtered.length === 0 && (
            <p className="text-xs text-[#9CA3AF] text-center py-8">Aucune conversation</p>
          )}
          {filtered.map(conv => {
            const isActive = conv.id === selectedId
            const last     = lastMsg(conv)
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  'w-full text-left px-4 py-3.5 transition-colors cursor-pointer',
                  isActive ? 'bg-[#EBF3FB]' : 'hover:bg-[#F8F9FA]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5',
                    isActive ? 'bg-[#1267A4] text-white' : 'bg-[#6199C1]/10 text-[#6199C1]'
                  )}>
                    {initiales(conv.formateur.prenom, conv.formateur.nom)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={cn('text-sm font-semibold truncate', isActive ? 'text-[#1267A4]' : 'text-[#1F2937]')}>
                        {conv.formateur.prenom} {conv.formateur.nom}
                      </p>
                      <span className="shrink-0 text-[10px] text-[#9CA3AF]">
                        {fmtConvDate(last.date)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] truncate mb-0.5">{conv.sujet}</p>
                    <p className="text-[11px] text-[#9CA3AF] truncate leading-snug">
                      {last.sens === 'sortant' ? 'Vous : ' : ''}{last.contenu}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Colonne droite ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header thread */}
        <div className="px-6 py-4 border-b border-[#F3F4F6] shrink-0">
          <h3 className="text-sm font-semibold text-[#1F2937] truncate">{selected.sujet}</h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {selected.formateur.prenom} {selected.formateur.nom}
          </p>
        </div>

        {/* Fil de messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          <AnimatePresence initial={false}>
            {selected.messages.map((msg, i) => {
              const isSortant = msg.sens === 'sortant'
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 6) * 0.03, duration: 0.18 }}
                  className={cn('flex items-end gap-2', isSortant ? 'justify-end' : 'justify-start')}
                >
                  {!isSortant && (
                    <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center shrink-0 mb-0.5">
                      <span className="text-[#6B7280] text-[10px] font-semibold">
                        {initiales(selected.formateur.prenom, selected.formateur.nom)}
                      </span>
                    </div>
                  )}
                  <div className={cn('max-w-[68%]', isSortant && 'items-end flex flex-col')}>
                    {!isSortant && (
                      <p className="text-[10px] text-[#9CA3AF] mb-1 ml-1">
                        {selected.formateur.prenom} {selected.formateur.nom}
                      </p>
                    )}
                    <div className={cn(
                      'px-4 py-2.5 rounded-2xl',
                      isSortant
                        ? 'bg-[#1267A4] text-white rounded-tr-sm'
                        : 'bg-[#F3F4F6] text-[#1F2937] rounded-tl-sm'
                    )}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.contenu}</p>
                    </div>
                    <p className={cn(
                      'text-[10px] text-[#9CA3AF] mt-1',
                      isSortant ? 'mr-1 text-right' : 'ml-1'
                    )}>
                      {formatDateTime(msg.date)}
                    </p>
                  </div>
                  {isSortant && (
                    <div className="w-7 h-7 rounded-full bg-[#1267A4] flex items-center justify-center shrink-0 mb-0.5">
                      <span className="text-white text-[10px] font-bold">F7</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Champ de saisie */}
        <div className="px-6 py-4 border-t border-[#F3F4F6] shrink-0">
          <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] focus-within:border-[#1267A4]/40 focus-within:bg-white transition-colors px-4 py-3">
            <input
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Écrire un message… (Entrée pour envoyer)"
              className="flex-1 text-sm text-[#1F2937] placeholder-[#9CA3AF] bg-transparent outline-none"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1267A4] text-white hover:bg-[#0f5390] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
