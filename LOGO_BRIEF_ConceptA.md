# Butte Strong Wellness — Logo Brief: Concept A (Shield + Pulse)
**For Claude Code — App Integration**

---

## Overview

This file defines the approved logo concept for the Butte Strong Wellness app. Use it to implement the logo mark, wordmark lockup, and app icon across all relevant files in the project.

---

## The Mark — SVG Source

The logo is a shield with a heartbeat/pulse line running through it. Use this SVG as the canonical source for all implementations.

```svg
<svg viewBox="0 0 72 82" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Shield body -->
  <path
    d="M36 2L4 14v24c0 20 13.5 34.5 32 42 18.5-7.5 32-22 32-42V14L36 2z"
    fill="#0B1F4A"
    stroke="#C9A84C"
    stroke-width="2.5"
  />
  <!-- Pulse / heartbeat line -->
  <polyline
    points="8,42 18,42 22,28 27,56 31,36 36,36 40,48 45,22 50,42 64,42"
    stroke="#C9A84C"
    stroke-width="2.2"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
```

---

## Brand Colors

| Name        | Hex       | Usage                                      |
|-------------|-----------|---------------------------------------------|
| Navy        | `#0B1F4A` | Shield fill, backgrounds, primary text      |
| Gold        | `#C9A84C` | Shield stroke, pulse line, accents          |
| Off-white   | `#F4F2EE` | App background, light surfaces             |
| White       | `#FFFFFF` | Text on dark backgrounds, card backgrounds |

---

## Typography

| Role            | Font          | Weight | Notes                        |
|-----------------|---------------|--------|------------------------------|
| Display / Hero  | Bebas Neue    | 400    | Import from Google Fonts     |
| Body / UI       | DM Sans       | 400–600| Import from Google Fonts     |

Google Fonts import (add to `index.html` `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Wordmark Lockup

Use this lockup wherever the full logo appears (splash screen, about page, header).

```jsx
// LogoLockup.jsx
export function LogoLockup({ dark = true }) {
  const textColor = dark ? '#FFFFFF' : '#0B1F4A';
  const subColor  = dark ? 'rgba(255,255,255,0.6)' : '#666666';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

      {/* Shield mark */}
      <svg width="54" height="62" viewBox="0 0 72 82" fill="none">
        <path
          d="M36 2L4 14v24c0 20 13.5 34.5 32 42 18.5-7.5 32-22 32-42V14L36 2z"
          fill="#0B1F4A"
          stroke="#C9A84C"
          strokeWidth="2.5"
        />
        <polyline
          points="8,42 18,42 22,28 27,56 31,36 36,36 40,48 45,22 50,42 64,42"
          stroke="#C9A84C"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '32px',
          color: textColor,
          lineHeight: 1,
          letterSpacing: '0.04em'
        }}>
          Butte Strong
        </span>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '32px',
          color: '#C9A84C',
          lineHeight: 1,
          letterSpacing: '0.04em'
        }}>
          Wellness
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          color: subColor,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginTop: '5px'
        }}>
          First Responder Wellness Unit
        </span>
      </div>

    </div>
  );
}
```

---

## App Icon (PWA + App Store)

### Step 1 — Create `src/assets/logo-mark.svg`

Save the shield SVG above (the raw SVG, not the JSX version) as:
```
src/assets/logo-mark.svg
```

### Step 2 — Generate icon sizes

Use the SVG to generate PNG icons at these sizes. You can use a tool like [RealFaviconGenerator](https://realfavicongenerator.net) or [Squoosh](https://squoosh.app), or ask Claude Code to generate them with a canvas script.

| File                        | Size      | Used for                          |
|-----------------------------|-----------|-----------------------------------|
| `public/icon-192.png`       | 192×192   | PWA manifest (Android home screen)|
| `public/icon-512.png`       | 512×512   | PWA manifest (splash screen)      |
| `public/apple-touch-icon.png` | 180×180 | iOS home screen                   |
| `public/favicon.ico`        | 32×32     | Browser tab                       |

**Icon background:** Use `#0B1F4A` (navy) as the background fill for all icon sizes. The shield with gold stroke will sit centered on it. Do not use a transparent background — app stores require an opaque icon.

### Step 3 — PWA Manifest (`public/manifest.json`)

```json
{
  "name": "Butte Strong Wellness",
  "short_name": "Butte Strong",
  "description": "First Responder Wellness Unit — Butte County",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B1F4A",
  "theme_color": "#0B1F4A",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Step 4 — Link in `index.html`

```html
<head>
  <link rel="manifest" href="/manifest.json">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="theme-color" content="#0B1F4A">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Butte Strong">
</head>
```

---

## Where to Use the Logo in the App

| Location              | Component          | Variant                        |
|-----------------------|--------------------|--------------------------------|
| Home screen hero      | `LogoLockup`       | `dark={true}` (on navy bg)     |
| About / Team page     | `LogoLockup`       | `dark={false}` (on light bg)   |
| Splash / loading      | Shield mark only   | Centered, 120px, on `#0B1F4A` |
| Bottom nav (none)     | —                  | Do not use logo in bottom nav  |
| Browser tab / favicon | `favicon.ico`      | 32×32 generated PNG            |

---

## Claude Code Prompt to Implement

Use this prompt to have Claude Code integrate the logo into the app:

```
I have an approved logo for this app. It is a shield with a heartbeat 
pulse line — navy body (#0B1F4A) with a gold stroke and pulse line 
(#C9A84C).

Please do the following:

1. Create src/assets/LogoMark.jsx — a React component that renders 
   the shield SVG at a configurable size via a `size` prop (default 60).

2. Create src/components/LogoLockup.jsx — the full wordmark lockup 
   (shield + "Butte Strong" / "Wellness" / subtext) with a `dark` 
   prop (default true) that switches text colors for light backgrounds.

3. Add the LogoLockup to the Home page hero section, replacing any 
   existing placeholder title text.

4. Add LogoLockup (dark={false}) to the About/Team page header.

5. Create public/manifest.json with name "Butte Strong Wellness", 
   short_name "Butte Strong", theme_color "#0B1F4A", 
   background_color "#0B1F4A", display "standalone".

6. Update index.html with the PWA meta tags and manifest link.

7. Generate icon PNGs at 192x192 and 512x512 using a Node canvas 
   script — navy background with the shield SVG centered, then save 
   to public/icon-192.png and public/icon-512.png.

Use the SVG source and component code from the LOGO_BRIEF_ConceptA.md 
file for all implementations.
```

---

## Notes for the Designer (If Finalizing for Print)

- This SVG is a functional concept mark suitable for the app. For print use (signage, uniforms, letterhead), the mark should be redrawn by a graphic designer in Adobe Illustrator or Figma as a true vector file.
- The pulse line anchor points may need refinement at very large print sizes.
- No minimum clear space has been formally defined — maintain at least the width of the shield stroke as breathing room on all sides.

---

*Prepared by Ría Strategies · jovanni@riastrategies.com*
