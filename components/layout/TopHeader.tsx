'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, MessageSquare, GraduationCap, Sparkles, Mail, FileText, BarChart2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type Tab   = 'formateurs' | 'prospects'
type Notif = { id: string; Icon: LucideIcon; bg: string; color: string; text: string; time: string; read: boolean }

const INIT_FORMA: Notif[] = [
  { id: 'f1', Icon: MessageSquare, bg: 'bg-[#EBF3FB]', color: 'text-[#1267A4]', text: 'Marc Vaillant — Nouveau message reçu',                         time: 'il y a 2h',  read: false },
  { id: 'f2', Icon: MessageSquare, bg: 'bg-[#EBF3FB]', color: 'text-[#1267A4]', text: 'Sophie Bernard — Session du 8 septembre confirmée',             time: 'il y a 1j',  read: false },
  { id: 'f3', Icon: MessageSquare, bg: 'bg-orange-50', color: 'text-orange-500', text: 'Karim Amara — Demande de report de session (4 août)',           time: 'il y a 11j', read: true  },
  { id: 'f4', Icon: GraduationCap, bg: 'bg-purple-50', color: 'text-purple-600', text: 'Thomas Renard — Premier contact engagé (Excel avancé)',         time: 'il y a 20j', read: true  },
]

const INIT_PROSP: Notif[] = [
  { id: 'p1', Icon: Sparkles,   bg: 'bg-[#EBF3FB]', color: 'text-[#1267A4]', text: 'Action requise — Email IA à valider pour Stéphanie Leroux',       time: 'il y a 1h', read: false },
  { id: 'p2', Icon: Mail,       bg: 'bg-green-50',  color: 'text-green-600',  text: 'Maritime Industries a répondu à votre email de relance',          time: 'il y a 4h', read: false },
  { id: 'p3', Icon: BarChart2,  bg: 'bg-amber-50',  color: 'text-amber-600',  text: 'Dossier BTP Normandie passé à « En formation »',                  time: 'il y a 1j', read: false },
  { id: 'p4', Icon: FileText,   bg: 'bg-gray-100',  color: 'text-gray-500',   text: 'Contrat signé reçu — Chantiers Maritimes de Normandie',           time: 'il y a 3j', read: true  },
]

export function TopHeader() {
  const [open, setOpen]   = useState(false)
  const [tab, setTab]     = useState<Tab>('formateurs')
  const [forma, setForma] = useState<Notif[]>(INIT_FORMA)
  const [prosp, setProsp] = useState<Notif[]>(INIT_PROSP)
  const ref               = useRef<HTMLDivElement>(null)

  const formaUnread = forma.filter(n => !n.read).length
  const prospUnread = prosp.filter(n => !n.read).length
  const totalUnread = formaUnread + prospUnread

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function markRead(id: string) {
    if (tab === 'formateurs') setForma(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
    else                      setProsp(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    if (tab === 'formateurs') setForma(ns => ns.map(n => ({ ...n, read: true })))
    else                      setProsp(ns => ns.map(n => ({ ...n, read: true })))
  }

  const notifs = tab === 'formateurs' ? forma : prosp

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'formateurs', label: 'Formateurs',         count: formaUnread },
    { key: 'prospects',  label: 'Prospects & Clients', count: prospUnread },
  ]

  return (
    <header className="h-12 shrink-0 border-b border-[#F3F4F6] flex items-center justify-end px-8 bg-white">
      <div ref={ref} className="relative">

        {/* Cloche */}
        <button
          onClick={() => setOpen(v => !v)}
          className={cn(
            'relative w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer',
            open ? 'bg-[#EBF3FB] text-[#1267A4]' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
          )}
        >
          <Bell size={18} strokeWidth={1.75} />
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none pointer-events-none">
              {totalUnread}
            </span>
          )}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{    opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 w-[380px] bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-50 overflow-hidden"
            >
              {/* En-tête dropdown */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#F3F4F6]">
                <h2 className="text-sm font-semibold text-[#1F2937]">Notifications</h2>
                {notifs.some(n => !n.read) && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#1267A4] hover:underline cursor-pointer"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              {/* Sous-onglets */}
              <div className="flex gap-2 px-4 pt-3 pb-2">
                {TABS.map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer',
                      tab === key
                        ? 'bg-[#1267A4] text-white border-[#1267A4]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#1267A4] hover:text-[#1267A4]'
                    )}
                  >
                    {label}
                    {count > 0 && (
                      <span className={cn(
                        'min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center leading-none',
                        tab === key ? 'bg-white/25 text-white' : 'bg-red-100 text-red-600'
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Liste */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-[#F9FAFB]">
                {notifs.map(n => {
                  const Icon = n.Icon
                  return (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        'w-full text-left flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer',
                        !n.read ? 'bg-[#FAFCFF] hover:bg-[#EBF3FB]/60' : 'hover:bg-[#F8F9FA]'
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', n.bg)}>
                        <Icon size={14} className={n.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs leading-snug', !n.read ? 'font-semibold text-[#1F2937]' : 'text-[#4B5563]')}>
                          {n.text}
                        </p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#1267A4] shrink-0 mt-1.5 ml-1" />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
