'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export type SectionTab = {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

export function SectionTabs({ tabs }: { tabs: SectionTab[] }) {
  const pathname = usePathname()

  // Longest-match wins: évite qu'un parent matche quand un enfant est actif
  const activeHref = tabs.reduce((best, tab) => {
    const matches = pathname === tab.href || pathname.startsWith(tab.href + '/')
    return matches && tab.href.length > best.length ? tab.href : best
  }, '')

  return (
    <div className="flex items-center gap-2 mb-6">
      {tabs.map((tab) => {
        const isActive = tab.href === activeHref
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-150',
              isActive
                ? 'bg-[#1267A4] text-white border-[#1267A4]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#1267A4] hover:text-[#1267A4]'
            )}
          >
            <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
            <span>{tab.label}</span>
            {tab.badge != null && (
              <span className={cn(
                'ml-0.5 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center',
                isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
              )}>
                {tab.badge}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
