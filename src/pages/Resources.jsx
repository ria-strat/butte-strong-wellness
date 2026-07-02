import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

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

const SECTIONS = [
  {
    to: '/peer-support',
    label: 'Peer Support',
    sub: 'Talk to a trained colleague who understands what first responders carry.',
    accent: '#C62828',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: '/mindset-resilience',
    label: 'Mental & Emotional',
    sub: 'Confidential therapy, critical incident resources, and coping strategies.',
    accent: '#2563A8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    to: '/physical-fitness',
    label: 'Physical Fitness',
    sub: 'Gyms, classes, physical therapy, and wellness services across Butte County.',
    accent: '#C9A84C',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5v11M17.5 6.5v11"/>
        <rect x="3.5" y="8.5" width="4" height="7" rx="1"/>
        <rect x="16.5" y="8.5" width="4" height="7" rx="1"/>
        <line x1="7.5" y1="12" x2="16.5" y2="12"/>
      </svg>
    ),
  },
  {
    to: '/family-resources',
    label: 'Family Resources',
    sub: 'Support, events, and newsletters for the families of first responders.',
    accent: '#0B1F4A',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: '/news-events',
    label: 'News & Events',
    sub: 'Upcoming wellness events, training opportunities, and unit news.',
    accent: '#C62828',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    to: '/about',
    label: 'About the Unit',
    sub: 'Meet the Wellness Unit team and learn about the program.',
    accent: '#C9A84C',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
]

function ResourceRow({ section, index }) {
  const ref = useReveal(index * 65)
  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <Link
        to={section.to}
        className="flex items-center gap-4 px-4 py-4 active:scale-[0.985] active:opacity-80"
        style={{ transition: 'transform 0.15s cubic-bezier(0.32,0.72,0,1), opacity 0.2s cubic-bezier(0.32,0.72,0,1)' }}
      >
        <div className="w-[3px] self-stretch rounded-full shrink-0" style={{ backgroundColor: section.accent }} />
        <div
          className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
          style={{ backgroundColor: `${section.accent}14`, color: section.accent }}
        >
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-navy text-[14px] leading-snug">{section.label}</p>
          <p className="font-sans text-[12px] text-navy/45 leading-relaxed mt-0.5">{section.sub}</p>
        </div>
        <span className="font-sans text-navy/35 text-sm shrink-0">→</span>
      </Link>
    </div>
  )
}

export default function Resources() {
  const headerRef = useReveal(0)

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
            All Programs
          </span>
          <h1
            className="font-display text-cream uppercase leading-[0.9] tracking-wide"
            style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
          >
            Wellness<br />Resources
          </h1>
          <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
            Programs and services available to Butte County first responders and their families.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.4 }}
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 px-4 pt-5 pb-nav">

        {/* Get Help Now — always at the top */}
        <Link
          to="/get-help"
          className="rounded-[1.5rem] p-[5px] block active:opacity-90"
          style={{
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.2)',
            transition: 'opacity 0.2s cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <div
            className="rounded-[calc(1.5rem-5px)] bg-navy flex items-center justify-between px-5 py-4"
            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}
          >
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-0.5" style={{ color: 'rgba(201,168,76,0.65)' }}>
                24/7 Confidential
              </p>
              <p className="font-sans font-semibold text-cream text-[15px] leading-snug">Get Help Now</p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#C9A84C' }}
            >
              <span className="text-navy font-semibold text-sm">→</span>
            </div>
          </div>
        </Link>

        {/* Section divider */}
        <div className="flex items-center gap-3 px-1 mt-1">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">Programs</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
        </div>

        {SECTIONS.map((s, i) => (
          <ResourceRow key={s.to} section={s} index={i} />
        ))}
      </div>

    </div>
  )
}
