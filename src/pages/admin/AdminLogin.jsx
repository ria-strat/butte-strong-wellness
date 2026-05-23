import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">

      {/* Logo / wordmark */}
      <div className="mb-10 text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-gold/60 mb-1">Butte Strong Wellness</p>
        <h1 className="font-display text-cream uppercase tracking-wide" style={{ fontSize: 'clamp(2.2rem,10vw,3rem)' }}>
          Admin Portal
        </h1>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-[1px]"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.3) 0%, rgba(201,168,76,0.05) 100%)' }}
      >
        <div className="rounded-2xl bg-navy/80 backdrop-blur px-8 py-8" style={{ border: '1px solid rgba(201,168,76,0.1)' }}>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/40 font-semibold">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full rounded-xl px-4 py-3 font-sans text-[14px] text-cream bg-white/5 outline-none placeholder:text-cream/20 focus:ring-2"
                style={{ border: '1px solid rgba(201,168,76,0.2)', '--tw-ring-color': 'rgba(201,168,76,0.5)' }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/40 font-semibold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 font-sans text-[14px] text-cream bg-white/5 outline-none placeholder:text-cream/20 focus:ring-2"
                style={{ border: '1px solid rgba(201,168,76,0.2)', '--tw-ring-color': 'rgba(201,168,76,0.5)' }}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="font-sans text-[12px] text-red-400 text-center -mt-1">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 font-sans font-semibold text-[14px] text-navy mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: '#C9A84C' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

          </form>
        </div>
      </div>

      <p className="font-sans text-[11px] text-cream/20 mt-8 text-center">
        Butte Strong Wellness Unit · Restricted Access
      </p>
    </div>
  )
}
