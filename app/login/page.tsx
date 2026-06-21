import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 w-full max-w-sm shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#6199C1] flex items-center justify-center">
            <span className="text-white font-bold text-base">F7</span>
          </div>
          <div>
            <p className="font-semibold text-[#1F2937]">Force 7 Formation</p>
            <p className="text-xs text-[#6B7280]">Plateforme administrative</p>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-[#1F2937] mb-1">Connexion</h1>
        <p className="text-sm text-[#6B7280] mb-6">Mode démonstration actif</p>

        <Link
          href="/dashboard"
          className="block w-full text-center bg-[#6199C1] hover:bg-[#6199C1]/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm cursor-pointer"
        >
          Accéder à la démo →
        </Link>

        <p className="text-xs text-[#9CA3AF] text-center mt-6">
          Connecté en tant qu'Iliès — Administration
        </p>
      </div>
    </div>
  )
}
