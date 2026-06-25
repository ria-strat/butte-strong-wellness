import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LogoMark from '../assets/LogoMark'

const inputCls  = "w-full rounded-xl px-4 py-3 font-sans text-[14px] text-cream bg-white/5 outline-none placeholder:text-cream/20 focus:ring-2"
const inputStyle = { border: '1px solid rgba(201,168,76,0.2)', '--tw-ring-color': 'rgba(201,168,76,0.5)' }

function Field({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/40 font-semibold">
        {label}
      </label>
      <input type="password" value={value} onChange={e => onChange(e.target.value)}
        placeholder="••••••••" autoComplete="new-password" required
        className={inputCls} style={inputStyle} />
    </div>
  )
}

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [done, setDone]         = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => navigate('/'), 2500)
  }

  if (done) {
    return (
      <div className="min-h-[100dvh] bg-navy flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p className="font-sans font-semibold text-cream text-[16px]">Password updated!</p>
          <p className="font-sans text-[13px] text-cream/45">Signing you in…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-navy flex flex-col items-center justify-center px-6 py-10">
      <div className="mb-8">
        <LogoMark size={56} />
      </div>

      <div className="w-full max-w-sm rounded-2xl p-[1px]"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.04) 100%)' }}>
        <div className="rounded-2xl px-7 py-7"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.08)', backdropFilter: 'blur(8px)' }}>

          <h2 className="font-sans font-semibold text-cream text-[18px] mb-1">Set new password</h2>
          <p className="font-sans text-[13px] text-cream/40 mb-6 leading-relaxed">
            Choose a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="New Password"     value={password} onChange={setPassword} />
            <Field label="Confirm Password" value={confirm}  onChange={setConfirm} />

            {error && (
              <p className="font-sans text-[12px] text-red-400 -mt-1">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-xl py-3.5 font-sans font-semibold text-[14px] text-navy cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#C9A84C' }}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
