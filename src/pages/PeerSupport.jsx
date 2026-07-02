import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import SkeletonCard from '../components/SkeletonCard'
import ErrorState from '../components/ErrorState'

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

function initials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

// ── Data now fetched live from Supabase peer_support_members table ──────────

// ──────────────────────────────────────────────────────────────────────────────

const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const EmailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s cubic-bezier(0.32,0.72,0,1)' }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

function MemberCard({ member, accent, index }) {
  const [bioOpen, setBioOpen] = useState(false)
  const ref = useReveal(index * 55)
  const hasBio = member.bio || member.experience

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      {/* Left accent bar */}
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: accent }} />

        <div className="flex-1 min-w-0">
          {/* Top row: avatar + name/agency + contact */}
          <div className="flex items-start gap-3 p-4">
            {/* Avatar */}
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-display text-lg"
                style={{ backgroundColor: `${accent}18`, color: accent }}
              >
                {initials(member.name)}
              </div>
            )}

            {/* Name + agency + contact */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans font-semibold text-navy text-[15px] leading-snug">
                  {member.name}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide"
                  style={{ backgroundColor: `${accent}18`, color: accent }}
                >
                  {member.agency}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-1.5 font-sans text-[12px] font-medium"
                    style={{ color: accent, minHeight: '28px' }}
                  >
                    <PhoneIcon />
                    {member.phone}
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1.5 font-sans text-[12px] font-medium text-blue truncate"
                    style={{ minHeight: '28px' }}
                  >
                    <EmailIcon />
                    <span className="truncate">{member.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bio toggle */}
          {hasBio && (
            <>
              <button
                onClick={() => setBioOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                style={{
                  borderTop: '1px solid rgba(11,31,74,0.06)',
                  minHeight: '44px',
                  backgroundColor: bioOpen ? `${accent}08` : 'transparent',
                  transition: 'background-color 0.2s cubic-bezier(0.32,0.72,0,1)',
                }}
              >
                <span
                  className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em]"
                  style={{ color: bioOpen ? accent : 'rgba(11,31,74,0.35)' }}
                >
                  {bioOpen ? 'Hide Bio' : 'View Bio'}
                </span>
                <span style={{ color: bioOpen ? accent : 'rgba(11,31,74,0.3)' }}>
                  <ChevronIcon open={bioOpen} />
                </span>
              </button>

              {bioOpen && (
                <div
                  className="px-4 pb-4"
                  style={{
                    borderTop: `1px solid ${accent}18`,
                    animation: 'fadeSlideIn 0.25s cubic-bezier(0.32,0.72,0,1)',
                  }}
                >
                  {member.bio && (
                    <p className="font-sans text-[13px] text-navy/60 leading-relaxed mt-3">
                      {member.bio}
                    </p>
                  )}
                  {member.experience && (
                    <>
                      <p
                        className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold mt-3 mb-1.5"
                        style={{ color: accent, opacity: 0.7 }}
                      >
                        Areas of Experience
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.experience.split(',').map(e => e.trim()).filter(Boolean).map((exp, i) => (
                          <span
                            key={i}
                            className="rounded-full px-2.5 py-1 font-sans text-[11px] font-medium"
                            style={{ backgroundColor: `${accent}14`, color: accent }}
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ label, delay }) {
  const ref = useReveal(delay)
  return (
    <div ref={ref} className="flex items-center gap-3 px-1 mt-2">
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
    </div>
  )
}

const ACCENT = '#C62828'

export default function PeerSupport() {
  const headerRef = useReveal(0)
  const missionRef = useReveal(80)
  const [members, setMembers] = useState([])
  const [chaplains, setChaplains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMembers() {
      const { data, error: err } = await supabase
        .from('peer_support_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (err) { setError(err.message); setLoading(false); return }
      const rows = data.map(r => ({ ...r, photo: r.photo_url }))
      setMembers(rows.filter(r => !r.is_chaplain))
      setChaplains(rows.filter(r => r.is_chaplain))
      setLoading(false)
    }
    fetchMembers()
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
              Resources
            </span>
            <h1
              className="font-display text-cream uppercase leading-[0.9] tracking-wide"
              style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
            >
              Peer<br />Support
            </h1>
            <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
              Confidential support from those who understand what first responders carry.
            </p>
          </div>

          <div
            className="absolute bottom-0 left-6 right-6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.4 }}
          />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 px-4 pt-5 pb-nav">

          {/* Mission card */}
          <div
            ref={missionRef}
            className="rounded-[1.25rem] p-[5px]"
            style={{ background: 'rgba(11,31,74,0.04)', border: '1px solid rgba(11,31,74,0.07)' }}
          >
            <div
              className="rounded-[calc(1.25rem-5px)] bg-white px-5 py-4"
              style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-navy/30 mb-2">Our Mission</p>
              <p className="font-sans text-[13px] text-navy/65 leading-relaxed">
                The mission of the Butte County Peer Support team is to provide all members of the Butte County first responder community and their families the opportunity to receive emotional and tangible peer support through times of personal or professional crisis, and to help anticipate and address potential difficulties. The Peer Support Team is made up of trained colleagues who are available to help augment existing employee assistance resources — not replace them.
              </p>
            </div>
          </div>

          {/* Peer Support Members */}
          <SectionLabel label="Peer Support Members" delay={100} />
          {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          {error && <ErrorState message="Unable to load peer support members. Please try again." />}
          {!loading && !error && members.map((m, i) => (
            <MemberCard key={m.id} member={m} accent={ACCENT} index={i} />
          ))}

          {/* Chaplains */}
          {!loading && !error && (
            <>
              <SectionLabel label="Chaplains" delay={0} />
              {chaplains.map((m, i) => (
                <MemberCard key={m.id} member={m} accent="#C9A84C" index={i} />
              ))}
            </>
          )}

        </div>
      </div>
    </>
  )
}
