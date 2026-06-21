'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

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

        <h1 className="text-xl font-semibold text-[#1F2937] mb-6">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="ilies@force7-formation.fr"
              className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6199C1]/20 focus:border-[#6199C1]/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6199C1]/20 focus:border-[#6199C1]/40 transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6199C1] hover:bg-[#6199C1]/90 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm cursor-pointer"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
