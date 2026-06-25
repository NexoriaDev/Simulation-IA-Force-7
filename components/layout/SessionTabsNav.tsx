'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SessionTabsNav({ id, sessionId }: { id: string; sessionId: string }) {
  const pathname = usePathname()
  const base = `/formations/${id}/sessions/${sessionId}`

  const tabs = [
    { href: base,                 label: 'Suivi administratif', Icon: ClipboardList },
    { href: `${base}/emargement`, label: 'Suivi émargement',    Icon: FileText },
  ]

  // Longest-match wins (identique à SectionTabs)
  const activeHref = tabs.reduce((best, tab) => {
    const matches = pathname === tab.href || pathname.startsWith(tab.href + '/')
    return matches && tab.href.length > best.length ? tab.href : best
  }, '')

  return (
    <div className="flex items-center gap-2 mb-6">
      {tabs.map(({ href, label, Icon }) => {
        const isActive = href === activeHref
        return (
          <Link key={href} href={href}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150',
              isActive
                ? 'bg-[#1267A4] text-white border-[#1267A4]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#1267A4] hover:text-[#1267A4]'
            )}
          >
            <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
            <span>{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
