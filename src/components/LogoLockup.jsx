import LogoMark from '../assets/LogoMark'

/**
 * Full wordmark lockup — shield + "Butte Strong / Wellness" + subtext.
 *
 * Props:
 *   dark  {boolean}  true  → white text  (use on navy / dark backgrounds)
 *                    false → navy text   (use on light / cream backgrounds)
 *   size  {number}   Shield height in px. Wordmark scales proportionally.
 */
export default function LogoLockup({ dark = true, size = 54 }) {
  const textColor = dark ? '#FFFFFF'            : '#0B1F4A'
  const subColor  = dark ? 'rgba(255,255,255,0.55)' : 'rgba(11,31,74,0.45)'
  const fontSize  = Math.round(size * 0.59)     // ~32px at size=54
  const subSize   = Math.max(9, Math.round(size * 0.185)) // ~10px at size=54

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: `${Math.round(size * 0.3)}px` }}>

      {/* Shield mark */}
      <LogoMark size={size} />

      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: `${fontSize}px`,
          color: textColor,
          lineHeight: 1,
          letterSpacing: '0.04em',
        }}>
          Butte Strong
        </span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: `${fontSize}px`,
          color: '#C9A84C',
          lineHeight: 1,
          letterSpacing: '0.04em',
        }}>
          Wellness
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: `${subSize}px`,
          fontWeight: 600,
          color: subColor,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginTop: '5px',
        }}>
          First Responder Wellness Unit
        </span>
      </div>

    </div>
  )
}
