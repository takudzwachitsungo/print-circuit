# Print Circuit — Phase 6: SEO, Performance & Deploy-Readiness — Design

**Status:** Approved (brainstorming) — ready for implementation plan.
**Phase:** 6 of 6 (final build phase; "later" items — blog, ordering, chatbot — remain post-launch).
**Predecessors:** Phases 1–5 complete and merged to `master` (foundation/home, services, portfolio, about, contact + `/api/quote`).

## 1. Goal

Make the site **code-complete and deploy-ready**: full SEO infrastructure (metadata, canonical, JSON-LD, sitemap, robots, OG/brand assets), real-but-env-gated email delivery for the quote route, the outstanding content/accessibility backlog, and a deploy handoff. Nothing in this phase blocks on the founder's accounts — actual deployment, credentials, and real image assets are explicit handoffs.

**Targets (spec §9):** Lighthouse SEO = 100, Accessibility ≥ 95, Performance ≥ 90 (mobile); no placeholder content in shipped copy; per-service pages indexable and keyword-targeted.

## 2. Locked Decisions

| Decision | Choice |
|----------|--------|
| Scope boundary | Code-complete & deploy-ready. No live deploy; no committed credentials; real images remain a handoff. |
| Quote email delivery | **SMTP / Nodemailer**, server-side in the `deliverQuote` seam, behind env vars. Unset → current server-log behavior; route still returns `{ok:true}`. |
| Canonical production URL | `https://www.printcircuit.co.zw` (www, HTTPS). |
| OG / social image | Generated in-code via Next `ImageResponse` (`app/opengraph-image.tsx`), Premium Ink style. |
| SEO architecture | Native Next file-conventions + light helpers (Approach A). No central metadata factory. |

## 3. Architecture

Build on Next 16 App Router's metadata system and special file conventions; keep the per-page metadata that Phases 1–5 already authored, adding only canonical + OG flow. New cross-cutting data (`SITE.url`) lives in the existing `lib/site.ts` single source. Structured data and OG/brand assets are server-rendered (no client JS). Email delivery is an additive change inside the existing `deliverQuote` seam — the route's public contract (`200/400/500`, `QuoteResponse`) is unchanged.

**Design for isolation:** each unit is independently testable and has one purpose:
- `lib/site.ts` — adds `url`; remains the NAP/url/hours/services/socials source.
- `components/seo/JsonLd.tsx` — pure server component: `SITE` → one `<script type="application/ld+json">`. No internals leak to consumers.
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, `app/icon.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx` — Next special files, each self-contained.
- `deliverQuote` (in `app/api/quote/route.ts`) — env-gated SMTP transport; same signature `(data: QuoteRequest) => Promise<void>`.
- `components/animation/Reveal.tsx` — gains a polymorphic `as` prop; existing call sites unchanged unless they opt in.

## 4. Components & Work Units

### 4.1 Site constants + env documentation
- Add `url: "https://www.printcircuit.co.zw"` to the `SITE` object in `lib/site.ts`.
- Create `.env.example` documenting **all** env vars with placeholder values and comments:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `QUOTE_TO`, `QUOTE_FROM` (server-side quote delivery).
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` (existing client fallback).
- No real secrets committed; `.env*` already gitignored by the Next scaffold (verify).

### 4.2 Metadata, canonical & OG flow
- Root `layout.tsx`: add `metadataBase: new URL(SITE.url)`; add Twitter card defaults (`card: "summary_large_image"`, title/description); ensure `openGraph` carries `siteName`, `url`, and a per-page-overridable `title` (fixes the deferred "openGraph.title via template" backlog item).
- Per-route canonical via `alternates.canonical`:
  - Static pages (`/`, `/services`, `/work`, `/about`, `/contact`): add to each page's existing `metadata` object (relative path; resolved against `metadataBase`).
  - Dynamic pages (`/services/[slug]`, `/work/[slug]`): compute in the existing `generateMetadata`.
- Each page's `openGraph.title`/`description` set so social cards are page-specific.

### 4.3 Structured data (JSON-LD `LocalBusiness`)
- `components/seo/JsonLd.tsx` — server component returning a `<script type="application/ld+json">` with a `LocalBusiness` (or `ProfessionalService`) object built from `SITE`: `name`, `url`, `email`, `telephone` (primary phone), `address` (PostalAddress: street/locality `Avondale`/region `Harare`/country `ZW`), `openingHoursSpecification` derived from `SITE.hours`, `sameAs` from `SITE.socials`. Mounted once in root `layout.tsx`.
- JSON is serialized safely (no unescaped `<`); content is static/honest (no fabricated geo coordinates or aggregate ratings).

### 4.4 Crawl files
- `app/sitemap.ts` (`MetadataRoute.Sitemap`): static routes + `SITE.services` slugs (`/services/<slug>`) + `projects` slugs (`/work/<slug>`), each an absolute URL from `SITE.url`, with sensible `changeFrequency`/`priority`.
- `app/robots.ts` (`MetadataRoute.Robots`): allow all user-agents; `sitemap: ${SITE.url}/sitemap.xml`; `host`.

### 4.5 Brand assets (generated in-code)
- `app/opengraph-image.tsx` — `ImageResponse`, 1200×630, Premium Ink: dark base `#0A0A0C`, CMYK accent marks, Space Grotesk-style wordmark "Print Circuit" + tagline. `alt`, `size`, `contentType` exported.
- `app/twitter-image.tsx` — reuse the same renderer (re-export or shared helper).
- `app/icon.tsx` — generated favicon (ImageResponse, small CMYK mark) **or** a committed static `app/icon.png` if simpler; choose one in the plan.
- `app/manifest.ts` (`MetadataRoute.Manifest`): `name`, `short_name`, `theme_color: "#0A0A0C"`, `background_color`, `display: "standalone"`, icons.

