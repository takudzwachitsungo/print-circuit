# Print Circuit — Website Redesign Design Spec

**Date:** 2026-06-20
**Author:** Takudzwa Chitsungo (with Claude)
**Status:** Approved design — ready for implementation planning

---

## 1. Background

**Printcircuit Enterprises (Private) Limited** is a Harare-based printing & branding
startup, incorporated **20 May 2026**. The current site (`printcircuit.co.zw`) is a
single-page static template built on legacy tech (Bootstrap 4, jQuery 1.11.1, Owl
Carousel, WOW.js, Stellar, Isotope, EmailJS) with a bolted-on chatbot widget.

### Problems with the current site
- Dated, templated look; heavy legacy JS; jQuery 1.11 has known security issues.
- Inconsistent voice — mixes personal-portfolio "I/my" language with company "we".
- Thin social proof; placeholder staff names (Tech001, Tech002…).
- Single page → weak SEO for a business that needs to rank locally.
- No clear quote/pricing path; contact form reported as unreliable.
- Phone number typo on the live site (`+236` should be `+263`).

### Goals (all four, prioritised equally by the owner)
1. **Lead generation** — frictionless path to request a quote / WhatsApp.
2. **Credibility / brand** — look like an established, premium print house.
3. **SEO** — rank for printing/branding searches in Harare & Zimbabwe.
4. **Modern, interactive, animated** experience.

### Non-goals (this phase)
- Online ordering / e-commerce checkout.
- Customer login / client portal.
- Full AI chatbot (kept as a later optional phase).
- Blog/CMS (structure left backend-ready, not built now).

---

## 2. Technology

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SEO-friendly SSR/SSG, and grows into a backend (API routes, DB, auth, ordering) without a rewrite |
| Styling | **Tailwind CSS** | Consistent design system, fast iteration |
| UI animation | **Framer Motion** | Page transitions, staggered entrances |
| Scroll animation | **GSAP + ScrollTrigger + Lenis** | Premium scroll reveals, pinning, parallax, smooth scroll |
| Components | **Magic UI–style** animated building blocks | Proven animated patterns, distinctive but fast |
| Forms | API route `/app/api/quote` + **EmailJS** fallback | Backend-ready; reliable delivery |
| Hosting | **Cloudflare Pages / Vercel** | Fast in-region delivery; already on Cloudflare |

**Backend-ready principle:** a typed data layer and API routes are scaffolded from day
one so quotes, blog, and online ordering can be added later without rework.

**Accessibility/perf:** all motion respects `prefers-reduced-motion`; pages are
pre-rendered for fast first paint on mobile networks.

---

## 3. Design System — "Premium Ink"

**Concept:** a dark, high-end canvas brought to life with CMYK ink accents. The print
process *is* the brand language — ink, registration marks, colour separation, halftones
— executed cleanly, not as gimmick.

### Colour
| Token | Value | Use |
|---|---|---|
| `bg/base` | `#0A0A0C` | Page background |
| `bg/surface` | `#141417` | Cards, raised surfaces |
| `text/primary` | `#F5F5F2` | Headlines, body |
| `text/muted` | `#9A9AA0` | Secondary text |
| `accent/cyan` | `#00AEEF` | CMYK accent |
| `accent/magenta` | `#EC008C` | CMYK accent |
| `accent/yellow` | `#FFF200` | CMYK accent |

Accents are used sparingly — gradients, ink-blends, hover states (e.g. cyan→magenta
hero glow, hue-shifting buttons).

### Typography
- **Display/headings:** bold geometric grotesk — **Clash Display** or **Space Grotesk**.
- **Body:** **Satoshi** or **Inter**.
- Oversized animated section headers as a design element.

### Motion language
- Lenis smooth-scroll site-wide.
- GSAP ScrollTrigger: word/text reveals, image masks, pinned sections, parallax.
- Framer Motion: ink-wipe page transitions, staggered card entrances.
- Signature touches: CMYK ink-blend animated hero, magnetic CTA buttons, infinite
  services marquee, halftone/registration-mark motif, animated stat counters.

**One-line feel:** *a high-end creative studio that happens to print — dark, sharp, and
alive with ink-colour motion.*

---

## 4. Information Architecture (Sitemap)

```
/                      Home
/services              Services overview
/services/[slug]       Per-service page ×5 (SEO engine)
/work                  Portfolio (filterable)
/work/[slug]           Case study
/about                 About / team
/contact               Contact / Get a Quote
/app/api/quote         Quote form endpoint (backend-ready)
```

