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

// Advisory Committee members (peer support leads who serve on the oversight committee)
const ADVISORY = [
  {
    id: 'a4',
    name: 'Miranda Pierce',
    agency: 'CPD',
    role: 'Detective',
    phone: '916-947-0356',
    email: 'miranda.pierce@chicoca.gov',
    bio: 'Officer with the Chico Police Department for approximately 6 years. Currently a Detective. My background is in Psychology and Behavioral Analysis. Family comes first with me and I enjoy helping those around me to get home safely to theirs.',
    experience: 'In the first 5 years in your career, Experienced a critical incident, Parenting, Divorce, Loss of spouse, Mental health in your family',
    accent: '#1A8A72',
  },
  {
    id: 'a5',
    name: 'Melody Brown',
    agency: 'BEMS',
    role: 'Deputy Chief of Operations & HR',
    phone: '530-720-7503',
    email: 'Mbrown@bcems.org',
    bio: 'I have been in and around EMS since 2004. I started my 911 career with Butte County EMS in 2007 and have been a paramedic since 2008. I worked as a paramedic and field training officer full-time until 2017 when I also took on the role of Health and Safety Officer. After the Camp Fire, I also took on the role of Human Resources and Education. Now I am the Deputy Chief of Operations and HR.',
    experience: 'In the first 5 years in your career, Lifelong career (over 15 years), Experienced a critical incident, Mental health in your family, Injury',
    accent: '#2563A8',
  },
  {
    id: 'a6',
    name: 'Ken Smith',
    agency: 'CFD',
    role: 'Firefighter',
    phone: '530-624-2922',
    email: 'ken.smith@chicoca.gov',
    bio: 'Been in the fire service 30 years — 26 years with Chico Fire as a volunteer and career Firefighter. I have a true passion for peer support and promoting a positive vibe in the often negative environment that we serve in. My personal goal is to help others have a healthy balance of work and play, while putting family first.',
    experience: 'Lifelong career (over 15 years), Experienced a critical incident, Parenting, Finances, Substance use in your family, Mental health in your family, Injury',
    accent: '#C9A84C',
  },
  {
    id: 'a7',
    name: 'John Nickelson',
    agency: 'CPD',
    role: 'Police Officer',
    phone: '530-720-3744',
    email: 'john.nickelson@chicoca.gov',
    bio: 'I have been a police officer since February 2012. In my first 4 years, I was involved in 2 shootings, one of which my partner was hit. I became interested in officer wellness due to the care that my fellow colleagues showed me, and from support I received through Butte County Critical Incident Stress Management. My goal is to help others navigate critical incidents during their careers.',
    experience: 'Experienced a Critical Incident',
    accent: '#0B1F4A',
  },
  {
    id: 'a8',
    name: 'Christopher B Nicodemus',
    agency: 'CSPD',
    role: 'Officer · LEA Instructor',
    phone: '530-570-8743',
    email: 'cnicodemus@csuchico.edu',
    bio: 'I have been in law enforcement for 22 years and worked for the Oroville Police Department, Butte County Sheriff\'s Office, and California State University, Chico Police Department. I also teach at the Butte College Law Enforcement Academy. I have seen firsthand the importance of improving peer support and wellness programs at my agency and those I previously worked for.',
    experience: 'Lifelong career (over 15 years), Experienced a critical incident, Experienced an OIS, Parenting',
    accent: '#1A8A72',
  },
  {
    id: 'a9',
    name: 'Alex Duenas',
    agency: 'BCPD',
    role: 'Probation Department',
    phone: '916-899-8160',
    email: 'aduenas@buttecounty.net',
    bio: 'I have worked with the Butte County Probation Department for 11 years and have seen what this type of work can do to us who work in this field. I want everyone to be healthy and well and to be the best version of themselves — healthy not only for those they serve, but most importantly, their families and their life outside of work.',
    experience: 'In the first 5 years in your career, Parenting, Finances, Substance use in your family, Mental health in your family, Injury',
    accent: '#2563A8',
  },
]

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

