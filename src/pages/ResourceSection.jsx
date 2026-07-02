import { useEffect, useRef } from 'react'
import ResourceCard from '../components/ResourceCard'
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

const accentMap = {
  '#C62828': 'teal',
  '#2563A8': 'blue',
  '#C9A84C': 'gold',
  '#0B1F4A': 'navy',
}

function AnimatedCard({ resource, accent, index }) {
  const ref = useReveal(index * 60)
  return (
    <div ref={ref}>
      <ResourceCard
        title={resource.title}
        description={resource.description}
        phone={resource.phone}
        website={resource.website}
        category={resource.category}
        accent={accentMap[accent] ?? 'teal'}
      />
    </div>
  )
}

export default function ResourceSection({
  title,
  subtitle,
  accent = '#C62828',
  resources = [],
  loading = false,
  error = null,
}) {
  const headerRef = useReveal(0)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-cream">

      {/* Section header */}
      <div className="relative bg-navy pt-14 pb-8 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 0% 100%, ${accent}22 0%, transparent 65%)`,
          }}
        />
        {/* Accent bar on left */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ backgroundColor: accent }}
        />
        <div ref={headerRef} className="relative z-10">
          <span
            className="inline-block rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em] font-medium mb-3"
            style={{
              border: `1px solid ${accent}55`,
              color: `${accent}cc`,
            }}
          >
            Resources
          </span>
          <h1
            className="font-display text-cream uppercase leading-[0.9] tracking-wide"
            style={{ fontSize: 'clamp(2.8rem,13vw,3.8rem)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="font-sans text-[13px] leading-relaxed mt-2"
              style={{ color: 'rgba(244,242,238,0.45)' }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {/* Bottom hairline */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent} 40%, ${accent} 60%, transparent 100%)`,
            opacity: 0.35,
          }}
        />
      </div>

      {/* Content list */}
      <div className="flex flex-col gap-3 px-4 pt-5 pb-nav">
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}

        {!loading && error && <ErrorState />}

        {!loading && !error && resources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-sans text-sm text-navy/40">No resources listed yet.</p>
          </div>
        )}

        {!loading && !error && resources.map((resource, i) => (
          <AnimatedCard
            key={resource.id ?? i}
            resource={resource}
            accent={accent}
            index={i}
          />
        ))}
      </div>

    </div>
  )
}
