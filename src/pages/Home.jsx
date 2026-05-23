import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function useReveal(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = `opacity 0.75s cubic-bezier(0.32,0.72,0,1) ${delay}ms, transform 0.75s cubic-bezier(0.32,0.72,0,1) ${delay}ms`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return ref
}

const resources = [
  { label: 'Peer Support',         sub: 'Talk to someone',         accent: '#1A8A72', to: '/peer-support',         icon: '⟳' },
  { label: 'Mindset & Resilience', sub: 'Mental wellness',         accent: '#2563A8', to: '/mindset-resilience',   icon: '◈' },
  { label: 'Physical Fitness',     sub: 'Stay strong',             accent: '#C9A84C', to: '/physical-fitness',     icon: '◇' },
  { label: 'Family Resources',     sub: 'Support at home',         accent: '#0B1F4A', to: '/family-resources',     icon: '◉' },
]

function ResourceCard({ resource, delay }) {
  const ref = useReveal(delay)
  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <Link
        to={resource.to}
        className="flex flex-col gap-2 p-4 pl-5 relative h-full active:opacity-80 active:scale-[0.97]"
        style={{ transition: 'opacity 0.2s cubic-bezier(0.32,0.72,0,1), transform 0.15s cubic-bezier(0.32,0.72,0,1)' }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
          style={{ backgroundColor: resource.accent }}
        />
        <span className="text-xl leading-none mt-0.5">{resource.icon}</span>
        <div>
          <p className="font-sans font-semibold text-navy text-sm leading-snug">{resource.label}</p>
          <p className="font-sans text-[11px] mt-0.5" style={{ color: resource.accent, opacity: 0.8 }}>
            {resource.sub}
          </p>
        </div>
        <span className="text-xs font-sans text-navy/35 mt-auto">→</span>
      </Link>
    </div>
  )
}

export default function Home() {
  const ctaRef    = useReveal(0)
  const labelRef  = useReveal(60)
  const newsRef   = useReveal(120)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream">

      {/* ── Hero ── */}
      <div className="relative bg-navy pt-14 pb-12 px-6 overflow-hidden">
        {/* Warm radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 55% at 20% 110%, rgba(201,168,76,0.13) 0%, transparent 68%)',
          }}
        />

        {/* Eyebrow pill */}
        <div className="relative z-10 mb-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.22em] font-medium"
            style={{ border: '1px solid rgba(201,168,76,0.35)', color: 'rgba(201,168,76,0.85)' }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: '#C9A84C', opacity: 0.7 }}
            />
            Butte County
          </span>
        </div>

        {/* Display heading */}
        <h1
          className="relative z-10 font-display text-cream uppercase leading-[0.9] tracking-wide"
          style={{ fontSize: 'clamp(3.5rem, 16vw, 5rem)' }}
        >
          Butte<br />Strong<br />Wellness
        </h1>

        <p className="relative z-10 mt-4 font-sans text-[13px] leading-relaxed" style={{ color: 'rgba(244,242,238,0.45)' }}>
          Confidential support for those who serve<br />Butte County — and the families who stand beside them.
        </p>

        {/* Gold hairline divider */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #C9A84C 35%, #C9A84C 65%, transparent 100%)',
            opacity: 0.45,
          }}
        />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-4 px-4 pt-5 pb-24">

        {/* CTA — double-bezel card */}
        <div
          ref={ctaRef}
          className="rounded-[1.5rem] p-[5px]"
          style={{
            background: 'rgba(11,31,74,0.04)',
            border: '1px solid rgba(11,31,74,0.07)',
          }}
        >
          <div
            className="rounded-[calc(1.5rem-5px)] bg-white px-5 py-5"
            style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium text-navy/35 mb-1">
              Need support?
            </p>
            <h2 className="font-sans font-semibold text-navy text-[1.25rem] leading-snug">
              Get Help Now
            </h2>
            <p className="font-sans text-[13px] text-navy/45 leading-relaxed mt-1.5 mb-4">
              24/7 confidential support for first responders and their families across Butte County.
            </p>

            {/* Button-in-button CTA */}
            <Link
              to="/get-help"
              className="group flex items-center justify-between rounded-full px-5 py-3 active:scale-[0.97]"
              style={{
                backgroundColor: '#C9A84C',
                transition: 'all 0.45s cubic-bezier(0.32,0.72,0,1)',
              }}
            >
              <span className="font-sans font-semibold text-navy text-[13px]">
                Reach out confidentially
              </span>
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center ml-2 shrink-0"
                style={{
                  backgroundColor: 'rgba(11,31,74,0.12)',
                  transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
                }}
              >
                <span className="text-navy text-xs font-medium">→</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Section divider */}
        <div ref={labelRef} className="flex items-center gap-3 px-1 mt-1">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-medium whitespace-nowrap">
            Resources
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
        </div>

        {/* 2×2 Resource grid */}
        <div className="grid grid-cols-2 gap-3">
          {resources.map((r, i) => (
            <ResourceCard key={r.to} resource={r} delay={i * 55} />
          ))}
        </div>

        {/* News & Events — double-bezel, dark */}
        <div
          ref={newsRef}
          className="rounded-[1.5rem] p-[5px]"
          style={{
            background: 'rgba(11,31,74,0.06)',
            border: '1px solid rgba(11,31,74,0.08)',
          }}
        >
          <Link
            to="/news-events"
            className="rounded-[calc(1.5rem-5px)] bg-navy block px-5 py-6 relative overflow-hidden active:opacity-90"
            style={{
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)',
              transition: 'opacity 0.3s cubic-bezier(0.32,0.72,0,1)',
            }}
          >
            {/* Subtle warm glow bottom-right */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 90% 70% at 100% 100%, rgba(201,168,76,0.14) 0%, transparent 65%)',
              }}
            />

            <p
              className="relative font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-2"
              style={{ color: 'rgba(201,168,76,0.6)' }}
            >
              Latest
            </p>
            <h3
              className="relative font-display text-cream uppercase leading-[0.92] tracking-wide"
              style={{ fontSize: 'clamp(2.2rem,10vw,2.8rem)' }}
            >
              News &amp;<br />Events
            </h3>

            <div
              className="relative inline-flex items-center gap-2 rounded-full mt-4 px-4 py-1.5"
              style={{ border: '1px solid rgba(201,168,76,0.28)' }}
            >
              <span
                className="font-sans text-[12px] font-medium"
                style={{ color: 'rgba(201,168,76,0.75)' }}
              >
                View all updates
              </span>
              <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '12px' }}>→</span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  )
}
