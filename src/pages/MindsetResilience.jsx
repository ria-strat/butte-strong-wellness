import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import SkeletonCard from '../components/SkeletonCard'
import ErrorState from '../components/ErrorState'

const ACCENT = '#2563A8'

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

const RESOURCES = [
  {
    id: 'ci',
    title: 'Understanding Critical Incidents',
    content: 'A critical incident is any incident or event that has the emotional power to overwhelm one\'s usual ability to cope. Approximately 80–85% of those exposed to a critical incident will experience a critical incident stress reaction within 24 hours.\n\nCritical incidents may include: line of duty death or serious injury, co-worker suicide, death or violence to a child, threat of injury to rescuer, disasters with multi-casualty incidents, or incidents with heavy media attention.\n\nFactors that may heighten stress: sights, smells & sounds, suddenness, intensity, duration, identification with the victim, and night time or holiday season.',
  },
  {
    id: 'cr',
    title: 'Stress Reactions to Know',
    content: 'Immediate reactions may include: memory loss, muscle tremors/twitches, nausea or GI symptoms, anxiety and feeling overwhelmed, profuse sweating or chills, sleep disturbances or nightmares, dizziness or fatigue, crying, intrusive thoughts, feelings of self-blame, change in normal behavior, and increased use of drugs or alcohol.\n\nDelayed reactions may include: intrusive memories and images, feelings of vulnerability and lack of control, persistent physical and emotional symptoms, personality changes, and compulsive behaviors.',
  },
  {
    id: 'cs',
    title: 'Coping Strategies',
    content: 'Stress reduction takes practice. Some strategies:\n\n• Deep breathing: 4 seconds in → 4 second pause → 4 seconds out → 4 second pause\n• Eat nutritiously — fruit, veggies, fiber\n• Stay rested. Nightmares are a common reaction to trauma and often resolve in a few days\n• Accept diversion. Do something you enjoy. It\'s normal for painful thoughts to surface — gradually you will gain more control over intrusive thoughts\n• Share thoughts and feelings with someone you trust\n• Avoid alcohol and drugs as means of relaxing — they are not useful to the body when coping with stress\n• Recognize survivor guilt for what it is: an irrational thought. It is OK to have survived\n• Accept the jitters that come with reminders of an incident — these are normal and will go away with time\n• If needed, ask for professional help. It takes courage to work with a professional to face your own pain. Be proud of yourself, not apologetic',
  },
]

const PhoneIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const EmailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
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

