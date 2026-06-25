import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { setNotificationTags } from '../lib/onesignal'
import { AGENCIES } from '../lib/agencies'

const ROLES = ['Sworn Staff', 'Civilian Staff', 'Family Member']

// ── Step 1: Agency ────────────────────────────────────────────
function AgencyStep({ onNext }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-navy" style={{ touchAction: 'manipulation' }}>

      <div className="relative px-6 pt-16 pb-8 overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.8)' }}>
            <span className="w-1 h-1 rounded-full bg-gold/70" />
            Step 1 of 2
          </span>
          <h1 className="font-display text-cream uppercase leading-[0.92] tracking-wide"
            style={{ fontSize: 'clamp(3rem,14vw,4rem)' }}>
            Which<br />Agency<br />Do You<br />Serve?
          </h1>
          <p className="font-sans text-[13px] leading-relaxed mt-3" style={{ color: 'rgba(244,242,238,0.45)' }}>
            We'll send you relevant notifications for your department.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4" style={{ overscrollBehavior: 'contain' }}>
        <div className="flex flex-col gap-2">
          {AGENCIES.map((agency) => {
            const isSelected = selected === agency
            return (
              <button key={agency} onClick={() => setSelected(agency)}
                className="w-full text-left rounded-2xl px-5 cursor-pointer"
                style={{
                  minHeight: '56px',
                  backgroundColor: isSelected ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                  border: isSelected ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                }}>
                <span className="font-sans font-medium text-[14px] leading-snug"
                  style={{ color: isSelected ? '#C9A84C' : 'rgba(244,242,238,0.8)' }}>
                  {agency}
                </span>
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: isSelected ? '#C9A84C' : 'transparent',
                    border: isSelected ? 'none' : '1.5px solid rgba(244,242,238,0.2)',
                    transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
                  }}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L3.5 7.5L8.5 2.5" stroke="#0B1F4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-5 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => selected && onNext(selected)} disabled={!selected}
          className="w-full rounded-full flex items-center justify-between px-5 py-3.5 cursor-pointer"
          style={{
            backgroundColor: selected ? '#C9A84C' : 'rgba(201,168,76,0.2)',
            transition: 'all 0.35s cubic-bezier(0.32,0.72,0,1)',
            opacity: selected ? 1 : 0.6,
          }}>
          <span className="font-sans font-semibold text-[14px]"
            style={{ color: selected ? '#0B1F4A' : 'rgba(201,168,76,0.6)' }}>
            {selected ? `Continue` : 'Select your agency'}
          </span>
          <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: selected ? 'rgba(11,31,74,0.12)' : 'transparent' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke={selected ? '#0B1F4A' : 'rgba(201,168,76,0.4)'}
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

// ── Step 2: Role ──────────────────────────────────────────────
function RoleStep({ agency, onBack, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const { session, refreshProfile } = useAuth()

  async function handleComplete() {
    if (!selected) return
    setSaving(true); setError(null)

    const { error: err } = await supabase
      .from('user_profiles')
      .upsert({ id: session.user.id, agency, staff_type: selected, updated_at: new Date().toISOString() })

    setSaving(false)
    if (err) { setError('Something went wrong. Please try again.'); return }

    setNotificationTags(agency, selected)
    refreshProfile()
    onComplete()
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-navy" style={{ touchAction: 'manipulation' }}>

      <div className="relative px-6 pt-16 pb-8 overflow-hidden shrink-0">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <button onClick={onBack}
            className="flex items-center gap-1.5 font-sans text-[12px] text-cream/40 hover:text-cream/60 mb-4 cursor-pointer transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.8)' }}>
            <span className="w-1 h-1 rounded-full bg-gold/70" />
            Step 2 of 2
          </span>
          <h1 className="font-display text-cream uppercase leading-[0.92] tracking-wide"
            style={{ fontSize: 'clamp(3rem,14vw,4rem)' }}>
            What's<br />Your<br />Role?
          </h1>
          <p className="font-sans text-[13px] leading-relaxed mt-3" style={{ color: 'rgba(244,242,238,0.45)' }}>
            You can change this anytime in your account settings.
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-2 flex flex-col justify-center gap-3">
        {ROLES.map((role) => {
          const isSelected = selected === role
          return (
            <button key={role} onClick={() => setSelected(role)}
              className="w-full text-left rounded-2xl px-5 cursor-pointer"
              style={{
                minHeight: '64px',
                backgroundColor: isSelected ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                border: isSelected ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
              }}>
              <span className="font-sans font-semibold text-[15px]"
                style={{ color: isSelected ? '#C9A84C' : 'rgba(244,242,238,0.8)' }}>
                {role}
              </span>
              <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isSelected ? '#C9A84C' : 'transparent',
                  border: isSelected ? 'none' : '1.5px solid rgba(244,242,238,0.2)',
                  transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
                }}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L3.5 7.5L8.5 2.5" stroke="#0B1F4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
            </button>
          )
        })}
      </div>

      <div className="px-4 py-5 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {error && <p className="font-sans text-[12px] text-red-400 text-center mb-3">{error}</p>}
        <button onClick={handleComplete} disabled={!selected || saving}
          className="w-full rounded-full flex items-center justify-between px-5 py-3.5 cursor-pointer disabled:opacity-50"
          style={{
            backgroundColor: selected ? '#C9A84C' : 'rgba(201,168,76,0.2)',
            transition: 'all 0.35s cubic-bezier(0.32,0.72,0,1)',
          }}>
          <span className="font-sans font-semibold text-[14px]"
            style={{ color: selected ? '#0B1F4A' : 'rgba(201,168,76,0.6)' }}>
            {saving ? 'Saving…' : selected ? 'Enter the app' : 'Select your role'}
          </span>
          {!saving && (
            <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: selected ? 'rgba(11,31,74,0.12)' : 'transparent' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke={selected ? '#0B1F4A' : 'rgba(201,168,76,0.4)'}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Main Onboarding (orchestrates both steps) ─────────────────
export default function Onboarding() {
  const [step, setStep]       = useState(1)
  const [agency, setAgency]   = useState(null)

  if (step === 1) {
    return <AgencyStep onNext={(a) => { setAgency(a); setStep(2) }} />
  }

  return (
    <RoleStep
      agency={agency}
      onBack={() => setStep(1)}
      onComplete={() => {}}
    />
  )
}
