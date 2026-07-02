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

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
  </svg>
)

const NewsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
    <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
  </svg>
)

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T12:00:00') // noon local to avoid timezone-shift-to-prev-day
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
}

function isPast(dateStr) {
  if (!dateStr) return false
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(dateStr + 'T00:00:00') < today
}

function EventCard({ event, index }) {
  const ref = useReveal(index * 70)
  const past = isPast(event.event_date)

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)', opacity: past ? 0.65 : 1 }}
    >
      {event.cover_image_url && (
        <div className="w-full h-44 overflow-hidden bg-navy/10">
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.parentElement.style.display = 'none' }}
          />
        </div>
      )}

      <div className="flex">
        <div
          className="w-[3px] shrink-0"
          style={{ backgroundColor: past ? 'rgba(11,31,74,0.25)' : '#C9A84C',
                   borderRadius: event.cover_image_url ? '0 0 0 1rem' : '1rem 0 0 1rem' }}
        />
        <div className="flex-1 min-w-0 p-4">
          {past && (
            <span
              className="inline-block rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide mb-2"
              style={{ backgroundColor: 'rgba(11,31,74,0.07)', color: 'rgba(11,31,74,0.4)' }}
            >
              Past event
            </span>
          )}
          <p className="font-sans font-semibold text-navy text-[15px] leading-snug">{event.title}</p>
          {(event.event_date || event.event_time) && (
            <div className="flex items-center gap-1.5 mt-2" style={{ color: past ? 'rgba(11,31,74,0.35)' : '#C9A84C' }}>
              <CalendarIcon />
              <span className="font-sans text-[12px] font-medium">
                {[formatDate(event.event_date), event.event_time].filter(Boolean).join(' · ')}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5 mt-1.5" style={{ color: 'rgba(11,31,74,0.4)' }}>
              <PinIcon />
              <span className="font-sans text-[12px]">{event.location}</span>
            </div>
          )}
          {event.description && (
            <p className="font-sans text-[13px] text-navy/55 leading-relaxed mt-3">{event.description}</p>
          )}
          {event.registration_url && !past && (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-[12px] font-semibold mt-3 active:scale-[0.97]"
              style={{ backgroundColor: '#C9A84C', color: '#0B1F4A', transition: 'transform 0.15s cubic-bezier(0.32,0.72,0,1)' }}
            >
              Register <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, index }) {
  const ref = useReveal(index * 70)

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      {article.photo_url && (
        <div className="w-full h-44 overflow-hidden bg-navy/10">
          <img
            src={article.photo_url}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.parentElement.style.display = 'none' }}
          />
        </div>
      )}

      <div className="flex">
        <div
          className="w-[3px] shrink-0"
          style={{ backgroundColor: '#2563A8',
                   borderRadius: article.photo_url ? '0 0 0 1rem' : '1rem 0 0 1rem' }}
        />
        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-center gap-1.5 mb-2" style={{ color: '#2563A8' }}>
            <NewsIcon />
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em]">News</span>
          </div>
          <p className="font-sans font-semibold text-navy text-[15px] leading-snug">{article.title}</p>
          {article.body && (
            <p className="font-sans text-[13px] text-navy/55 leading-relaxed mt-3 whitespace-pre-line">{article.body}</p>
          )}
          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-[12px] font-semibold mt-3 active:scale-[0.97]"
              style={{ backgroundColor: 'rgba(37,99,168,0.1)', color: '#2563A8', transition: 'transform 0.15s cubic-bezier(0.32,0.72,0,1)' }}
            >
              Read more <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewsEvents() {
  const headerRef = useReveal(0)
  const [events, setEvents]     = useState(null)
  const [articles, setArticles] = useState(null)
  const [error, setError]       = useState(null)

  useEffect(() => {
    // Fetch events and articles in parallel
    Promise.all([
      supabase.from('events').select('*').eq('is_active', true).order('event_date', { ascending: true }),
      supabase.from('articles').select('*').eq('is_active', true).order('created_at', { ascending: false }),
    ]).then(([evRes, arRes]) => {
      if (evRes.error) { setError(evRes.error.message); return }
      if (arRes.error) { setError(arRes.error.message); return }
      setEvents(evRes.data || [])
      setArticles(arRes.data || [])
    })
  }, [])

  const loading  = events === null || articles === null
  const upcoming = (events || []).filter(e => !isPast(e.event_date) || !e.event_date)
  const past     = (events || []).filter(e => isPast(e.event_date))
  const hasContent = (events || []).length > 0 || (articles || []).length > 0

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
            Latest
          </span>
          <h1
            className="font-display text-cream uppercase leading-[0.9] tracking-wide"
            style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
          >
            News &amp;<br />Events
          </h1>
          <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
            Wellness events, trainings, and news from the Butte Strong Unit.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.4 }}
        />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-5 pb-nav">

        {loading && !error && Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
        {error && <ErrorState message="Unable to load news and events. Please try again." />}

        {!loading && !hasContent && (
          <div
            className="rounded-[1.25rem] p-[5px]"
            style={{ background: 'rgba(11,31,74,0.04)', border: '1px solid rgba(11,31,74,0.07)' }}
          >
            <div className="rounded-[calc(1.25rem-5px)] bg-white px-5 py-8 text-center" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
              <p className="font-sans text-[13px] text-navy/45 leading-relaxed">
                No upcoming events right now. Check back soon or sign up for the family newsletter to stay current.
              </p>
            </div>
          </div>
        )}

        {/* Upcoming events */}
        {!loading && upcoming.length > 0 && (
          <>
            <SectionDivider label="Upcoming Events" />
            {upcoming.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </>
        )}

        {/* News articles */}
        {!loading && articles && articles.length > 0 && (
          <>
            <SectionDivider label="News" />
            {articles.map((a, i) => <ArticleCard key={a.id} article={a} index={i} />)}
          </>
        )}

        {/* Past events */}
        {!loading && past.length > 0 && (
          <>
            <div className="flex items-center gap-3 px-1 mt-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/30 font-semibold whitespace-nowrap">Past Events</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(11,31,74,0.07)' }} />
            </div>
            {past.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </>
        )}

      </div>
    </div>
  )
}
