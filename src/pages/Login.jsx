import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LogoMark from '../assets/LogoMark'

// ── Shared input style ─────────────────────────────────────────────────────────
const inputCls = "w-full rounded-xl px-4 py-3 font-sans text-[14px] text-cream bg-white/5 outline-none placeholder:text-cream/20 focus:ring-2"
const inputStyle = { border: '1px solid rgba(201,168,76,0.2)', '--tw-ring-color': 'rgba(201,168,76,0.5)' }

function Field({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/40 font-semibold">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className={inputCls}
        style={inputStyle}
      />
    </div>
  )
}

// ── Sign In ────────────────────────────────────────────────────────────────────
function SignInForm({ onForgotPassword }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError('Incorrect email or password. Please try again.'); return }
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Email" type="email" value={email} onChange={setEmail}
        placeholder="your@email.com" autoComplete="email" />
      <Field label="Password" type="password" value={password} onChange={setPassword}
        placeholder="••••••••" autoComplete="current-password" />

      {error && <p className="font-sans text-[12px] text-red-400 text-center -mt-1">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full rounded-xl py-3.5 font-sans font-semibold text-[14px] text-navy cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#C9A84C' }}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <button type="button" onClick={onForgotPassword}
        className="font-sans text-[12px] text-cream/35 hover:text-cream/60 transition-colors text-center cursor-pointer">
        Forgot password?
      </button>
    </form>
  )
}

