'use client'

import { usePathname } from 'next/navigation'

export default function FormationsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="px-10 py-8">
      {!pathname.startsWith('/formations/') && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1F2937]">Formations</h1>
          <p className="text-sm text-gray-400 mt-1">Gérez votre catalogue de formations et vos sessions</p>
        </div>
      )}
      {children}
    </div>
  )
}