**Services (slugs):** `printing`, `graphic-design-branding`, `signage-advertising`,
`stationery-supplies`, `web-development`.

### Persistent shell
- **Navbar:** sticky, transparent → charcoal on scroll. Logo · Services · Work · About ·
  Contact · magnetic **Get a Quote** button.
- **Page transition:** ink-wipe between routes (Framer Motion).
- **Footer:** contact details, services links, socials, WhatsApp, newsletter signup
  (backend-ready), corrected phone numbers.

---

## 5. Page-by-page layout

### 5.1 Home
1. **Hero** — full-screen dark, oversized headline, animated CMYK ink-blend background,
   word-by-word reveal, magnetic dual CTA (*Get a Quote* / *See our work*), scroll cue.
2. **Trust strip** — infinite marquee of services / client logos.
3. **About teaser** — short story + animated stat counters + "Read our story".
4. **Services grid** — 5 cards, hover lifts + CMYK accent wash, staggered reveal.
5. **Featured work** — 3–4 projects, scroll image-mask unmask, link to portfolio.
6. **Process** — pinned horizontal-scroll: Enquire → Design → Proof → Print → Deliver.
7. **Testimonials** — animated carousel (company voice).
8. **CTA band** — full-width "Let's print something great" + quote button.

### 5.2 Services
- **Overview `/services`:** hero + animated list of all services, rows expand on hover.
- **Per-service `/services/[slug]`:** accent-coloured hero, what's included, sample
  gallery, FAQ, sticky "Request a quote for this" CTA. Targets local SEO terms
  (e.g. "large format printing Harare", "business card printing Zimbabwe").

### 5.3 Portfolio `/work`
- Hero + filterable gallery (All / Branding / Printing / Signage / Stationery / Web)
  with Framer layout transitions (replaces legacy Isotope).
- `/work/[slug]` case study: images, scope, service tags.

### 5.4 About `/about`
- Large-type hero with ink motif.
- Story (founded 20 May 2026 — "new, hungry, modern").
- Mission / Vision / Values animated panels.
- Team grid (real names + roles — replace Tech001 placeholders).
- Mini stats + CTA.

### 5.5 Contact / Get a Quote `/contact`
- Split layout. Left: multi-step quote form (service → details → contact) → `/api/quote`
  with EmailJS fallback. Right: details, WhatsApp click-to-chat, embedded map
  (61 Mendel, Avondale, Harare), hours, socials.
- Fix phone typo (`+263`) and the unreliable-form issue.

---

## 6. Content strategy
- Rewrite all copy in a consistent **company voice** ("we", not "I/my").
- Replace placeholder staff names and stats with real, verifiable figures.
- Each per-service page gets unique, keyword-aware copy + FAQ for SEO.
- Honest social proof — real testimonials, real project counts.

## 7. SEO
- Per-page `<title>`, meta description, OpenGraph/Twitter cards.
- JSON-LD `LocalBusiness` schema (NAP: name, address, phone).
- `sitemap.xml`, `robots.txt`, canonical URLs.
- Pre-rendered pages; optimised images (`next/image`); fast LCP on mobile.

## 8. Backend-ready hooks (built now, wired later)
- `/app/api/quote` route with typed request/response.
- Typed content/data layer (services, projects, testimonials) so a CMS or DB can back it.
- Newsletter signup stub.
- Structure leaves room for: blog, online ordering, client login, AI chatbot.

---

## 9. Success criteria
- All 5 page types live, fully responsive, animated, accessible (reduced-motion safe).
- Lighthouse: Performance ≥ 90 (mobile), SEO = 100, Accessibility ≥ 95.
- Working quote form with reliable delivery + WhatsApp path.
- Consistent company voice; no placeholder content.
- Per-service pages indexable and keyword-targeted.

## 10. Phasing (for the implementation plan)
1. **Foundation** — Next.js + Tailwind + design tokens + Lenis/GSAP/Framer setup, shell (navbar, footer, page transitions).
2. **Home** — all sections + signature animations.
3. **Services** — overview + 5 per-service pages.
4. **Portfolio + case studies.**
5. **About + Contact** (quote form + API + WhatsApp + map).
6. **SEO, performance pass, content finalisation, deploy.**
7. *(Later)* Blog, online ordering, AI chatbot.
