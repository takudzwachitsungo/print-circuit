# Print Circuit — Phase 3: Portfolio & Case Studies — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Portfolio section — a filterable `/work` gallery plus statically-generated `/work/[slug]` case-study pages — so the home "Featured work" links resolve to real project pages.

**Architecture:** The existing `lib/projects.ts` data layer is extended with case-study content (summary, client, year, services, scope, gallery) and a derived `CATEGORIES` list. The `/work` overview renders a client-side filterable gallery (Framer Motion layout animation, replacing the legacy Isotope behaviour) over reusable `WorkCard`s. Each case study is a statically-generated dynamic route composed of small section components (hero, scope+tags, gallery, CTA). All animation reuses Phase 1/2 primitives and respects `prefers-reduced-motion`.

**Tech Stack:** Next.js 16 (App Router, async `params`), TypeScript, Tailwind CSS v4, Framer Motion, GSAP (via existing `Reveal`), Playwright.

## Global Constraints

- Framework: **Next.js (App Router) + TypeScript**. No `pages/` router. **Next 16: `params` is a `Promise` and MUST be awaited** in `page`/`generateMetadata`.
- **READ FIRST (AGENTS.md):** Before writing dynamic-route code, read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`, `.../04-functions/generate-static-params.md`, and `.../04-functions/generate-metadata.md`. Heed deprecation notices. (Phase 2 already used this exact pattern in `app/services/[slug]/page.tsx` — mirror it.)
- Styling: **Tailwind CSS v4** only (tokens in `app/globals.css` `@theme`); no inline style objects except dynamic animation values. No Tailwind class names built by runtime string concatenation (they get purged) — use literal strings or the `ACCENT`-style literal records.
- Colour tokens: `bg-base`, `bg-surface`, `text-primary`, `text-muted`, `text-cyan`, `text-magenta`, `text-yellow`. Fonts: `font-display` (headings), `font-body` (body).
- All motion MUST respect `prefers-reduced-motion` — provide a non-animated, fully-visible fallback. Framer Motion does NOT auto-disable on reduced motion: call `useReducedMotion()` and branch (`initial={reduce ? false : {...}}`), exactly as `components/home/Hero.tsx` and `components/services/ServicesList.tsx` do.
- Company voice only ("we"/"our"), never "I"/"my". Honest copy — real projects only, no fabricated clients/metrics.
- Reuse, don't fork: `Reveal` from `@/components/animation/Reveal` (`{ children, delay?, className? }`); `MagneticButton` from `@/components/ui/MagneticButton` (`{ children, href?, variant?, className? }`, renders a Next `Link`, role=link).
- Images are **placeholder blocks** (gradient `div`s) this phase — real photography is a later content/asset pass. Mirror the placeholder approach in `components/home/FeaturedWork.tsx` and `components/services/ServiceGallery.tsx`.
- Every task must pass `npm run typecheck`, `npm run lint`, and `npm run build` with zero errors, and keep the full Playwright suite green, before it is complete.
- Project slugs (canonical, from `lib/projects.ts` `PROJECTS`): `uz-event-flyer`, `rotaract-rollup-banner`, `value-store-branding`, `church-countdown-flyer`, `binyabs-logo`, `portfolio-website`.

---

## File Structure

- `lib/projects.ts` — **modify.** Extend `Project` with case-study fields; add per-project content; export `CATEGORIES` (derived) and `getProject(slug)`. Single source of truth for portfolio data (already consumed by `FeaturedWork`).
- `components/work/WorkCard.tsx` — **create.** Reusable project card (cover placeholder + category badge + title), links to `/work/[slug]`.
- `components/work/WorkGallery.tsx` — **create.** Client component: category filter bar + Framer Motion layout-animated grid of `WorkCard`s.
- `app/work/page.tsx` — **modify** (replace the Phase 1 stub) with the real overview (hero + `WorkGallery`).
- `app/work/[slug]/page.tsx` — **create.** Statically-generated case-study route.
- `components/work/CaseStudyHero.tsx` — **create.** Title, category, summary, client/year meta.
- `components/work/CaseStudyGallery.tsx` — **create.** Placeholder image grid with scroll reveal.
- `tests/work-overview.spec.ts`, `tests/case-study.spec.ts`, `tests/case-study-gallery.spec.ts` — **create.**

---

### Task 1: Project case-study data layer + `/work` filterable gallery

**Files:**
- Modify: `lib/projects.ts`
- Create: `components/work/WorkCard.tsx`, `components/work/WorkGallery.tsx`
- Modify: `app/work/page.tsx`
- Test: `tests/work-overview.spec.ts`

**Interfaces:**
- Consumes: `Reveal`.
- Produces:
  - extended `interface Project { slug: string; title: string; category: ProjectCategory; image: string; summary: string; client: string; year: string; services: string[]; scope: string; gallery: string[] }`
  - `const PROJECTS: Project[]` (the existing 6, now with content)
  - `const CATEGORIES: ProjectCategory[]` — unique categories present in `PROJECTS`, first-appearance order
  - `function getProject(slug: string): Project | undefined`
  - `<WorkCard project={Project} />`, `<WorkGallery />`

- [ ] **Step 1: Extend the projects data layer**

Replace `lib/projects.ts` entirely:
```ts
export type ProjectCategory =
  | "Branding"
  | "Printing"
  | "Signage"
  | "Stationery"
  | "Web";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** Cover image path under /public/work — placeholder until the asset pass. */
  image: string;
  /** One-line description (card + case-study lead). */
  summary: string;
  client: string;
  year: string;
  /** Service tags shown on the case study. */
  services: string[];
  /** Short paragraph: what we did. Company voice. */
  scope: string;
  /** Placeholder gallery image paths (real images added in the asset pass). */
  gallery: string[];
}

