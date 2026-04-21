# Core Architecture & AI Agent Protocol
_Last Updated: 2026-04-21 · Based on full codebase review_

This document is the **source of truth** for the Sanket Kalathiya Portfolio project. Every AI agent MUST read and adhere to these standards to maintain project integrity and consistency.

---

## 1. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | ^16.2.2 |
| Language | TypeScript | ^5.5.3 |
| Styling | Vanilla CSS (Modular Token System) | - |
| Animation | GSAP (Observer + ScrollToPlugin) | ^3.12.7 |
| Motion | Framer Motion | ^12.38.0 |
| Scroll | Lenis (smooth scroll library) | ^1.3.21 |
| Database | Firebase Firestore | ^12.11.0 |
| Email | Nodemailer (via Next.js API Route) | ^8.0.4 |
| Font | Open Sans (via `next/font/google`) | - |
| Analytics | Vercel Analytics | ^1.4.1 |

---

## 2. Directory Structure (Feature-First Architecture)

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout: SSR data fetch, font, AppProvider wrap
│   ├── page.tsx                 # Entry: renders <Loading> + <MainContainer>
│   ├── not-found.tsx            # 404 page
│   └── api/contact/route.ts     # Server-side API: Nodemailer email handler
│
├── components/
│   ├── features/                # Feature-First Colocation (STRICT RULE)
│   │   ├── Hero/                # Hero.tsx + Hero.css
│   │   ├── About/               # About.tsx + About.css
│   │   ├── Showcase/            # Showcase.tsx + Showcase.css
│   │   ├── TechStack/           # TechStack.tsx + TechStack.css
│   │   ├── Contact/             # Contact.tsx + Contact.css
│   │   ├── Loading/             # Loading.tsx + Loading.css
│   │   └── MainContainer/       # MainContainer.tsx + MainContainer.css (Core Engine)
│   │
│   └── shared/                  # Reusable, non-feature-specific UI
│       ├── providers/AppProvider.tsx  # Global state context
│       ├── Cursor/              # Cursor.tsx + Cursor.css
│       ├── SocialPile/          # SocialPile.tsx + SocialPile.css
│       ├── CommunityWidget/     # CommunityWidget.tsx + CommunityWidget.css
│       ├── HoverLinks/          # HoverLinks.tsx
│       ├── NotFound/            # NotFoundView.tsx + NotFound.css
│       └── ParticleBackground/  # ParticleBackground.tsx (reads --particle-color CSS var)
│
├── lib/
│   ├── firebase.ts              # Firebase app init (reads from .env.local)
│   └── hooks/
│       └── usePortfolioSync.ts  # Data layer: cache + Firebase real-time sync
│
└── styles/                      # Global Design System (Token Architecture)
    ├── globals.css              # Entry: imports all tokens + global resets + utilities
    ├── core/                    # CSS Custom Properties (Design Tokens)
    │   ├── colors.css           # Brand, text, glass, border, bento tokens
    │   ├── typography.css       # Fonts, sizes, weights, line-heights
    │   ├── dimensions.css       # Spacing, sizing, border-radius, breakpoints
    │   ├── decoration.css       # Shadows, glass system, card borders
    │   ├── effects.css          # Hover effects, glow filters
    │   ├── animations.css       # Keyframe definitions + timing tokens
    │   ├── z-index.css          # Z-index ladder tokens
    │   └── utils.css            # Utility classes
    ├── layout/
    │   ├── main.css             # Slider layout, portfolio wrapper, section structure
    │   └── shared.css           # Shared layout helpers
    └── breakpoints/             # Device-specific responsive overrides
        ├── laptop.css           # 1025px – 1536px
        ├── tablet.css           # 769px – 1024px
        ├── mobile.css           # 481px – 768px
        ├── mobile-small.css     # ≤ 480px
        ├── desktop-large.css    # 1537px – 2560px
        └── desktop-4k.css       # > 2560px
```

---

## 3. Data Architecture (Two-Layer System)

### Layer 1 — SSR Prefetch (`layout.tsx`)
- On each request, `RootLayout` fetches the full `portfolio` Firestore collection via `getDocs`.
- Data is passed as `initialData` prop to `<AppProvider>`.
- `revalidate = 60` ensures ISR (Incremental Static Regeneration) every 60 seconds.
- **Purpose**: Zero loading flash on first visit (data arrives with HTML).

### Layer 2 — Client Sync (`usePortfolioSync.ts`)
```
Cache Strategy: Instant-On (Read Cache → Hydrate UI → Background Sync)
```
1. **Read Cache**: On mount, reads `portfolio_cache` (v1) from `localStorage`.
2. **Instant Hydration**: If cache exists, sets data and `isCached=true` immediately (no loader).
3. **Background Sync**: `onSnapshot` listener subscribes to Firestore collection changes.
4. **Patch Cache**: Only changed documents are patched into cache (`patchCache` per section).
5. **Error Handling**: Firebase errors set `errors` state; UI shows connection banner.

**Cache Key**: `portfolio_cache` · **Cache Version**: `v1`

### Firestore Collection Structure
```
/portfolio (collection)
  ├── hero      (document)
  ├── about     (document)
  ├── showcase  (document)
  ├── tech      (document)
  └── contact   (document)