// ── Create Account ─────────────────────────────────────────────────────────────
function CreateAccountForm() {
  const [step, setStep]         = useState(1)   // 1 = access code, 2 = email+password
  const [code, setCode]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(false)
  const navigate = useNavigate()

  async function checkCode(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true); setError(null)
    const { data, error: err } = await supabase.rpc('validate_access_code', { p_code: code.trim() })
    setLoading(false)
    if (err || !data) {
      setError('That access code is not valid. Contact the Wellness Unit for the current code.')
      return
    }
    setStep(2)
  }

  async function createAccount(e) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8)  { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p className="font-sans font-semibold text-cream text-[16px] mb-1">Check your email</p>
          <p className="font-sans text-[13px] text-cream/45 leading-relaxed">
            We sent a confirmation link to <span className="text-cream/70">{email}</span>.
            Click it to activate your account, then come back and sign in.
          </p>
        </div>
        <button onClick={() => { setSuccess(false); setStep(1); setCode(''); setEmail(''); setPassword(''); setConfirm('') }}
          className="font-sans text-[13px] text-cream/40 hover:text-cream/70 transition-colors cursor-pointer mt-2">
          ← Back to sign in
        </button>
      </div>
    )
  }

  if (step === 1) {
    return (
      <form onSubmit={checkCode} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream/40 font-semibold">
            Access Code
          </label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter your access code"
            autoCapitalize="characters"
            autoComplete="off"
            required
            className={inputCls}
            style={inputStyle}
          />
          <p className="font-sans text-[11px] text-cream/25 leading-relaxed mt-0.5">
            This code is provided by the Butte Strong Wellness Unit.
          </p>
        </div>

        {error && <p className="font-sans text-[12px] text-red-400 -mt-1">{error}</p>}

        <button type="submit" disabled={loading || !code.trim()}
          className="w-full rounded-xl py-3.5 font-sans font-semibold text-[14px] text-navy cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#C9A84C' }}>
          {loading ? 'Checking…' : 'Continue →'}
        </button>
      </form>
    )
  }

  // Step 2: email + password
  return (
    <form onSubmit={createAccount} className="flex flex-col gap-5">
      <div className="flex items-center gap-2 -mb-1">
        <button type="button" onClick={() => { setStep(1); setError(null) }}
          className="font-sans text-[12px] text-cream/35 hover:text-cream/60 transition-colors cursor-pointer">
          ← Change code
        </button>
      </div>

      <Field label="Email" type="email" value={email} onChange={setEmail}
        placeholder="your@email.com" autoComplete="email" />
      <Field label="Password (min 8 characters)" type="password" value={password}
        onChange={setPassword} placeholder="••••••••" autoComplete="new-password" />
      <Field label="Confirm Password" type="password" value={confirm}
        onChange={setConfirm} placeholder="••••••••" autoComplete="new-password" />

      {error && <p className="font-sans text-[12px] text-red-400 -mt-1">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full rounded-xl py-3.5 font-sans font-semibold text-[14px] text-navy cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#C9A84C' }}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  )
}

// ── Forgot Password ────────────────────────────────────────────────────────────
function ForgotPasswordForm({ onBack }) {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError(null)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <p className="font-sans font-semibold text-cream text-[15px]">Check your email</p>
        <p className="font-sans text-[13px] text-cream/45 leading-relaxed">
          If that email has an account, we sent a password reset link.
        </p>
        <button onClick={onBack}
          className="font-sans text-[13px] text-cream/40 hover:text-cream/70 transition-colors cursor-pointer mt-2">
          ← Back to sign in
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="font-sans text-[13px] text-cream/45 leading-relaxed -mt-1">
        Enter your email and we'll send a password reset link.
      </p>
      <Field label="Email" type="email" value={email} onChange={setEmail}
        placeholder="your@email.com" autoComplete="email" />
      {error && <p className="font-sans text-[12px] text-red-400 -mt-1">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full rounded-xl py-3.5 font-sans font-semibold text-[14px] text-navy cursor-pointer disabled:opacity-50"
        style={{ backgroundColor: '#C9A84C' }}>
        {loading ? 'Sending…' : 'Send Reset Link'}
      </button>
      <button type="button" onClick={onBack}
        className="font-sans text-[12px] text-cream/35 hover:text-cream/60 transition-colors text-center cursor-pointer">
        ← Back to sign in
      </button>
    </form>
  )
}

// ── Main Login Page ────────────────────────────────────────────────────────────
export default function Login() {
  const [tab, setTab]             = useState('signin')  // 'signin' | 'create'
  const [forgotPassword, setForgotPassword] = useState(false)

  const tabStyle = (active) => ({
    color: active ? '#C9A84C' : 'rgba(244,242,238,0.35)',
    borderBottom: active ? '2px solid #C9A84C' : '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
  })

  return (
    <div className="min-h-[100dvh] bg-navy flex flex-col items-center justify-center px-6 py-10">

      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <LogoMark size={64} />
        <div className="text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold/60 mb-0.5">
            Butte Strong
          </p>
          <h1 className="font-display text-cream uppercase tracking-wide"
            style={{ fontSize: 'clamp(1.8rem,8vw,2.4rem)' }}>
            Wellness Unit
          </h1>
          <p className="font-sans text-[11px] text-cream/30 mt-1">
            First Responder Wellness · Butte County
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl p-[1px]"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.04) 100%)' }}>
        <div className="rounded-2xl px-7 py-7"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.08)', backdropFilter: 'blur(8px)' }}>

          {forgotPassword ? (
            <ForgotPasswordForm onBack={() => setForgotPassword(false)} />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b mb-6" style={{ borderColor: 'rgba(201,168,76,0.12)' }}>
                <button onClick={() => setTab('signin')}
                  className="flex-1 pb-3 font-sans text-[13px] font-semibold cursor-pointer"
                  style={tabStyle(tab === 'signin')}>
                  Sign In
                </button>
                <button onClick={() => setTab('create')}
                  className="flex-1 pb-3 font-sans text-[13px] font-semibold cursor-pointer"
                  style={tabStyle(tab === 'create')}>
                  Create Account
                </button>
              </div>

              {tab === 'signin'
                ? <SignInForm onForgotPassword={() => setForgotPassword(true)} />
                : <CreateAccountForm />}
            </>
          )}
        </div>
      </div>

      <p className="font-sans text-[11px] text-cream/15 mt-8 text-center">
        Butte Strong Wellness Unit · Restricted Access
      </p>
    </div>
  )
}
