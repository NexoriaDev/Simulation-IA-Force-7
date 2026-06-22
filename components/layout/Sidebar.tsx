'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UsersRound, LogOut, User, MessageSquare, ChevronDown, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { href: '/prospects', label: 'Prospects & Clients', icon: UsersRound },
]

const NAV_GROUPS = [
  {
    key: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    matchPrefix: '/communication',
    items: [
      { href: '/communication/timeline', label: 'Timeline & Emails', icon: GitBranch },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const s = new Set<string>()
    if (pathname.startsWith('/communication')) s.add('communication')
    return s
  })

  // Auto-ouvre le groupe quand on navigue vers une de ses pages
  useEffect(() => {
    NAV_GROUPS.forEach(g => {
      if (pathname.startsWith(g.matchPrefix)) {
        setOpenGroups(prev => prev.has(g.key) ? prev : new Set([...prev, g.key]))
      }
    })
  }, [pathname])

  const toggle = (key: string) =>
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <aside className="w-60 shrink-0 h-screen bg-white flex flex-col sticky top-0 z-30 border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-6 shrink-0 flex items-center justify-center bg-[#d1d5db]">
        <Image src="/images/logo-force-7.png" alt="Force 7" width={120} height={60} className="object-contain" priority />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/prospects'
            ? pathname.startsWith('/prospects') || pathname.startsWith('/dossiers')
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 select-none',
                isActive ? 'bg-[#1267A4] text-white font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              )}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.75} className="shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          )
        })}

        {NAV_GROUPS.map((group) => {
          const isOpen = openGroups.has(group.key)
          const isGroupActive = group.items.some(i => pathname.startsWith(i.href))
          const GroupIcon = group.icon
          return (
            <div key={group.key}>
              <button
                onClick={() => toggle(group.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 select-none cursor-pointer',
                  isGroupActive && !isOpen
                    ? 'bg-[#1267A4] text-white font-medium'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                )}
              >
                <GroupIcon size={16} strokeWidth={1.75} className="shrink-0" />
                <span className="flex-1 truncate text-left">{group.label}</span>
                <ChevronDown size={14} className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
              </button>

              {isOpen && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    const ItemIcon = item.icon
                    return (
                      <Link key={item.href} href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 select-none',
                          isActive ? 'bg-[#1267A4] text-white font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                        )}
                      >
                        <ItemIcon size={14} strokeWidth={isActive ? 2 : 1.75} className="shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Utilisateur + Déconnexion */}
      <div className="px-3 pb-4 space-y-2 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-lg bg-[#1267A4] flex items-center justify-center shrink-0">
            <User size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-semibold leading-tight truncate">Iliès</p>
            <p className="text-gray-400 text-xs leading-tight truncate">Administration</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer">
          <LogOut size={15} className="shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
