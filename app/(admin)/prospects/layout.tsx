'use client'

import { Users, UserPlus } from 'lucide-react'
import { SectionTabs, type SectionTab } from '@/components/layout/SectionTabs'

const TABS: SectionTab[] = [
  { href: '/prospects', label: 'Prospects & Clients', icon: Users },
  { href: '/prospects/demandes', label: 'Demandes', icon: UserPlus, badge: 4 },
]

export default function ProspectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">Prospects & Clients</h1>
        <p className="text-sm text-gray-400 mt-1">Gérez vos prospects, clients et demandes d'accès</p>
      </div>
      <SectionTabs tabs={TABS} />
      {children}
    </div>
  )
}
