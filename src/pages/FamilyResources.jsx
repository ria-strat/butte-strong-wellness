import { useEffect, useRef } from 'react'

const ACCENT = '#C62828'

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

const ExternalLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
  </svg>
)

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const RESOURCES = [
  {
    id: 1,
    icon: <HeartIcon />,
    title: 'Family Support Overview',
    body: 'The Butte Strong Wellness Unit is committed to supporting the families of our First Responders. The sacrifices you and your loved ones make for our community do not go unnoticed. We hope these resources can provide support, encouragement, and fun for you and those that matter most.',
    cta: null,
  },
  {
    id: 2,
    icon: <MailIcon />,
    title: 'Family Newsletter',
    body: 'Sign up for our family newsletter mailing list to stay informed about events, resources, and updates from the Butte Strong Wellness Unit.',
    cta: {
      label: 'Sign Up for Newsletter',
      url: 'https://forms.gle/wHkL3f7C62uSzKvAA',
    },
  },
  {
    id: 3,
    icon: <CalendarIcon />,
    title: 'Family Events',
    body: 'The Wellness Unit plans family outreach events throughout the year for first responder families. Check back here or sign up for the newsletter to stay current on upcoming events.',
    cta: null,
  },
]

function ContactCard({ name, role, phone, email, index }) {
  const ref = useReveal(index * 70)
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: ACCENT }} />
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-display text-lg"
              style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-navy text-[15px] leading-snug">{name}</p>
              <p className="font-sans text-[11px] text-navy/40 mt-0.5">{role}</p>
              <div className="flex flex-col gap-1.5 mt-2">
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-1.5 font-sans text-[12px] font-medium"
                    style={{ color: ACCENT, minHeight: '28px' }}
                  >
                    <PhoneIcon />{phone}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 font-sans text-[12px] font-medium truncate"
                    style={{ color: ACCENT, minHeight: '28px' }}
                  >
                    <EmailIcon /><span className="truncate">{email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResourceCard({ resource, index }) {
  const ref = useReveal(index * 70)

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: ACCENT }} />
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
              style={{ backgroundColor: `${ACCENT}18`, color: ACCENT }}
            >
              {resource.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-navy text-[14px] leading-snug">{resource.title}</p>
              <p className="font-sans text-[13px] text-navy/55 leading-relaxed mt-1.5">{resource.body}</p>
              {resource.cta && (
                <a
                  href={resource.cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[11px] font-semibold mt-3 cursor-pointer"
                  style={{ border: `1px solid ${ACCENT}40`, color: ACCENT, backgroundColor: `${ACCENT}08` }}
                >
                  {resource.cta.label} <ExternalLinkIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FamilyResources() {
  const headerRef = useReveal(0)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream">

      <div className="relative bg-navy pt-14 pb-8 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 0% 100%, rgba(26,138,114,0.15) 0%, transparent 65%)' }}
        />
        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: ACCENT }} />

        <div ref={headerRef} className="relative z-10">
          <span
            className="inline-block rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
            style={{ border: '1px solid rgba(26,138,114,0.4)', color: 'rgba(26,138,114,0.85)' }}
          >
            Resources
          </span>
          <h1
            className="font-display text-cream uppercase leading-[0.9] tracking-wide"
            style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
          >
            Family<br />Support
          </h1>
          <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
            Resources, events, and support for the families of Butte County first responders.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${ACCENT} 40%, ${ACCENT} 60%, transparent 100%)`, opacity: 0.35 }}
        />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-5 pb-24">
        {RESOURCES.map((r, i) => (
          <ResourceCard key={r.id} resource={r} index={i} />
        ))}

        {/* Point of contact */}
        <div className="flex items-center gap-3 px-1 mt-2">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">Point of Contact</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
        </div>

        <ContactCard
          name="Mandy Barrow"
          role="Family Engagement Specialist"
          phone="(949) 338-4553"
          email="mandyjoybarrow@yahoo.com"
          index={RESOURCES.length}
        />
      </div>
    </div>
  )
}