function TeamCard({ member, index }) {
  const [open, setOpen] = useState(false)
  const ref = useReveal(index * 60)

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: member.accent }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 p-4">
            <div
              className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-display text-lg"
              style={{ backgroundColor: `${member.accent}18`, color: member.accent }}
            >
              {initials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans font-semibold text-navy text-[15px] leading-snug">{member.name}</span>
                {member.agency && (
                  <span
                    className="rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: `${member.accent}18`, color: member.accent }}
                  >
                    {member.agency}
                  </span>
                )}
              </div>
              <p className="font-sans text-[11px] text-navy/40 mt-0.5">{member.role}</p>
              <div className="flex flex-col gap-1.5 mt-2">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-1.5 font-sans text-[12px] font-medium"
                    style={{ color: member.accent, minHeight: '28px' }}
                  >
                    <PhoneIcon />{member.phone}
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1.5 font-sans text-[12px] font-medium truncate"
                    style={{ color: member.accent, minHeight: '28px' }}
                  >
                    <EmailIcon /><span className="truncate">{member.email}</span>
                  </a>
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
              backgroundColor: open ? `${member.accent}08` : 'transparent',
              transition: 'background-color 0.2s cubic-bezier(0.32,0.72,0,1)',
            }}
          >
            <span
              className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: open ? member.accent : 'rgba(11,31,74,0.35)' }}
            >
              {open ? 'Hide Bio' : 'View Bio'}
            </span>
            <span style={{ color: open ? member.accent : 'rgba(11,31,74,0.3)' }}>
              <ChevronIcon open={open} />
            </span>
          </button>

          {open && (
            <div
              className="px-4 pb-4"
              style={{ borderTop: `1px solid ${member.accent}18`, animation: 'fadeSlideIn 0.25s cubic-bezier(0.32,0.72,0,1)' }}
            >
              <p className="font-sans text-[13px] text-navy/60 leading-relaxed mt-3 whitespace-pre-line">{member.bio}</p>
              {member.experience && (
                <>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold mt-3 mb-1.5" style={{ color: member.accent, opacity: 0.7 }}>
                    Areas of Experience
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.experience.split(',').map(e => e.trim()).filter(Boolean).map((exp, i) => (
                      <span
                        key={i}
                        className="rounded-full px-2.5 py-1 font-sans text-[11px] font-medium"
                        style={{ backgroundColor: `${member.accent}14`, color: member.accent }}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const headerRef = useReveal(0)
  const overviewRef = useReveal(80)
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTeam() {
      const { data, error: err } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      if (err) { setError(err.message); setLoading(false); return }
      setTeam(data)
      setLoading(false)
    }
    fetchTeam()
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
              The Unit
            </span>
            <h1
              className="font-display text-cream uppercase leading-[0.9] tracking-wide"
              style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
            >
              Butte<br />Strong
            </h1>
            <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
              A multi-agency group dedicated to the wellness of Butte County first responders and their families.
            </p>
          </div>

          <div
            className="absolute bottom-0 left-6 right-6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.4 }}
          />
        </div>

        <div className="flex flex-col gap-3 px-4 pt-5 pb-24">

          {/* Overview */}
          <div
            ref={overviewRef}
            className="rounded-[1.25rem] p-[5px]"
            style={{ background: 'rgba(11,31,74,0.04)', border: '1px solid rgba(11,31,74,0.07)' }}
          >
            <div
              className="rounded-[calc(1.25rem-5px)] bg-white px-5 py-4"
              style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-semibold text-navy/30 mb-2">About the Unit</p>
              <p className="font-sans text-[13px] text-navy/65 leading-relaxed">
                The Butte Strong Wellness Unit is a multi-agency group dedicated to the wellness of first responders serving in agencies in Butte County and their families.
              </p>
              <p className="font-sans text-[13px] text-navy/55 leading-relaxed mt-2">
                Funding was awarded to the Butte County Sheriff's Mounted Posse through the Butte Strong Fund held at the North Valley Community Foundation. These funds provide opportunities to proactively address emotional trauma among Butte County's first responders and promote overall mental health and wellness for individuals, agencies, and families.
              </p>
            </div>
          </div>

          {/* Team section */}
          <div className="flex items-center gap-3 px-1 mt-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">Wellness Unit Team</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
          </div>

          {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          {error && <ErrorState message="Unable to load team information. Please try again." />}
          {!loading && !error && team.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}

          {ADVISORY.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}

        </div>
      </div>
    </>
  )
}
