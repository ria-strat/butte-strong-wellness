import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import SkeletonCard from '../components/SkeletonCard'
import ErrorState from '../components/ErrorState'

const ACCENT = '#C9A84C'

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

// ── Data now fetched live from Supabase fitness_categories + fitness_items ──
// ────────────────────────────────────────────────────────────────────────────

const ChevronIcon = ({ open }) => (
  <svg
    width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s cubic-bezier(0.32,0.72,0,1)', flexShrink: 0 }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l1.88-1.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
  </svg>
)

function LocationItem({ item }) {
  return (
    <div
      className="rounded-xl px-4 py-3 flex flex-col gap-2"
      style={{ backgroundColor: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.12)' }}
    >
      <p className="font-sans font-semibold text-navy text-[13px] leading-snug">{item.title}</p>
      {item.description && (
        <p className="font-sans text-[12px] text-navy/55 leading-relaxed">{item.description}</p>
      )}
      <div className="flex flex-col gap-1.5 mt-0.5">
        {item.address && (
          <div className="flex items-start gap-1.5 font-sans text-[12px] text-navy/50">
            <span className="mt-0.5" style={{ color: ACCENT }}><MapPinIcon /></span>
            {item.address}
          </div>
        )}
        {item.hours && (
          <div className="flex items-start gap-1.5 font-sans text-[12px] text-navy/50">
            <span className="mt-0.5" style={{ color: ACCENT }}><ClockIcon /></span>
            {item.hours}
          </div>
        )}
        {item.phone && (
          <a href={`tel:${item.phone}`} className="flex items-center gap-1.5 font-sans text-[12px] font-medium" style={{ color: ACCENT }}>
            <PhoneIcon />
            {item.phone}
          </a>
        )}
        {item.website && (
          <a
            href={item.website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[11px] font-semibold mt-1 cursor-pointer"
            style={{ border: `1px solid ${ACCENT}40`, color: ACCENT, backgroundColor: `${ACCENT}08` }}
          >
            Visit website <ExternalLinkIcon />
          </a>
        )}
      </div>
    </div>
  )
}

function InfoItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid rgba(201,168,76,0.1)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer text-left"
        style={{ minHeight: '44px', backgroundColor: open ? `${ACCENT}08` : 'transparent', transition: 'background-color 0.2s cubic-bezier(0.32,0.72,0,1)' }}
      >
        <span className="font-sans text-[13px] font-medium text-navy/75 pr-2">{item.title}</span>
        <span style={{ color: open ? ACCENT : 'rgba(11,31,74,0.3)' }}><ChevronIcon open={open} /></span>
      </button>
      {open && (
        <div
          className="px-4 pb-3"
          style={{ borderTop: `1px solid ${ACCENT}15`, animation: 'fadeSlideIn 0.22s cubic-bezier(0.32,0.72,0,1)' }}
        >
          <p className="font-sans text-[12px] text-navy/55 leading-relaxed mt-2">{item.content}</p>
        </div>
      )}
    </div>
  )
}

function LinkItem({ item }) {
  return (
    <a
      href={item.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer"
      style={{ minHeight: '44px', border: `1px solid ${ACCENT}30`, backgroundColor: `${ACCENT}06` }}
    >
      <span className="font-sans text-[13px] font-medium" style={{ color: ACCENT }}>{item.title}</span>
      <ExternalLinkIcon />
    </a>
  )
}

function CategoryCard({ category, index }) {
  const [open, setOpen] = useState(false)
  const ref = useReveal(index * 50)

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: '0 2px 16px rgba(11,31,74,0.07)' }}
    >
      <div className="flex">
        <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ backgroundColor: ACCENT }} />
        <div className="flex-1 min-w-0">

          {/* Header row */}
          <button
            onClick={() => setOpen(o => !o)}
            className="w-full flex items-start justify-between gap-3 px-4 py-4 cursor-pointer text-left"
            style={{ minHeight: '56px' }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-navy text-[14px] leading-snug">{category.title}</p>
              {!open && (
                <p className="font-sans text-[12px] text-navy/40 mt-0.5 leading-snug">{category.description}</p>
              )}
            </div>
            <span
              className="mt-0.5"
              style={{ color: open ? ACCENT : 'rgba(11,31,74,0.3)', transition: 'color 0.2s cubic-bezier(0.32,0.72,0,1)' }}
            >
              <ChevronIcon open={open} />
            </span>
          </button>

          {/* Expanded items */}
          {open && (
            <div
              className="flex flex-col gap-2 px-4 pb-4"
              style={{
                borderTop: '1px solid rgba(11,31,74,0.06)',
                animation: 'fadeSlideIn 0.25s cubic-bezier(0.32,0.72,0,1)',
              }}
            >
              <p className="font-sans text-[12px] text-navy/45 leading-relaxed mt-3 mb-1">{category.description}</p>
              {category.items.map(item => {
                if (item.type === 'location') return <LocationItem key={item.id} item={item} />
                if (item.type === 'link') return <LinkItem key={item.id} item={item} />
                return <InfoItem key={item.id} item={item} />
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default function PhysicalFitness() {
  const headerRef = useReveal(0)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      const { data, error: err } = await supabase
        .from('fitness_categories')
        .select('*, fitness_items(*)')
        .eq('is_active', true)
        .order('sort_order')
      if (err) { setError(err.message); setLoading(false); return }
      // Normalize: rename fitness_items → items, item_type → type
      const normalized = data.map(cat => ({
        ...cat,
        items: (cat.fitness_items || [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(item => ({ ...item, type: item.item_type })),
      }))
      setCategories(normalized)
      setLoading(false)
    }
    fetchCategories()
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
            style={{ background: 'radial-gradient(ellipse 70% 50% at 0% 100%, rgba(201,168,76,0.12) 0%, transparent 65%)' }}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: ACCENT }} />

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
              Physical<br />Fitness
            </h1>
            <p className="font-sans text-[13px] leading-relaxed mt-2" style={{ color: 'rgba(244,242,238,0.45)' }}>
              Local gyms, classes, and wellness services available to Butte County first responders.
            </p>
          </div>

          <div
            className="absolute bottom-0 left-6 right-6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)', opacity: 0.4 }}
          />
        </div>

        {/* Category list */}
        <div className="flex flex-col gap-3 px-4 pt-5 pb-24">
          {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          {error && <ErrorState message="Unable to load fitness resources. Please try again." />}
          {!loading && !error && categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>

      </div>
    </>
  )
}
