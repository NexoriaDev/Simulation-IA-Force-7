'use client'

import { GitBranch, Send } from 'lucide-react'
import { SectionTabs, type SectionTab } from '@/components/layout/SectionTabs'

const TABS: SectionTab[] = [
  { href: '/communication/timeline', label: 'Timeline & Emails', icon: GitBranch },
  { href: '/communication/campagnes', label: "Campagnes d'emailing", icon: Send },
]

export default function CommunicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-10 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1F2937]">Communication</h1>
        <p className="text-sm text-gray-400 mt-1">Gérez vos processus de communication et d'emailing</p>
      </div>
      <SectionTabs tabs={TABS} />
      {children}
    </div>
  )
}