export const PROJECTS: Project[] = [
  {
    slug: "uz-event-flyer",
    title: "UZ Event Flyer",
    category: "Branding",
    image: "/work/uz-event-flyer.jpg",
    summary: "Bold, readable event flyer for a University of Zimbabwe student event.",
    client: "University of Zimbabwe student society",
    year: "2026",
    services: ["Graphic Design", "Printing"],
    scope:
      "We designed a high-contrast flyer that stays legible at a glance and prints cleanly in volume, then produced the run for campus distribution.",
    gallery: ["/work/uz-event-flyer-1.jpg", "/work/uz-event-flyer-2.jpg"],
  },
  {
    slug: "rotaract-rollup-banner",
    title: "Rotaract UZ Roll-up Banner",
    category: "Signage",
    image: "/work/rotaract-rollup-banner.jpg",
    summary: "Pull-up banner for a Rotaract Club of UZ event.",
    client: "Rotaract Club of UZ",
    year: "2026",
    services: ["Graphic Design", "Large Format Printing"],
    scope:
      "We laid out a tall, eye-level banner that reads from a distance and printed it on durable roll-up stock ready for repeat use at events.",
    gallery: ["/work/rotaract-rollup-banner-1.jpg"],
  },
  {
    slug: "value-store-branding",
    title: "The Value Store Branding",
    category: "Branding",
    image: "/work/value-store-branding.jpg",
    summary: "Full branding rollout for a retail store, from logo to signage.",
    client: "The Value Store",
    year: "2026",
    services: ["Branding", "Logo Design", "Signage"],
    scope:
      "We built a complete visual identity — logo, colours, and shopfront signage — that made a new store feel established from day one.",
    gallery: [
      "/work/value-store-branding-1.jpg",
      "/work/value-store-branding-2.jpg",
      "/work/value-store-branding-3.jpg",
    ],
  },
  {
    slug: "church-countdown-flyer",
    title: "Church Countdown Flyer",
    category: "Printing",
    image: "/work/church-countdown-flyer.jpg",
    summary: "Event countdown flyer designed and printed for a church programme.",
    client: "Local church ministry",
    year: "2026",
    services: ["Graphic Design", "Printing"],
    scope:
      "We designed a clear, warm countdown flyer and printed it on quality stock for hand-out and display ahead of the event.",
    gallery: ["/work/church-countdown-flyer-1.jpg"],
  },
  {
    slug: "binyabs-logo",
    title: "Binyabs Logo Design",
    category: "Branding",
    image: "/work/binyabs-logo.jpg",
    summary: "Logo and core brand marks for the Binyabs brand.",
    client: "Binyabs",
    year: "2026",
    services: ["Logo Design", "Brand Identity"],
    scope:
      "We designed a distinctive wordmark and supporting marks, delivered in print- and web-ready formats with usage guidance.",
    gallery: ["/work/binyabs-logo-1.jpg", "/work/binyabs-logo-2.jpg"],
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    category: "Web",
    image: "/work/portfolio-website.jpg",
    summary: "A fast, responsive portfolio website.",
    client: "Independent client",
    year: "2026",
    services: ["Web Development", "UI Design"],
    scope:
      "We designed and built a mobile-first portfolio site with clean navigation and quick load times, ready to grow with the client's work.",
    gallery: ["/work/portfolio-website-1.jpg", "/work/portfolio-website-2.jpg"],
  },
];

