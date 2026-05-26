import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function useReveal(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = `opacity 0.65s cubic-bezier(0.32,0.72,0,1) ${delay}ms, transform 0.65s cubic-bezier(0.32,0.72,0,1) ${delay}ms`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return ref
}

const AGENCIES = [
  'Butte County Sheriff\'s Office (BCSO)',
  'Chico Police Department (CPD)',
  'Chico Fire Department (CFD)',
  'Oroville Police Department (OPD)',
  'Butte County Probation (BCP)',
  'Butte EMS',
  'CAL FIRE',
  'Paradise Police Department (PPD)',
  'CSU Chico Police (UPD)',
  'Other / Prefer not to say',
]

export default function Feedback() {
  const headerRef = useReveal(0)
  const formRef   = useReveal(80)

  const [name,    setName]    = useState('')
  const [agency,  setAgency]  = useState('')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState('idle') // idle | submitting | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return
    setStatus('submitting')

    const { error } = await supabase.from('feedback').insert({
      name:    name.trim()    || null,
      agency:  agency         || null,
      message: message.trim(),
    })

    if (error) {
      console.error('Feedback submit error:', error)
      setStatus(error.message || 'error')
    } else {
      setStatus('success')
      setName('')
      setAgency('')
      setMessage('')
    }
  }

  const inputCls = "w-full rounded-xl px-4 py-3 font-sans text-[14px] text-navy bg-white outline-none focus:ring-2 focus:ring-navy/20 transition-shadow"
  const inputStyle = { border: '1px solid rgba(11,31,74,0.12)' }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream">

      {/* Header */}
      <div className="relative bg-navy pt-14 pb-8 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 0% 100%, rgba(201,168,76,0.1) 0%, transparent 65%)' }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: '#C9A84C' }} />

        <div ref={headerRef} className="relative z-10">
          <span
            className="inline-block rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
            style={{ border: '1px solid rgba(201,168,76,0.35)', color: 'rgba(201,168,76,0.8)' }}
          >
            Your Voice
          </span>
          <h1
            className="font-display text-cream uppercase leading-[0.9] tracking-wide"
            style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
          >
            Share<br />Feedback
          </h1>
          <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
            Help us improve the Wellness Unit. Your responses go directly to Jodi and the team.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.4 }}
        />
      </div>

      {/* Form */}
      <div className="px-4 pt-5 pb-24">

        {status === 'success' ? (
          <div
            ref={formRef}
            className="rounded-[1.5rem] p-[5px]"
            style={{ background: 'rgba(26,138,114,0.06)', border: '1px solid rgba(26,138,114,0.15)' }}
          >
            <div className="rounded-[calc(1.5rem-5px)] bg-white px-6 py-10 flex flex-col items-center text-center" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(26,138,114,0.1)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A8A72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-sans font-semibold text-navy text-[18px] mb-2">Thank you</h2>
              <p className="font-sans text-[13px] text-navy/50 leading-relaxed max-w-xs">
                Your feedback has been received. The Wellness Unit team will review it.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 rounded-full px-6 py-2.5 font-sans text-[13px] font-semibold cursor-pointer"
                style={{ backgroundColor: 'rgba(11,31,74,0.06)', color: '#0B1F4A' }}
              >
                Submit another
              </button>
            </div>
          </div>
        ) : (
          <div ref={formRef}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Anonymous note */}
              <div
                className="rounded-[1.25rem] p-[5px]"
                style={{ background: 'rgba(11,31,74,0.04)', border: '1px solid rgba(11,31,74,0.07)' }}
              >
                <div className="rounded-[calc(1.25rem-5px)] bg-white px-5 py-3.5" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
                  <p className="font-sans text-[12px] text-navy/50 leading-relaxed">
                    <span className="font-semibold text-navy/70">Name and agency are optional.</span> You may submit anonymously — only your message is required.
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-navy/35">
                  Name <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="First name or leave blank"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>

              {/* Agency */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-navy/35">
                  Agency <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <select
                  value={agency}
                  onChange={e => setAgency(e.target.value)}
                  className={inputCls}
                  style={{ ...inputStyle, color: agency ? '#0B1F4A' : 'rgba(11,31,74,0.35)' }}
                >
                  <option value="">Select agency…</option>
                  {AGENCIES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-navy/35">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  placeholder="Share your thoughts, suggestions, or experiences with the Wellness Unit…"
                  rows={5}
                  className={inputCls}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              {/* Error */}
              {status !== 'idle' && status !== 'submitting' && status !== 'success' && (
                <p className="font-sans text-[12px] text-red-500 text-center -mt-1">
                  {status}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting' || !message.trim()}
                className="w-full rounded-full py-4 font-sans font-semibold text-[14px] text-navy cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform mt-1"
                style={{ backgroundColor: '#C9A84C' }}
              >
                {status === 'submitting' ? 'Sending…' : 'Send Feedback'}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  )
}
