'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UsersRound, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/prospects', label: 'Prospects & Clients', icon: UsersRound },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 shrink-0 h-screen bg-[#1267A4] flex flex-col sticky top-0 z-30">
      {/* Bloc logo — carte intérieure sur fond sidebar uniforme, pas de ligne plein-largeur */}
      {/* ponytail: remplacer le badge F7 par <Image src="/images/logo-force7.png" alt="Force 7" fill /> quand le fichier est disponible */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <div className="bg-[#EEF2F7] rounded-2xl flex flex-col items-center py-5 gap-2">
          <div className="w-16 h-16 rounded-2xl bg-[#1267A4] flex items-center justify-center">
            <span className="text-[#FEE700] font-black text-2xl leading-none tracking-tight">F7</span>
          </div>
          <div className="text-center leading-tight">
            <p className="text-[#1267A4] font-bold text-sm tracking-wide">FORCE 7</p>
            <p className="text-[#6B7280] text-[11px]">Formation</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/prospects'
              ? pathname.startsWith('/prospects') || pathname.startsWith('/dossiers')
              : pathname.startsWith(item.href)
          const Icon = item.icon
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
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#FEE700] rounded-r-full" />
              )}
              <Icon size={15} strokeWidth={isActive ? 2 : 1.75} className="shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
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
