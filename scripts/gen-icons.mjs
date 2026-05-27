/**
 * gen-icons.mjs — PWA icon generator for Butte Strong Wellness
 * ─────────────────────────────────────────────────────────────
 * Run with:  npm run gen:icons
 *
 * WHAT THIS DOES
 * Generates three PNG icon files in public/ from the shield SVG:
 *   public/icon-512.png           → PWA splash / Play Store
 *   public/icon-192.png           → PWA home screen (Android)
 *   public/apple-touch-icon-v2.png → iOS "Add to Home Screen" icon
 *
 * WHY @resvg/resvg-js (NOT Chrome headless)
 * We tried generating icons with Chrome headless (--screenshot flag).
 * Chrome works fine at 512px but unreliably crops SVG at small sizes
 * (180px, 192px) regardless of --force-device-scale-factor=1 or other
 * flags. @resvg/resvg-js is a pure WebAssembly SVG renderer — no
 * native binaries, no browser, always pixel-perfect at any size.
 *
 * iOS CACHE BUSTING
 * iOS aggressively caches apple-touch-icon.png at the OS level.
 * Clearing Safari history and removing + re-adding the shortcut is
 * NOT enough to get a fresh icon if the filename hasn't changed.
 * Solution: rename the file (apple-touch-icon-v2.png, -v3.png, etc.)
 * and update the <link rel="apple-touch-icon"> in index.html to match.
 * Every time the icon design changes, increment the version suffix and
 * update the reference in index.html.
 *
 * TO UPDATE THE ICON DESIGN
 * 1. Edit the SVG path/polyline inside iconSvg() below.
 * 2. Run: npm run gen:icons
 * 3. Increment the apple-touch-icon version (v2 → v3) in:
 *    - This file (icons array below)
 *    - index.html  <link rel="apple-touch-icon">
 *    - public/manifest.json  icons[2].src
 * 4. git add public/ && git commit && git push
 * 5. On iPhone: remove icon from home screen, visit the URL fresh, re-add.
 */

import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const out   = (f) => resolve(__dir, '../public', f)

/**
 * Returns a square SVG string at the given pixel size.
 * Layout: navy background rect + shield centered at 60% width.
 *
 * Coordinate math (viewBox 0 0 100 100):
 *   Shield source: 72w × 82h
 *   Target width:  60 units (60% of 100)
 *   Target height: 60 × (82/72) = 68.33 units
 *   x offset:      (100 - 60) / 2 = 20
 *   y offset:      (100 - 68.33) / 2 = 15.83
 */
function iconSvg(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"
     xmlns="http://www.w3.org/2000/svg">
  <!-- Navy background -->
  <rect width="100" height="100" fill="#0B1F4A"/>
  <!-- Shield: 72×82 source, scaled to 60% width, centered -->
  <svg x="20" y="15.83" width="60" height="68.33" viewBox="0 0 72 82">
    <path
      d="M36 2L4 14v24c0 20 13.5 34.5 32 42 18.5-7.5 32-22 32-42V14L36 2z"
      fill="#0B1F4A"
      stroke="#C9A84C"
      stroke-width="2.5"
    />
    <polyline
      points="8,42 18,42 22,28 27,56 31,36 36,36 40,48 45,22 50,42 64,42"
      stroke="#C9A84C"
      stroke-width="2.2"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</svg>`
}

// ── Output targets ────────────────────────────────────────────
// When updating apple-touch-icon, increment the version suffix
// AND update the matching references in index.html + manifest.json
const icons = [
  { file: 'icon-512.png',            size: 512 },
  { file: 'icon-192.png',            size: 192 },
  { file: 'apple-touch-icon-v2.png', size: 180 }, // ← bump to v3 on next redesign
]

// ── Render & write ────────────────────────────────────────────
for (const { file, size } of icons) {
  const resvg = new Resvg(iconSvg(size), {
    fitTo: { mode: 'width', value: size },
  })
  const png = resvg.render().asPng()
  writeFileSync(out(file), png)
  console.log(`✓ ${file}  (${size}×${size},  ${(png.length / 1024).toFixed(1)} KB)`)
}

console.log('\nDone. Commit public/icon-*.png and public/apple-touch-icon-*.png')
console.log('If redesigning: remember to bump apple-touch-icon version in index.html + manifest.json')