```

---

## 4. State Management (`AppProvider.tsx`)

Single `AppContext` serves all global state. Access via composed hooks:

| Hook | Exposes | Use For |
|---|---|---|
| `useApp()` | Full context | Rare — prefer specific hooks |
| `useLoading()` | `isLoading`, `setIsLoading`, `percent`, `setPercent` | Loading screen control |
| `usePortfolio()` | `data`, `loading`, `isCached`, `errors` | Reading Firebase data |
| `useRouter()` | `activeSection`, `setActiveSection`, `goToSection` | Navigation |

**Global singleton**: `progress.set(n)` — sets loading percent from anywhere without a hook.

**Instant-On Logic**: If `isCached || !loading`, `isLoading` is set to `false` immediately, skipping the loading screen for returning visitors.

**Viewport Fix**: `--vh` CSS variable is set on mount and on resize to fix mobile 100vh issues.

---

## 5. Navigation Engine (`MainContainer.tsx`)

### Desktop Mode (> 1024px) — Cinematic Slider
- **Engine**: GSAP `Observer` (wheel, touch, pointer events)
- **Mechanism**: `gsap.to(sliderInnerRef, { yPercent: -index * 100 })` — full-viewport vertical slide
- **Timing**: 1.5s duration, `expo.inOut` easing
- **Lock**: `isAnimatingRef` prevents double-triggers; 200ms debounce on complete

### Mobile Mode (≤ 1024px) — Native Scroll
- **Engine**: `window.scrollTo({ top, behavior: "smooth" })`
- **Tracking**: `IntersectionObserver` with `-20% 0px -70% 0px` root margin
- **Purpose**: Native scroll feel on touch devices

### URL Sync
- Active section updates `window.history.replaceState` to virtual paths (e.g., `/about`, `/tech`)
- Deep links handled on mount with 500ms delay to allow GSAP context to initialize

### Virtual Routes (next.config.mjs)
All virtual paths rewrite to `/` (single-page app behavior):
```
/hero → / | /about → / | /showcase → / | /tech → / | /contact → /
```

### Sections Array (Source of Truth)
```ts
SECTIONS  = ["hero", "about", "showcase", "tech", "contact"]
NAV_LABELS = ["HOME", "ABOUT", "PROJECTS", "SKILLS", "CONTACT"]
```
> ⚠️ `SECTIONS` is defined in **both** `AppProvider.tsx` and `MainContainer.tsx`. If adding a new section, update both files.

---

## 6. Design System Rules

### Monochrome "Apple Tahoe" Theme
- **Background**: Pure black `#000000` (`--background`, `--bg-dark`)
- **Brand**: White `#ffffff` — all accent colors are white at varying opacities
- **No color accents** — every color must be a white-opacity or neutral-gray token

### CSS Token Hierarchy
```
globals.css
  └── core/colors.css     (brand, text, glass, borders)
  └── core/typography.css (font sizes, weights, line-heights)
  └── core/dimensions.css (spacing, radii, breakpoints)
  └── core/decoration.css (shadows, card borders, glass blur)
  └── core/animations.css (keyframes, timing functions)
  └── core/effects.css    (hover transforms, glow filters)
  └── core/z-index.css    (z-index scale)
  └── core/utils.css      (utility classes)
```

### Shared Global CSS Classes (defined in `globals.css`)
| Class | Description |
|---|---|
| `.bento-card` | Standard card: glass bg, border, shadow, hover lift |
| `.rich-glass` | Premium glass panel with refraction pseudo-elements |
| `.bento-icon-wrapper` | Standardized icon box inside bento cards |
| `.icon-sm` | Small icon variant of `.bento-icon-wrapper` |
| `[data-premium-tooltip]` | CSS-only tooltip system (left/right positioning) |

---

## 7. API Routes

### `POST /api/contact`
- **File**: `src/app/api/contact/route.ts`
- **Purpose**: Sends contact form emails via Nodemailer
- **Config**: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO` from `.env.local` (server-side only, never `NEXT_PUBLIC_`)

---

## 8. Image & Asset Rules

- **Remote images**: Must be whitelisted in `next.config.mjs` (`remotePatterns`)
  - `firebasestorage.googleapis.com` ✅
  - `cdn.simpleicons.org` ✅
  - `api.dicebear.com` ✅
- **Local assets**: Stored in `/public/`

---

## 9. AI Agent Protocol (Mandatory Rules)

When starting any task, agents MUST:

1. **Read this file** to understand current architecture before writing any code.
2. **Track tasks** in `.planning/tasks.md` — update status on start and completion.
3. **Follow colocation** — new components always get their own folder with `.tsx` + `.css`.
4. **Use design tokens only** — hardcoded HEX/PX/REM values in component CSS are **PROHIBITED**.
5. **No inline styles** — never use `style={{...}}` in TSX files.
6. **No `any` types** — define proper TypeScript interfaces; `any` is technical debt.
7. **No hardcoded keys** — all secrets live in `.env.local`; use `process.env.NEXT_PUBLIC_*`.
8. **Breakpoints in `/breakpoints/`** — never put media queries inside component `.css` files.
9. **Global utilities in `globals.css`** — don't duplicate `.bento-card` or `.rich-glass` locally.
10. **Test on both modes** — always verify changes on Desktop (slider) AND Mobile (scroll).

---

## 10. Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client | Firestore project |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | FCM sender |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Client | Analytics |
| `EMAIL_USER` | Server only | Nodemailer sender |
| `EMAIL_PASS` | Server only | Nodemailer app password |
| `EMAIL_TO` | Server only | Contact form recipient |

> Template: `.env.example` (committed) · Actual secrets: `.env.local` (gitignored)