/** Categories actually present in PROJECTS, in first-appearance order.
    Derived (not hard-coded) so the filter bar never shows an empty tab. */
export const CATEGORIES: ProjectCategory[] = PROJECTS.reduce<ProjectCategory[]>(
  (acc, p) => (acc.includes(p.category) ? acc : [...acc, p.category]),
  [],
);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
```
Note: `CATEGORIES` is derived from the data, so the spec's full filter list (All/Branding/Printing/Signage/Stationery/Web) shows only categories with real projects — no empty "Stationery" tab. When a Stationery project is added later, the tab appears automatically. This is an intentional, honest deviation from listing all categories statically.

- [ ] **Step 2: Create the reusable WorkCard**

Create `components/work/WorkCard.tsx`:
```tsx
import Link from "next/link";
import { type Project } from "@/lib/projects";

export default function WorkCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-base to-surface transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-base/70 px-3 py-1 text-xs text-muted backdrop-blur">
          {project.category}
        </span>
      </div>
      <div className="flex items-center justify-between p-5">
        <h3 className="font-display text-lg text-primary">{project.title}</h3>
        <span className="text-muted transition-colors group-hover:text-cyan">→</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Write the failing overview test**

Create `tests/work-overview.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("work overview lists projects linking to case studies", async ({ page }) => {
  await page.goto("/work");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    main.getByRole("link", { name: /The Value Store Branding/ }),
  ).toHaveAttribute("href", "/work/value-store-branding");
});

test("work gallery filters projects by category", async ({ page }) => {
  await page.goto("/work");
  const main = page.locator("main");
  await expect(main.getByRole("link", { name: /UZ Event Flyer/ })).toBeVisible();
  await main.getByRole("button", { name: "Web", exact: true }).click();
  await expect(main.getByRole("link", { name: /Portfolio Website/ })).toBeVisible();
  await expect(main.getByRole("link", { name: /UZ Event Flyer/ })).not.toBeVisible();
});
```

- [ ] **Step 4: Run to verify it fails**

Run: `npx playwright test tests/work-overview.spec.ts`
Expected: FAIL (the `/work` stub has no project links or filter).

- [ ] **Step 5: Implement the filterable gallery**

Create `components/work/WorkGallery.tsx`:
```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PROJECTS, CATEGORIES, type ProjectCategory } from "@/lib/projects";
import WorkCard from "./WorkCard";

type Filter = "All" | ProjectCategory;

export default function WorkGallery() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", ...CATEGORIES];
  const visible =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-3" role="group" aria-label="Filter projects">
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? "border-cyan bg-cyan/10 text-cyan"
                  : "border-white/15 text-muted hover:border-white/40 hover:text-primary"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <motion.ul layout={!reduce} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            >
              <WorkCard project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
```

- [ ] **Step 6: Replace the overview page**

Replace `app/work/page.tsx` entirely:
```tsx
import type { Metadata } from "next";
import WorkGallery from "@/components/work/WorkGallery";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected printing, branding, signage and web projects by Print Circuit in Harare, Zimbabwe.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-magenta">
        Our work
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-primary sm:text-6xl">
        Projects we&rsquo;re proud of.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        A growing selection of the printing, branding, signage and web work we&rsquo;ve
        delivered. Filter by what you need.
      </p>
      <WorkGallery />
    </main>
  );
}
```

- [ ] **Step 7: Run to verify it passes**

