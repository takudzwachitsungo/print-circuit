# Print Circuit — Phase 4: About Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/about` page — a large-type ink hero, founding story, Mission/Vision/Values panels, a team grid, and animated mini-stats closing on the shared CTA — replacing the Phase 1 stub.

**Architecture:** A static server-component page composes small section components, each reusing existing Phase 1/2/3 primitives (`InkBlend`, `Reveal`, `Counter`, `MagneticButton`, the shared `CtaBand`). Team data lives in a typed `lib/team.ts`; the company figures shown on both the home teaser and the About page are unified into `lib/stats.ts` (single source of truth). No new dynamic routes, no new animation primitives — all motion is inherited from already-reduced-motion-safe components.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion + GSAP (via existing primitives), Playwright.

## Global Constraints

- Framework: **Next.js (App Router) + TypeScript**. No `pages/` router. The About page is static (no dynamic params).
- Styling: **Tailwind CSS v4** only (tokens in `app/globals.css` `@theme`); no inline style objects except dynamic animation values. No Tailwind class names built by runtime string concatenation (purged) — use literal strings.
- Colour tokens: `bg-base`, `bg-surface`, `text-primary`, `text-muted`, `text-cyan`, `text-magenta`, `text-yellow`. Fonts: `font-display` (headings), `font-body` (body).
- All motion MUST respect `prefers-reduced-motion`. This phase adds NO new motion — it reuses `InkBlend`, `Reveal`, and `Counter`, which already guard via `matchMedia`/`useReducedMotion`. Do not introduce raw Framer `whileInView`/`animate` without a `useReducedMotion()` guard.
- Company voice only ("we"/"our"), never "I"/"my". **Honest content — no fabricated team members or metrics.**
- **Team roster:** seed `lib/team.ts` only with verified people. The one confirmed member is **Takudzwa Chitsungo — Founder & Lead Designer**. Additional real teammates are content the founder appends to `lib/team.ts` as confirmed; do NOT invent names/roles to fill the grid (the legacy site's `Tech001`/`Tech002` placeholders are exactly what we are removing).
- **Company facts (verbatim):** incorporated **20 May 2026**; Harare-based; "new, hungry, modern" positioning (spec §1, §5.4).
- Reuse, don't fork: `Reveal` from `@/components/animation/Reveal` (`{ children, delay?, className? }`); `Counter` from `@/components/animation/Counter` (`{ to, suffix? }`); `MagneticButton` from `@/components/ui/MagneticButton`; `InkBlend` from `@/components/home/InkBlend`; `CtaBand` from `@/components/home/CtaBand` (self-contained closing CTA → `/contact`).
- Every task must pass `npm run typecheck`, `npm run lint`, and `npm run build` with zero errors, and keep the full Playwright suite green, before it is complete.

---

## File Structure

- `lib/stats.ts` — **create.** `CompanyStat` type + `COMPANY_STATS` (the figures currently hard-coded in `AboutTeaser`). Single source of truth for company numbers.
- `lib/team.ts` — **create.** `TeamMember` type + `TEAM` (seeded with the verified founder).
- `components/about/AboutHero.tsx` — **create.** Large-type ink hero (reuses `InkBlend`).
- `components/about/StorySection.tsx` — **create.** Founding story.
- `components/about/ValuesPanels.tsx` — **create.** Mission / Vision / Values panels.
- `components/about/TeamGrid.tsx` — **create.** Team grid from `lib/team.ts`.
- `components/about/AboutStats.tsx` — **create.** Animated mini-stats from `lib/stats.ts` (reuses `Counter`).
- `app/about/page.tsx` — **modify** (replace the Phase 1 stub) composing the sections + the shared `CtaBand`.
- `components/home/AboutTeaser.tsx` — **modify** (Task 4) to consume `COMPANY_STATS` (DRY the figures).
- `tests/about-hero.spec.ts`, `tests/about-values.spec.ts`, `tests/about-team.spec.ts`, `tests/about-stats.spec.ts` — **create.**

---

### Task 1: About page shell — ink hero + founding story

**Files:**
- Create: `components/about/AboutHero.tsx`, `components/about/StorySection.tsx`
- Modify: `app/about/page.tsx`
- Test: `tests/about-hero.spec.ts`

**Interfaces:**
- Consumes: `InkBlend` from `@/components/home/InkBlend`; `Reveal`.
- Produces: `<AboutHero />`, `<StorySection />`; an `/about` page rendering both with metadata.

- [ ] **Step 1: Write the failing test**

Create `tests/about-hero.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("about page shows the hero and founding story", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("20 May 2026")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/about-hero.spec.ts`
Expected: FAIL (the stub has no `20 May 2026` text).

- [ ] **Step 3: Implement AboutHero**

Create `components/about/AboutHero.tsx` (server component importing the client `InkBlend`):
```tsx
import InkBlend from "@/components/home/InkBlend";

export default function AboutHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden px-6 pt-32 pb-16">
      <InkBlend />
      <div className="relative mx-auto w-full max-w-5xl">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-yellow">
          About Print Circuit
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] text-primary sm:text-7xl">
          New, hungry, and built for modern brands.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          We&rsquo;re a Harare print and design studio on a simple mission: make
          every business we work with look professional, in print and online.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement StorySection**

Create `components/about/StorySection.tsx`:
```tsx
import Reveal from "@/components/animation/Reveal";

export default function StorySection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Our story
        </h2>
        <div className="mt-6 space-y-4 text-lg text-muted">
          <p>
            Print Circuit was incorporated on 20 May 2026 — a young studio with
            an old-fashioned belief: that good print still matters. We started
            because too many small businesses were settling for dated, templated
            work that didn&rsquo;t reflect how good they actually are.
          </p>
          <p>
            We pair modern design with dependable production, so whether you need
            a single business card or a full brand rollout, the result looks
            sharp and lands on time. We&rsquo;re new and hungry, and we treat
            every project like it&rsquo;s our calling card — because it is.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 5: Replace the About page**

Replace `app/about/page.tsx` entirely:
```tsx
import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import StorySection from "@/components/about/StorySection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Print Circuit is a Harare-based printing, branding and design studio. Learn our story and what we stand for.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <StorySection />
    </main>
  );
}
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/about-hero.spec.ts` → Expected: PASS.
Run `npm run dev`, open `/about`, confirm the ink hero animates (and is static under reduced-motion). Run `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add about page shell with ink hero and founding story"
```

---

### Task 2: Mission / Vision / Values panels

**Files:**
- Create: `components/about/ValuesPanels.tsx`
- Modify: `app/about/page.tsx`
- Test: `tests/about-values.spec.ts`

**Interfaces:**
- Consumes: `Reveal`.
- Produces: `<ValuesPanels />` rendering three panels with `<h3>` headings "Mission", "Vision", "Values".

- [ ] **Step 1: Write the failing test**

Create `tests/about-values.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("about page shows mission, vision and values", async ({ page }) => {
  await page.goto("/about");
  for (const heading of ["Mission", "Vision", "Values"]) {
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/about-values.spec.ts` → Expected: FAIL.

- [ ] **Step 3: Implement ValuesPanels**

Create `components/about/ValuesPanels.tsx`:
```tsx
import Reveal from "@/components/animation/Reveal";

const PANELS: { title: string; body: string }[] = [
  {
    title: "Mission",
    body: "To make professional design and printing accessible to every business in Zimbabwe — fast, reliable, and done right the first time.",
  },
  {
    title: "Vision",
    body: "To become Harare's most trusted name in print and brand, known for quality work and genuine care for our clients.",
  },
  {
    title: "Values",
    body: "Craftsmanship in every detail, reliability you can plan around, honest advice and pricing, and pride in serving our local community.",
  },
];

export default function ValuesPanels() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          What we stand for
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PANELS.map((panel, i) => (
          <Reveal key={panel.title} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-white/10 bg-surface p-8">
              <h3 className="font-display text-xl font-bold text-cyan">
                {panel.title}
              </h3>
              <p className="mt-4 text-muted">{panel.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in the page**

In `app/about/page.tsx`, add the import and render after `<StorySection />`:
```tsx
import ValuesPanels from "@/components/about/ValuesPanels";
```
```tsx
      <StorySection />
      <ValuesPanels />
    </main>
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx playwright test tests/about-values.spec.ts` → Expected: PASS.
Run `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add about mission, vision and values panels"
```

---

### Task 3: Team grid

**Files:**
- Create: `lib/team.ts`, `components/about/TeamGrid.tsx`
- Modify: `app/about/page.tsx`
- Test: `tests/about-team.spec.ts`

**Interfaces:**
- Consumes: `Reveal`.
- Produces: `interface TeamMember { name: string; role: string; bio: string }`; `const TEAM: TeamMember[]`; `<TeamGrid />`.

- [ ] **Step 1: Create the team data**

Create `lib/team.ts`:
```ts
export interface TeamMember {
  name: string;
  role: string;
  /** One-line bio in company voice. */
  bio: string;
}

/** Seeded with verified people only. Append real teammates here as they are
    confirmed — never placeholder names (we are removing the old Tech001/Tech002 style). */
export const TEAM: TeamMember[] = [
  {
    name: "Takudzwa Chitsungo",
    role: "Founder & Lead Designer",
    bio: "Founded Print Circuit to bring sharp, modern design and dependable printing to Harare's businesses.",
  },
];
```

- [ ] **Step 2: Write the failing test**

Create `tests/about-team.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("about page shows the team", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Takudzwa Chitsungo")).toBeVisible();
  await expect(page.getByText("Founder & Lead Designer")).toBeVisible();
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx playwright test tests/about-team.spec.ts` → Expected: FAIL.

- [ ] **Step 4: Implement TeamGrid**

Create `components/about/TeamGrid.tsx` (avatar is a placeholder gradient block, matching the project's image-placeholder convention):
```tsx
import Reveal from "@/components/animation/Reveal";
import { TEAM } from "@/lib/team";

export default function TeamGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          The team
        </h2>
      </Reveal>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member, i) => (
          <Reveal key={member.name} delay={i * 0.05}>
            <li className="h-full rounded-2xl border border-white/10 bg-surface p-6">
              <div
                aria-hidden
                className="aspect-square w-20 overflow-hidden rounded-full bg-gradient-to-br from-cyan/30 via-magenta/30 to-yellow/30"
              />
              <h3 className="mt-5 font-display text-lg font-bold text-primary">
                {member.name}
              </h3>
              <p className="mt-1 text-sm text-cyan">{member.role}</p>
              <p className="mt-3 text-sm text-muted">{member.bio}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
```
Note: the `<ul>` is the list landmark; each member is an `<li>`. With one verified member today the grid renders a single card — correct and honest; it scales as `TEAM` grows.

- [ ] **Step 5: Mount in the page**

In `app/about/page.tsx`, add the import and render after `<ValuesPanels />`:
```tsx
import TeamGrid from "@/components/about/TeamGrid";
```
```tsx
      <ValuesPanels />
      <TeamGrid />
    </main>
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/about-team.spec.ts` → Expected: PASS.
Run `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add about team grid"
```

---

### Task 4: Mini-stats + closing CTA, stats DRY, and full Phase 4 verification

**Files:**
- Create: `lib/stats.ts`, `components/about/AboutStats.tsx`
- Modify: `app/about/page.tsx`, `components/home/AboutTeaser.tsx`
- Test: `tests/about-stats.spec.ts`

**Interfaces:**
- Consumes: `Counter` from `@/components/animation/Counter`; `CtaBand` from `@/components/home/CtaBand`.
- Produces: `interface CompanyStat { to: number; suffix: string; label: string }`; `const COMPANY_STATS: CompanyStat[]`; `<AboutStats />`. `AboutTeaser` refactored to consume `COMPANY_STATS`.

- [ ] **Step 1: Create the shared stats source**

Create `lib/stats.ts` (the exact figures currently hard-coded in `components/home/AboutTeaser.tsx`, now a single source):
```ts
export interface CompanyStat {
  to: number;
  suffix: string;
  label: string;
}

export const COMPANY_STATS: CompanyStat[] = [
  { to: 4, suffix: "+", label: "Projects completed" },
  { to: 20, suffix: "+", label: "Clients served" },
  { to: 5, suffix: "", label: "Service lines" },
];
```

- [ ] **Step 2: Write the failing test**

Create `tests/about-stats.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("about page shows stats and a closing CTA", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Service lines")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Let's print something great/i }),
  ).toHaveAttribute("href", "/contact");
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx playwright test tests/about-stats.spec.ts` → Expected: FAIL.

- [ ] **Step 4: Implement AboutStats**

Create `components/about/AboutStats.tsx`:
```tsx
import Counter from "@/components/animation/Counter";
import { COMPANY_STATS } from "@/lib/stats";

export default function AboutStats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {COMPANY_STATS.map((stat) => (
          <div key={stat.label}>
            <div className="font-display text-4xl font-bold text-primary sm:text-6xl">
              <Counter to={stat.to} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: DRY the home AboutTeaser onto the shared source**

In `components/home/AboutTeaser.tsx`, remove the local `STATS` const and consume `COMPANY_STATS` instead. Replace the import block and the stats `.map`:
```tsx
import Link from "next/link";
import Reveal from "@/components/animation/Reveal";
import Counter from "@/components/animation/Counter";
import { COMPANY_STATS } from "@/lib/stats";
```
Delete the local `const STATS = [...]` array, and change the stats grid to map `COMPANY_STATS`:
```tsx
        {COMPANY_STATS.map((s) => (
          <div key={s.label}>
            <div className="font-display text-4xl font-bold text-primary sm:text-6xl">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
```
(Everything else in `AboutTeaser` stays unchanged. The existing `tests/home-stats.spec.ts` asserts the "Read our story" link, not the numbers, so it stays green.)

- [ ] **Step 6: Mount stats + CTA in the page**

In `app/about/page.tsx`, add imports and render after `<TeamGrid />`:
```tsx
import AboutStats from "@/components/about/AboutStats";
import CtaBand from "@/components/home/CtaBand";
```
```tsx
      <TeamGrid />
      <AboutStats />
      <CtaBand />
    </main>
```

- [ ] **Step 7: Run to verify it passes**

Run: `npx playwright test tests/about-stats.spec.ts` → Expected: PASS.

- [ ] **Step 8: Full Phase 4 verification**

Run: `npm run typecheck` → Expected: clean.
Run: `npm run lint` → Expected: clean (no unused imports/vars — confirm the old `STATS` const is fully removed from `AboutTeaser`).
Run: `npm run build` → Expected: success; `/about` listed (static).
Run: `npx playwright test` → Expected: ALL tests pass (Phases 1–4), including `tests/home-stats.spec.ts` (AboutTeaser refactor regression check).
Manual: from the home "About" teaser, click "Read our story" → confirm it lands on the built `/about`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add about stats and closing CTA, unify company stats source"
```

---

## Self-Review

**Spec coverage (Phase 4 scope — spec §5.4, §6):**
- Large-type hero with ink motif → Task 1 (`AboutHero` + `InkBlend`). ✓
- Story (founded 20 May 2026, "new, hungry, modern") → Task 1 (`StorySection`). ✓
- Mission / Vision / Values animated panels → Task 2 (`ValuesPanels`, `Reveal`-animated). ✓
- Team grid with real names + roles (no Tech001 placeholders) → Task 3 (`lib/team.ts` seeded with the verified founder; honest, data-driven, scales). ✓
- Mini stats + CTA → Task 4 (`AboutStats` + reused `CtaBand`). ✓
- Per-page metadata → Task 1. ✓
- Company voice, honest content → all section copy. ✓
- Reduced-motion safety → only reused primitives (`InkBlend`/`Reveal`/`Counter`), all already guarded; no new raw Framer. ✓

**Correctly deferred (own phases):** real team photos & expanded roster (content/asset pass + founder input); `/contact` build + quote API (Phase 5); JSON-LD `AboutPage`/`Organization`, sitemap, Lighthouse (Phase 6); OG-title template fix (Phase 6 backlog, site-wide).

**Open content item (flagged, not a code gap):** the team roster currently has one verified member. Expanding it requires real names/roles from the founder — appended to `lib/team.ts`. The component renders whatever is present, so no code change is needed when the roster grows.

**Placeholder scan:** All code steps contain complete code. All copy (hero, story, mission/vision/values, founder bio, stats labels) is concrete and honest. Avatar/image uses gradient placeholders, consistent with Phase 1–3.

**Type consistency:** `CompanyStat` (`{ to, suffix, label }`) defined in Task 4 matches the `Counter` props (`to`, `suffix`) and is consumed identically by `AboutStats` and the refactored `AboutTeaser`. `TeamMember` (`{ name, role, bio }`) defined in Task 3, consumed by `TeamGrid`. Reused primitives use their existing Phase 1 signatures.

**Test-fragility note:** the stats test asserts the unique label `"Service lines"` and the `CtaBand` link by its accessible name (straight apostrophe, matching the `MagneticButton` label — proven in Phase 1's `home-rest` test); the values test uses `exact: true` heading matches so "Values" doesn't collide with other copy.

## Execution Handoff

Phase 4 plan complete. Phases 5–6 (Contact + quote API + WhatsApp + map; then SEO/JSON-LD/performance/deploy, including the logged OG-title and local-SEO-copy backlog) each get their own plan once this ships.
