# Butte Strong Wellness — Claude Code Context

Read this file at the start of every session. It replaces file exploration and prevents repeated mistakes.

---

## Project Identity

- **Client:** Butte County Sheriff's Mounted Posse / Butte Strong Wellness Unit
- **Built by:** Ría Strategies (Jovanni Tricerri)
- **Purpose:** Mobile wellness app for Butte County first responders and their families
- **Stack:** React 19 + Vite 5.4.21 (PINNED — never upgrade Vite, hangs on Node 25) + Tailwind CSS v4 + Supabase + React Router v6
- **Deployed:** https://butte-strong-wellness.vercel.app
- **Admin:** https://butte-strong-wellness.vercel.app/admin
- **Repo:** https://github.com/ria-strat/butte-strong-wellness

---

## Environment

```
VITE_SUPABASE_URL=https://cgnkqbyvlhqysbfilliz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_iW682eGGFoWK6VkQPpa73w_70zb9L1A  (in .env, never commit)
```

Supabase client: `src/lib/supabase.js`

---

## Critical Supabase Rules (read every time)

**Two layers are BOTH required for data access — missing either one = 401 error:**
1. **RLS policy** — row-level: `create policy ... using (auth.role() = 'authenticated')`
2. **Table grant** — role-level: `grant select on table_name to anon;`

RLS alone is not enough. Grants alone are not enough. Both must exist.

**anon role needs SELECT even for INSERT** — Supabase JS v2 needs SELECT on the anon role to process insert responses. If insert returns a permission error, add `grant select on table to anon`.

**Sequence grants for anon inserts:**
```sql
grant usage, select on sequence table_name_id_seq to anon;
```

---

## Database Tables