Run: `npx playwright test tests/work-overview.spec.ts` → Expected: PASS (both tests).
Run `npm run dev`, open `/work`: confirm the grid animates between filters, and that under reduced-motion the cards appear instantly and filtering still works. Run `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add portfolio data layer and filterable work gallery"
```

---

### Task 2: Case-study route — hero, scope, service tags, metadata & 404

**Files:**
- Create: `app/work/[slug]/page.tsx`, `components/work/CaseStudyHero.tsx`
- Test: `tests/case-study.spec.ts`

**Interfaces:**
- Consumes: `getProject`, `PROJECTS` from `@/lib/projects`.
- Produces: a statically-generated route per slug with `generateStaticParams`, `generateMetadata`, and `notFound()` on unknown slugs. `<CaseStudyHero project={Project} />`.

- [ ] **Step 1: Write the failing test**

Create `tests/case-study.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("case study renders title, summary and service tags", async ({ page }) => {
  await page.goto("/work/value-store-branding");
  await expect(
    page.getByRole("heading", { level: 1, name: /The Value Store Branding/ }),
  ).toBeVisible();
  await expect(page.getByText("Logo Design")).toBeVisible();
});

test("unknown project returns a 404", async ({ page }) => {
  const res = await page.goto("/work/not-a-real-project");
  expect(res?.status()).toBe(404);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/case-study.spec.ts` → Expected: FAIL (route does not exist).

- [ ] **Step 3: Implement CaseStudyHero**

