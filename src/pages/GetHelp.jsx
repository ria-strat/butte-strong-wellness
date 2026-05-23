import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

function useReveal(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = `opacity 0.6s cubic-bezier(0.32,0.72,0,1) ${delay}ms, transform 0.6s cubic-bezier(0.32,0.72,0,1) ${delay}ms`
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

// Emergency 911 always first, hardcoded
const EMERGENCY = { name: 'Emergency', phone: '911', description: 'If you or someone else is in immediate danger.' }

function ContactCard({ contact, index, urgent }) {
  const ref = useReveal(index * 70)
  const isCallable = contact.phone && !contact.phone.toLowerCase().startsWith('text') && !contact.phone.toLowerCase().startsWith('contact')
  const isText = contact.phone && contact.phone.toLowerCase().startsWith('text')

  if (urgent) {
    return (
      <div
        ref={ref}
        className="rounded-[1.5rem] p-[5px]"
        style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.28)' }}
      >
        <div
          className="rounded-[calc(1.5rem-5px)] bg-navy px-5 py-5 relative overflow-hidden"
          style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(201,168,76,0.15) 0%, transparent 65%)' }}
          />
          <p className="relative font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: 'rgba(201,168,76,0.65)' }}>
            Emergency
          </p>
          <p className="relative font-display text-cream uppercase leading-[0.9] tracking-wide" style={{ fontSize: 'clamp(2rem,10vw,2.6rem)' }}>
            {contact.name}
          </p>
          {contact.description && (
            <p className="relative font-sans text-[12px] mt-2 leading-relaxed" style={{ color: 'rgba(244,242,238,0.5)' }}>
              {contact.description}
            </p>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="relative inline-flex items-center gap-2.5 rounded-full px-6 py-3 mt-4 font-sans font-semibold text-navy text-[14px] active:scale-[0.97]"
              style={{ backgroundColor: '#C9A84C', transition: 'transform 0.15s cubic-bezier(0.32,0.72,0,1)' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call 911
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: '#0B1F4A' }} />
        <div className="flex-1 min-w-0 p-4">
          <p className="font-sans font-semibold text-navy text-[15px] leading-snug">{contact.name}</p>
          {contact.description && (
            <p className="font-sans text-[12px] text-navy/50 leading-relaxed mt-1">{contact.description}</p>
          )}
          {contact.phone && (
            <div className="mt-3">
              {isCallable ? (
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans font-semibold text-[13px] cursor-pointer active:scale-[0.97]"
                  style={{ backgroundColor: '#0B1F4A', color: 'white', transition: 'transform 0.15s cubic-bezier(0.32,0.72,0,1)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call {contact.phone}
                </a>
              ) : isText ? (
                <p
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans font-semibold text-[13px]"
                  style={{ backgroundColor: 'rgba(11,31,74,0.06)', color: '#0B1F4A' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {contact.phone}
                </p>
              ) : (
                <p className="font-sans text-[13px] text-navy/50 mt-1">{contact.phone}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GetHelp() {
  const headerRef = useReveal(0)
  const emergencyRef = useReveal(60)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    supabase.from('crisis_contacts').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => setContacts(data || []))
  }, [])

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream">

      {/* Header */}
      <div className="relative bg-navy pt-14 pb-8 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 55% at 10% 100%, rgba(201,168,76,0.15) 0%, transparent 65%)' }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: '#C9A84C' }} />

        <div ref={headerRef} className="relative z-10">
          <span
            className="inline-block rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
            style={{ border: '1px solid rgba(201,168,76,0.35)', color: 'rgba(201,168,76,0.8)' }}
          >
            Support
          </span>
          <h1
            className="font-display text-cream uppercase leading-[0.9] tracking-wide"
            style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
          >
            Get Help<br />Now
          </h1>
          <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
            Confidential support is available right now — 24 hours a day, 7 days a week.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.4 }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 px-4 pt-5 pb-24">

        {/* 911 — always first, always prominent */}
        <div ref={emergencyRef}>
          <ContactCard contact={EMERGENCY} index={0} urgent={true} />
        </div>

        {/* Section divider */}
        <div className="flex items-center gap-3 px-1 mt-1">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">Crisis Lines</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
        </div>

        {/* DB-driven contacts */}
        {contacts.map((c, i) => (
          <ContactCard key={c.id} contact={c} index={i + 1} urgent={false} />
        ))}

        {/* Confidentiality note */}
        <div
          className="rounded-[1.25rem] p-[5px] mt-2"
          style={{ background: 'rgba(11,31,74,0.04)', border: '1px solid rgba(11,31,74,0.07)' }}
        >
          <div className="rounded-[calc(1.25rem-5px)] bg-white px-5 py-4" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-navy/30 mb-1.5">Confidentiality</p>
            <p className="font-sans text-[12px] text-navy/55 leading-relaxed">
              All calls and texts to crisis lines are confidential. You do not need to give your name. Seeking help is a sign of strength — not weakness.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