function TherapistCard({ therapist, index }) {
  const [open, setOpen] = useState(false)
  const ref = useReveal(index * 55)

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: ACCENT }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 p-4">
            <div
              className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-display text-lg"
              style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}
            >
              {initials(therapist.name)}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-sans font-semibold text-navy text-[15px] leading-snug block">{therapist.name}</span>
              <p className="font-sans text-[11px] text-navy/40 mt-0.5">{therapist.title}</p>
              <div className="flex flex-col gap-1 mt-2">
                {therapist.phone && (
                  <a href={`tel:${therapist.phone}`} className="flex items-center gap-1.5 font-sans text-[12px] font-medium" style={{ color: ACCENT, minHeight: '28px' }}>
                    <PhoneIcon />{therapist.phone}
                  </a>
                )}
                {therapist.email && (
                  <a href={`mailto:${therapist.email}`} className="flex items-center gap-1.5 font-sans text-[12px] font-medium truncate" style={{ color: ACCENT, minHeight: '28px' }}>
                    <EmailIcon /><span className="truncate">{therapist.email}</span>
                  </a>
                )}
                {therapist.address && (
                  <div className="flex items-start gap-1.5 font-sans text-[12px] text-navy/45 mt-0.5">
                    <MapPinIcon /><span>{therapist.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
            style={{
              borderTop: '1px solid rgba(11,31,74,0.06)',
              minHeight: '44px',
              backgroundColor: open ? `${ACCENT}08` : 'transparent',
              transition: 'background-color 0.2s cubic-bezier(0.32,0.72,0,1)',
            }}
          >
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: open ? ACCENT : 'rgba(11,31,74,0.35)' }}>
              {open ? 'Hide Bio' : 'View Bio'}
            </span>
            <span style={{ color: open ? ACCENT : 'rgba(11,31,74,0.3)' }}><ChevronIcon open={open} /></span>
          </button>

          {open && (
            <div className="px-4 pb-4" style={{ borderTop: `1px solid ${ACCENT}18`, animation: 'fadeSlideIn 0.25s cubic-bezier(0.32,0.72,0,1)' }}>
              {therapist.quote && (
                <blockquote className="font-sans text-[12px] italic leading-relaxed mt-3 mb-2 pl-3" style={{ borderLeft: `2px solid ${ACCENT}40`, color: 'rgba(11,31,74,0.55)' }}>
                  "{therapist.quote}"
                </blockquote>
              )}
              <p className="font-sans text-[13px] text-navy/60 leading-relaxed mt-3">{therapist.bio}</p>
              {therapist.insurance && (
                <>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold mt-3 mb-1" style={{ color: ACCENT, opacity: 0.7 }}>
                    Insurance / Payment
                  </p>
                  <p className="font-sans text-[12px] text-navy/50 leading-relaxed">{therapist.insurance}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResourceAccordion({ item, index }) {
  const [open, setOpen] = useState(false)
  const ref = useReveal(index * 50)

  return (
    <div ref={ref} className="rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}>
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: ACCENT }} />
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-center justify-between gap-3 px-4 py-4 cursor-pointer text-left"
            style={{ minHeight: '52px' }}
          >
            <span className="font-sans font-semibold text-navy text-[14px] leading-snug">{item.title}</span>
            <span style={{ color: open ? ACCENT : 'rgba(11,31,74,0.3)', transition: 'color 0.2s cubic-bezier(0.32,0.72,0,1)', flexShrink: 0 }}>
              <ChevronIcon open={open} />
            </span>
          </button>
          {open && (
            <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(11,31,74,0.06)', animation: 'fadeSlideIn 0.25s cubic-bezier(0.32,0.72,0,1)' }}>
              <p className="font-sans text-[13px] text-navy/60 leading-relaxed mt-3 whitespace-pre-line">{item.content}</p>
            </div>
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
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
    </div>
  )
}

export default function MindsetResilience() {
  const headerRef = useReveal(0)
  const introRef = useReveal(80)
  const [therapists, setTherapists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTherapists() {
      const { data, error: err } = await supabase
        .from('therapists')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (err) { setError(err.message); setLoading(false); return }
      setTherapists(data)
      setLoading(false)
    }
    fetchTherapists()
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

        <div className="relative bg-navy pt-14 pb-8 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 0% 100%, rgba(37,99,168,0.18) 0%, transparent 65%)' }} />
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: ACCENT }} />

          <div ref={headerRef} className="relative z-10">
            <span className="inline-block rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-3" style={{ border: '1px solid rgba(37,99,168,0.4)', color: 'rgba(37,99,168,0.85)' }}>
              Resources
            </span>
            <h1 className="font-display text-cream uppercase leading-[0.9] tracking-wide" style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}>
              Mental &amp;<br />Emotional
            </h1>
            <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
              Confidential therapy services, critical incident resources, and coping tools for first responders and their families.
            </p>
          </div>

          <div className="absolute bottom-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 40%, ${ACCENT} 60%, transparent 100%)`, opacity: 0.35 }} />
        </div>

        <div className="flex flex-col gap-3 px-4 pt-5 pb-nav">

          <div ref={introRef} className="rounded-[1.25rem] p-[5px]" style={{ background: 'rgba(11,31,74,0.04)', border: '1px solid rgba(11,31,74,0.07)' }}>
            <div className="rounded-[calc(1.25rem-5px)] bg-white px-5 py-4" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-navy/30 mb-2">Therapy Services</p>
              <p className="font-sans text-[13px] text-navy/65 leading-relaxed">
                The Butte County First Responder Wellness Unit offers mental health resources for staff, volunteers, and immediate family members. Each individual receives up to 6 sessions with a contracted therapist at no cost.
              </p>
              <p className="font-sans text-[12px] text-navy/45 leading-relaxed mt-2">
                Select a provider and contact them directly. Identify yourself and your connection to the Wellness Unit — that's it. Services are fully confidential.
              </p>
            </div>
          </div>

          <SectionLabel label="Contracted Therapists" delay={100} />
          {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          {error && <ErrorState message="Unable to load therapist directory. Please try again." />}
          {!loading && !error && therapists.map((t, i) => (
            <TherapistCard key={t.id} therapist={t} index={i} />
          ))}

          <SectionLabel label="Critical Incident Resources" delay={0} />
          {RESOURCES.map((r, i) => (
            <ResourceAccordion key={r.id} item={r} index={i} />
          ))}

        </div>
      </div>
    </>
  )
}