Create `components/work/CaseStudyHero.tsx`. Service tags are pills (so `getByText("Logo Design")` matches a single element); client/year are a `dl`:
```tsx
import { type Project } from "@/lib/projects";

export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="px-6 pt-32 pb-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
          {project.category}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">{project.summary}</p>

        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 text-sm">
          <div>
            <dt className="text-muted">Client</dt>
            <dd className="mt-1 text-primary">{project.client}</dd>
          </div>
          <div>
            <dt className="text-muted">Year</dt>
            <dd className="mt-1 text-primary">{project.year}</dd>
          </div>
        </dl>

        <h2 className="mt-12 font-display text-2xl font-bold text-primary">
          What we did
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{project.scope}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Services provided">
          {project.services.map((s) => (
            <li
              key={s}
              className="rounded-full border border-white/15 px-3 py-1 text-sm text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement the case-study route**

Create `app/work/[slug]/page.tsx` (mirrors the Phase 2 service detail route):
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/lib/projects";
import CaseStudyHero from "@/components/work/CaseStudyHero";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main>
      <CaseStudyHero project={project} />
    </main>
  );
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx playwright test tests/case-study.spec.ts` → Expected: PASS (both tests).
Run: `npm run build` → Expected: success; output lists `/work/[slug]` prerendered for all 6 slugs.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add case-study route with hero, scope, tags, metadata and 404"
```

---

### Task 3: Case-study gallery + CTA + back link + full Phase 3 verification

**Files:**
- Create: `components/work/CaseStudyGallery.tsx`
- Modify: `app/work/[slug]/page.tsx`
- Test: `tests/case-study-gallery.spec.ts`

**Interfaces:**
- Consumes: `Project` (via props), `Reveal`, `MagneticButton`.
- Produces: `<CaseStudyGallery project={Project} />`; the case-study page gains a placeholder gallery, a contact CTA, and a back-to-work link.

- [ ] **Step 1: Write the failing test**

Create `tests/case-study-gallery.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("case study shows a gallery and links back to work and to contact", async ({ page }) => {
  await page.goto("/work/value-store-branding");
  await expect(page.getByRole("heading", { name: /Gallery/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Start a project/i }).first(),
  ).toHaveAttribute("href", "/contact");
  await expect(
    page.getByRole("link", { name: /All work/i }),
  ).toHaveAttribute("href", "/work");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/case-study-gallery.spec.ts` → Expected: FAIL.

- [ ] **Step 3: Implement CaseStudyGallery**

Create `components/work/CaseStudyGallery.tsx` (placeholder blocks, one per `project.gallery` entry, scroll-revealed):
```tsx
import Reveal from "@/components/animation/Reveal";
import { type Project } from "@/lib/projects";

export default function CaseStudyGallery({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <Reveal>
        <h2 className="font-display text-2xl font-bold text-primary">Gallery</h2>
      </Reveal>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {project.gallery.map((src, i) => (
          <Reveal key={src} delay={i * 0.05}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-base to-surface" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```
Note: `project.gallery` holds placeholder paths; we render gradient blocks (one per entry) rather than `<img>` until the asset pass. The `src` string is used only as a stable React `key`.

- [ ] **Step 4: Add the gallery, CTA and back link to the page**

In `app/work/[slug]/page.tsx`, add imports and render after the hero:
```tsx
import CaseStudyGallery from "@/components/work/CaseStudyGallery";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
```
Replace the `<main>` body with:
```tsx
    <main>
      <CaseStudyHero project={project} />
      <CaseStudyGallery project={project} />

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Like what you see?
        </h2>
        <div className="mt-8 flex justify-center">
          <MagneticButton href="/contact">Start a project</MagneticButton>
        </div>
        <Link
          href="/work"
          className="mt-10 inline-block text-sm text-muted transition-colors hover:text-primary"
        >
          ← All work
        </Link>
      </section>
    </main>
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx playwright test tests/case-study-gallery.spec.ts` → Expected: PASS.

- [ ] **Step 6: Full Phase 3 verification**

Run: `npm run typecheck` → Expected: clean.
Run: `npm run lint` → Expected: clean (no unused imports/vars).
Run: `npm run build` → Expected: success; output lists `/work` and a prerendered `/work/[slug]` for all 6 slugs.
Run: `npx playwright test` → Expected: ALL tests pass (Phase 1 + 2 + 3).
Manual: from the home "Featured work" section, click a project card and the "View all work" link — confirm both resolve (card → matching case study, link → `/work`), no 404s.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add case-study gallery, contact CTA and verify Phase 3"
```

---

## Self-Review

**Spec coverage (Phase 3 scope — spec §5.3, §4, §6, §7):**
- `/work` hero + filterable gallery (All / per-category) with Framer layout transitions, replacing legacy Isotope → Task 1. ✓
- `/work/[slug]` case study: images (placeholder gallery), scope, service tags → Tasks 2–3. ✓
- Per-page title/description/OpenGraph metadata; static generation of all project routes → Task 2 (`generateMetadata`, `generateStaticParams`, `dynamicParams = false`). ✓
- Company-voice, honest copy (real projects only; placeholders flagged) → all content in `lib/projects.ts` (Task 1). ✓
- Resolves the home `FeaturedWork` `/work` and `/work/[slug]` links built in Phase 1 → verified in Task 3 Step 6. ✓
- Reduced-motion safety → `WorkGallery` (`useReducedMotion` guards layout/initial/exit), `Reveal`-wrapped sections, all noted. ✓

**Correctly deferred (own phases):** real project photography (asset/content pass); JSON-LD/sitemap/robots/Lighthouse (Phase 6); `/about`, `/contact` + quote API (Phases 4–5).

**Placeholder scan:** All code steps contain complete code. All 6 projects have full case-study content (summary, client, year, services, scope, gallery). Gallery uses solid-block placeholders — flagged explicitly, matching the Phase 1/2 precedent.

**Type consistency:** `Project` (extended) defined in Task 1, consumed unchanged by `WorkCard`, `WorkGallery`, `CaseStudyHero`, `CaseStudyGallery` (all take `project: Project` except `WorkGallery` which reads `PROJECTS`/`CATEGORIES`). `getProject(slug)` and `PROJECTS` used by the route (Task 2). `CATEGORIES` (derived) consumed by `WorkGallery`. `MagneticButton`/`Reveal` props match their Phase 1 signatures. `FeaturedWork` still compiles: it reads `slug`/`title`/`category` — all retained on the extended `Project`.

**Test-fragility traps called out at the code:** overview/filter tests scope to `page.locator("main")` (the footer/navbar also link to `/work`); the case-study test asserts a unique service-tag pill (`Logo Design`) rather than the ambiguous category word `Branding` (which appears as both eyebrow and could collide); the gallery test scopes the CTA with `.first()`.

## Execution Handoff

Phase 3 plan complete. Phases 4–6 (About; Contact + quote API + WhatsApp + map; SEO/JSON-LD/performance/deploy) each get their own plan once this ships.