### 4.6 Email delivery wiring (SMTP / Nodemailer)
- Add `nodemailer` (+ `@types/nodemailer` dev) dependency.
- Rework `deliverQuote(data)` in `app/api/quote/route.ts`:
  - If required SMTP env vars are **present**: create a transport, send a formatted quote email to `QUOTE_TO` from `QUOTE_FROM`, subject incl. service + name, body with all fields; `replyTo` the submitter's email. On transport error, throw → route returns `500` (existing behavior).
  - If env vars are **absent** (dev/CI default): keep `console.info("[quote] new submission", data)` and return normally → route `200`. Tests run in this mode.
- Route stays on the Node runtime (default for route handlers; assert explicitly if needed). Public contract unchanged.

### 4.7 Content: local-SEO copy
- Surface each service's **primary local-SEO phrase** in the visible service-detail `<h1>` and/or intro paragraph (honest, Harare/Zimbabwe-aware), per spec §9 "keyword-targeted." Data lives in `lib/services.ts` (e.g. a `seoPhrase`/`heading` field per service); the detail page renders it. No keyword stuffing.

### 4.8 Accessibility: `Reveal` polymorphic `as` prop
- Add an `as?: ElementType` prop to `components/animation/Reveal.tsx` (default `"div"`), forwarding `ref`/`className`/`children`.
- Update `TeamGrid` and `ServiceIncluded` so animated list items render as valid `<li>` directly under `<ul>`, removing the invalid `<ul> > <div> > <li>` nesting.

### 4.9 Deploy handoff
- `DEPLOY.md`: required env vars (from `.env.example`), build/start commands, host-agnostic deploy notes (Node version, `next build`/`next start`), DNS/canonical note (`www.printcircuit.co.zw`), and post-deploy checklist (set SMTP keys, submit sitemap to Search Console). No live deploy performed.

## 5. Data Flow

- **SEO read path:** `SITE` (incl. new `url`, existing `hours`/`address`/`phones`/`socials`) → `metadataBase`/canonical, `JsonLd`, `sitemap.ts`, `robots.ts`, `manifest.ts`. One source, many consumers.
- **Quote write path (unchanged contract):** form → `POST /api/quote` → `validateQuote` → `deliverQuote` (SMTP if configured, else log) → `QuoteResponse`. Client EmailJS fallback (Phase 5) still fires on a non-OK/exception when its env keys are set.

## 6. Error Handling

- JSON-LD: malformed `SITE` data can't crash render (server component, static object); JSON is escaped.
- SMTP: any send/transport failure throws inside `deliverQuote` → route `500` `{ok:false,error}` (already specified); the form surfaces the inline error + WhatsApp fallback. Missing env vars is **not** an error — it's the log-only mode.
- Sitemap/robots/manifest: pure data builders, no external calls, can't fail at request time.
- OG/icon `ImageResponse`: static render; no runtime inputs.

## 7. Testing

Each work unit ships with a Playwright spec (TDD red→green), and the full suite stays green with typecheck/lint/build clean:
- `tests/sitemap.spec.ts` — `/sitemap.xml` returns `200`, includes `/`, every service slug, every work slug, absolute `www.printcircuit.co.zw` URLs.
- `tests/robots.spec.ts` — `/robots.txt` returns `200`, allows crawling, references the sitemap.
- `tests/json-ld.spec.ts` — a `LocalBusiness` `application/ld+json` script is present and `JSON.parse`s with correct `name`/`telephone`/`address`; no `+236`.
- `tests/canonical.spec.ts` — representative pages expose `<link rel="canonical">` with the expected absolute URL.
- `tests/og-image.spec.ts` — `/opengraph-image` (and twitter) responds `200` with `image/png`.
- `tests/service-seo.spec.ts` — service-detail `<h1>`/intro contains the local-SEO phrase.
- Reveal refactor: extend/add a spec asserting `TeamGrid`/`ServiceIncluded` produce `<ul> > <li>` (valid nesting), reduced-motion content still visible.
- Quote API: existing `tests/quote-api.spec.ts` continues to pass in log-only mode (no SMTP env in CI).

Performance/accessibility: structural pass (correct landmarks, heading order, the `<li>` fix, reduced-motion guards already present). Lighthouse is run manually against the production build; no real images exist yet, so image-weight optimization is deferred with the real assets (noted in `DEPLOY.md`).

## 8. Out of Scope (YAGNI)

- Newsletter signup stub (spec §8 "wired later") — deferred.
- Blog, online ordering, client login, AI chatbot (spec §10.7) — post-launch.
- Actual deployment, hosting credentials, SMTP/EmailJS keys, and real photography — founder handoffs documented in `DEPLOY.md`.
- Central metadata factory / rewriting all per-page metadata (Approach B) — rejected as unnecessary churn.

## 9. Success Criteria

- `sitemap.xml`, `robots.txt`, JSON-LD `LocalBusiness`, canonical tags, generated OG/twitter image, favicon + manifest all present and tested.
- `openGraph.title` flows per page; each service page surfaces its local-SEO phrase in visible copy.
- `/api/quote` delivers via SMTP when env-configured, logs otherwise; contract unchanged; `.env.example` + `DEPLOY.md` present.
- `Reveal` `as` prop lands; `TeamGrid`/`ServiceIncluded` emit valid list markup.
- Full Playwright suite green; typecheck, lint, `next build` clean; no committed secrets.
