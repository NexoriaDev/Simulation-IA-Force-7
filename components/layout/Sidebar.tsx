'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CheckSquare,
  UsersRound,
  Users,
  BookOpen,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_A_VALIDER } from '@/lib/data/mock'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/valider', label: 'À valider', icon: CheckSquare, badgeKey: 'valider' },
  { href: '/prospects', label: 'Prospects & Clients', icon: UsersRound },
  { href: '/formateurs', label: 'Formateurs', icon: Users },
  { href: '/catalogue', label: 'Catalogue', icon: BookOpen },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const aValiderCount = MOCK_A_VALIDER.length

  return (
    <aside className="w-60 shrink-0 h-screen bg-[#0A4D8C] flex flex-col sticky top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F5B400] flex items-center justify-center shrink-0">
          <span className="text-[#0A4D8C] font-bold text-sm leading-none tracking-tight">F7</span>
        </div>
        <div className="leading-tight">
          <p className="text-white font-semibold text-sm">Force 7</p>
          <p className="text-white/50 text-xs">Formation</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/prospects'
              ? pathname.startsWith('/prospects') || pathname.startsWith('/dossiers')
              : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon
          const badge = item.badgeKey === 'valider' ? aValiderCount : null

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 cursor-pointer select-none',
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/65 hover:text-white hover:bg-white/8'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#F5B400] rounded-r-full" />
              )}
              <Icon size={15} strokeWidth={isActive ? 2 : 1.75} className="shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {badge && badge > 0 && !isActive && (
                <span className="bg-[#F5B400] text-[#0A4D8C] text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                  {badge}
                </span>
              )}
              {badge && badge > 0 && isActive && (
                <span className="bg-white/20 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 px-4 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-semibold">IL</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium leading-tight truncate">Iliès</p>
          <p className="text-white/50 text-xs leading-tight truncate">Administration</p>
        </div>
        <button
          className="text-white/35 hover:text-white/80 transition-colors cursor-pointer p-1 rounded"
          title="Déconnexion"
          aria-label="Déconnexion"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
