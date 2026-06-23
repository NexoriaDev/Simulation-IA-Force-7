'use client'

import { usePathname } from 'next/navigation'
import { Users, UserPlus, MessageSquare } from 'lucide-react'
import { SectionTabs, type SectionTab } from '@/components/layout/SectionTabs'

const TABS: SectionTab[] = [
  { href: '/formateurs',          label: 'Liste des formateurs', icon: Users },
  { href: '/formateurs/demandes', label: 'Demandes',             icon: UserPlus,      badge: 4 },
  { href: '/formateurs/messages', label: 'Messages',             icon: MessageSquare, badge: 3 },
]

const SECTION_PATHS = ['/formateurs', '/formateurs/demandes', '/formateurs/messages']

export default function FormateursLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Pages de détail (/formateurs/[id]) : rendu direct, sans header ni SectionTabs
  if (!SECTION_PATHS.includes(pathname)) return <>{children}</>

  return (
    <div className="px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">Formateurs</h1>
        <p className="text-sm text-gray-400 mt-1">Gérez vos formateurs et leurs échanges</p>
      </div>
      <SectionTabs tabs={TABS} />
      {children}
    </div>
  )
}