| Table | Purpose | Key columns |
|---|---|---|
| `peer_support_members` | Peer support team + chaplains | name, agency, phone, email, bio, experience, photo_url, is_chaplain, sort_order, is_active |
| `team_members` | About page — wellness unit staff + advisory | name, role, agency, phone, email, bio, experience, photo_url, accent (#hex), sort_order, is_active |
| `therapists` | Mental health providers | name, title, phone, email, address, insurance, bio, quote, sort_order, is_active |
| `crisis_contacts` | Get Help Now page | name, phone, description, sort_order, is_active |
| `fitness_categories` | Physical fitness section headers | title, description, sort_order, is_active |
| `fitness_items` | Fitness resources under categories | title, item_type (location/link/info), description, address, phone, hours, url, content, category_id, sort_order, is_active |
| `events` | News & Events page | title, event_date, event_time, location, description, registration_url, cover_image_url, is_active |
| `feedback` | Anonymous user feedback | name, agency, message, is_read, created_at |

All tables: `anon` has SELECT; `authenticated` has full access.
Storage bucket: `photos` (public) — used for team/member/event cover photos.

---

## Brand

| Token | Value | Use |
|---|---|---|
| navy | `#0B1F4A` | Backgrounds, headings, primary |
| gold | `#C9A84C` | Accents, CTAs, shield stroke |
| cream | `#F4F2EE` | App background |
| teal | `#1A8A72` | Secondary accent |
| blue | `#2563A8` | Tertiary accent |

**Fonts:** Bebas Neue (display headings, `font-display`), DM Sans (body, `font-sans`)
**Tailwind v4** — config is in `src/index.css` using `@theme` directive. No `tailwind.config.js`.

---

## Design Patterns (use consistently on every page)

**Hero header** (every page):
- `bg-navy pt-14 pb-8 px-6`
- Radial gold glow: `radial-gradient(ellipse 70% 50% at 0% 100%, rgba(201,168,76,0.1) 0%, transparent 65%)`
- 3px gold left bar: `absolute left-0 top-0 bottom-0 w-[3px]` style `backgroundColor: '#C9A84C'`
- Eyebrow pill: `rounded-full px-3 py-1 font-sans text-[10px] uppercase tracking-[0.2em]` with gold border
- Display heading: `font-display text-cream uppercase` at `clamp(2.8rem,13vw,3.8rem)`
- Gold hairline divider at bottom: `linear-gradient(90deg, transparent 0%, #C9A84C 40%, #C9A84C 60%, transparent 100%)`

**Double-bezel card:**
```jsx
<div className="rounded-[1.25rem] p-[5px]" style={{ background: 'rgba(11,31,74,0.04)', border: '1px solid rgba(11,31,74,0.07)' }}>
  <div className="rounded-[calc(1.25rem-5px)] bg-white px-5 py-4" style={{ boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.9)' }}>
    {/* content */}
  </div>
</div>
```

**Content cards** (team members, peer support, etc.):
- `rounded-2xl bg-white` with `boxShadow: '0 2px 16px rgba(11,31,74,0.07)'`
- 3px left accent bar: `w-[3px] shrink-0 rounded-l-2xl` with member's accent color

**Scroll reveal animation:**
```js
function useReveal(delay = 0) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = `opacity 0.65s cubic-bezier(0.32,0.72,0,1) ${delay}ms, transform 0.65s cubic-bezier(0.32,0.72,0,1) ${delay}ms`
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; observer.unobserve(el) }
    }, { threshold: 0.05 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return ref
}
```

**Page layout wrapper:** `<div className="flex flex-col min-h-[100dvh] bg-cream">`
**Content area:** `px-4 pt-5 pb-24` (pb-24 = clears bottom nav)
**Transitions:** always `cubic-bezier(0.32,0.72,0,1)` — never `ease-in-out` or `linear`

---

## File Map

```
src/
  App.jsx                        React Router routes
  main.jsx                       Entry point
  lib/supabase.js                Supabase client (reads from .env)
  assets/
    LogoMark.jsx                 Shield SVG component — size prop (default 60)
  components/
    BottomNav.jsx                4-tab bottom navigation
    LogoLockup.jsx               Shield + wordmark — dark prop (true=white text, false=navy text)
    SkeletonCard.jsx             Loading skeleton
    ErrorState.jsx               Error message component
    ResourceCard.jsx             Resource grid card
  pages/
    Home.jsx                     Hero + Get Help CTA + 2×2 resource grid
    Resources.jsx                Resource hub list
    GetHelp.jsx                  Crisis contacts (tap-to-call) — 911 card is navy hero
    PeerSupport.jsx              31 members + 4 chaplains, bio accordions
    PhysicalFitness.jsx          9 categories with location/info/link items
    MindsetResilience.jsx        7 therapists + resource accordions
    FamilyResources.jsx          Family resources + Mandy Barrow contact card
    NewsEvents.jsx               Events from Supabase, upcoming/past split
    About.jsx                    Team members from Supabase (all — staff + advisory)
    Feedback.jsx                 Anonymous feedback form → Supabase
    admin/
      AdminLogin.jsx             Supabase auth login
      AdminDashboard.jsx         7 tabs: Members, Events, Therapists, Crisis, Fitness, Team, Feedback
```

---

## Admin Dashboard

7 tabs, all with full CRUD (add/edit/delete/toggle active):
- **Members** — `peer_support_members` table, filter by all/members/chaplains
- **Events** — `events` table, includes cover photo upload
- **Therapists** — `therapists` table
- **Crisis** — `crisis_contacts` table
- **Fitness** — `fitness_categories` + `fitness_items` (nested, collapsible)
- **Team** — `team_members` table, includes photo upload
- **Feedback** — read-only inbox, mark read/unread, delete

All save functions have error handling — errors surface inline below the Save button.
Photo uploads go to Supabase Storage `photos` bucket via `PhotoUpload` component in AdminDashboard.jsx.

---

## PWA / Icons

- `public/manifest.json` — standalone PWA, navy theme
- `public/icon-192.png`, `icon-512.png`, `apple-touch-icon-v2.png` — generated by `npm run gen:icons`
- Icon generator: `scripts/gen-icons.mjs` (uses `@resvg/resvg-js` — NOT Chrome headless, which is unreliable at small sizes)
- **iOS cache busting:** When icon changes, rename `apple-touch-icon-v2.png` → `v3` etc. and update `index.html` + `manifest.json`. Filename must change or iOS serves the cached version forever.

---

## Known Gotchas

1. **Never upgrade Vite past 5.4.21** — Vite 6+ hangs indefinitely on Node 25 (no error, just freezes)
2. **Tailwind v4 uses `@theme` in CSS, not tailwind.config.js** — don't create a config file
3. **SPA routing on Vercel** requires `vercel.json` with catch-all rewrite to `index.html` — already in place
4. **Supabase anon key in frontend is safe** — RLS is the security layer, not key secrecy
5. **Date parsing for events:** use `new Date(dateStr + 'T12:00:00')` (noon local) to avoid timezone-off-by-one
6. **State counter pattern for re-fetch:** `setVersion(v => v + 1)` triggers useEffect refetch without stale closure bugs
7. **team_members accent column** defaults to `#C9A84C` — advisory members have custom accent colors set in the DB

---

## Contact Info on File

- Mandy Barrow (Family Engagement Specialist): (949) 338-4553 / mandyjoybarrow@yahoo.com
- All `@buttecounty.net` emails updated to `@buttecounty.ca.gov`
