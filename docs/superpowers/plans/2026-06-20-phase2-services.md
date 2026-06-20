# Print Circuit — Phase 2: Services Overview & Per-Service Pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Services section — an animated `/services` overview plus five SEO-targeted `/services/[slug]` detail pages — on top of the Phase 1 foundation, so the home/footer service links resolve to real, keyword-aware pages.

**Architecture:** A typed service-content layer (`lib/services.ts`) is the single source of rich per-service copy, extending the canonical `SITE.services` slug/label list (no duplication). The overview page renders an animated expanding list of all five services. Each detail page is a statically-generated dynamic route (`app/services/[slug]/page.tsx`) using `generateStaticParams` + `generateMetadata`, composed from small section components (hero, what's-included, gallery, FAQ, sticky quote CTA). All sections reuse Phase 1 primitives (`Reveal`, `MagneticButton`) and honour `prefers-reduced-motion`.

**Tech Stack:** Next.js 16 (App Router, async `params`), TypeScript, Tailwind CSS v4, Framer Motion, GSAP (via existing `Reveal`), Playwright.

## Global Constraints

- Framework: **Next.js (App Router) + TypeScript**. No `pages/` router. **Next 16: `params` is a `Promise` and MUST be awaited** in `page`/`generateMetadata`.
- **READ FIRST (AGENTS.md):** Before writing any dynamic-route code, read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md`, `.../04-functions/generate-static-params.md`, and `.../04-functions/generate-metadata.md`. Heed deprecation notices.
- Styling: **Tailwind CSS v4** only (tokens in `app/globals.css` `@theme`); no inline style objects except dynamic animation values. **Accent classes must be written as literal strings** (e.g. via the `ACCENT` record) — never build Tailwind class names by runtime string concatenation, or they get purged.
- Colour tokens: `bg-base`, `bg-surface`, `text-primary`, `text-muted`, `text-cyan`, `text-magenta`, `text-yellow` (Phase 1).
- Fonts: `font-display` (Space Grotesk) for headings, `font-body` (Inter) for body.
- All motion MUST respect `prefers-reduced-motion` — provide a non-animated, fully-visible fallback.
- Company voice only ("we"/"our"), never "I"/"my". Honest copy — no inflated claims.
- Reuse, don't fork: `Reveal` from `@/components/animation/Reveal` (`{ children, delay?, className? }`); `MagneticButton` from `@/components/ui/MagneticButton` (`{ children, href?, variant?, className? }`); `SITE` from `@/lib/site`.
- Every task must pass `npm run typecheck`, `npm run lint`, and `npm run build` with zero errors before it is complete.
- Service slugs (canonical, from `SITE.services`): `printing`, `graphic-design-branding`, `signage-advertising`, `stationery-supplies`, `web-development`.

---

## File Structure

- `lib/services.ts` — **create.** Single source of rich service content. Extends `SITE.services`. Exports `Accent`, `ServiceContent`, `Service`, `SERVICES`, `getService(slug)`, and the `ACCENT` literal-class record.
- `components/services/ServicesList.tsx` — **create.** Client component: animated expanding rows for the overview page.
- `components/services/ServiceHero.tsx` — **create.** Accent-coloured detail-page hero + primary quote CTA.
- `components/services/ServiceIncluded.tsx` — **create.** "What's included" feature list.
- `components/services/ServiceGallery.tsx` — **create.** Placeholder sample gallery (real images arrive in the Portfolio phase).
- `components/services/ServiceFaq.tsx` — **create.** Client accordion; answers stay in the DOM (SEO) but collapse via CSS grid-rows.
- `components/services/StickyQuoteCta.tsx` — **create.** Persistent "Request a quote for this" CTA.
- `app/services/page.tsx` — **modify** (replace the Phase 1 stub) with the real overview.
- `app/services/[slug]/page.tsx` — **create.** Statically-generated detail route.
- `tests/services-overview.spec.ts`, `tests/service-detail.spec.ts`, `tests/service-included.spec.ts`, `tests/service-faq.spec.ts`, `tests/service-sticky-cta.spec.ts` — **create.**

---

### Task 1: Service content layer + Services overview page

**Files:**
- Create: `lib/services.ts`, `components/services/ServicesList.tsx`
- Modify: `app/services/page.tsx`
- Test: `tests/services-overview.spec.ts`

**Interfaces:**
- Consumes: `SITE.services` (`{ slug, label }[]`) from `@/lib/site`; `Reveal`.
- Produces:
  - `type Accent = "cyan" | "magenta" | "yellow"`
  - `interface ServiceContent { tagline: string; intro: string; included: string[]; faqs: { q: string; a: string }[]; seoTitle: string; seoDescription: string; accent: Accent }`
  - `interface Service extends ServiceContent { slug: string; label: string }`
  - `const SERVICES: Service[]` (all 5, in `SITE.services` order)
  - `function getService(slug: string): Service | undefined`
  - `const ACCENT: Record<Accent, { text: string; border: string; bgSoft: string; gradientFrom: string }>` — literal Tailwind class strings.

- [ ] **Step 1: Read the Next docs**

Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` (needed in Task 2). No code yet.

- [ ] **Step 2: Create the service content layer**

Create `lib/services.ts`:
```ts
import { SITE } from "./site";

export type Accent = "cyan" | "magenta" | "yellow";

export interface ServiceContent {
  tagline: string;
  intro: string;
  included: string[];
  faqs: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
  accent: Accent;
}

export interface Service extends ServiceContent {
  slug: string;
  label: string;
}

/** Literal Tailwind class strings per accent (never build these by concatenation). */
export const ACCENT: Record<
  Accent,
  { text: string; border: string; bgSoft: string; gradientFrom: string }
> = {
  cyan: {
    text: "text-cyan",
    border: "border-cyan",
    bgSoft: "bg-cyan/10",
    gradientFrom: "from-cyan/30",
  },
  magenta: {
    text: "text-magenta",
    border: "border-magenta",
    bgSoft: "bg-magenta/10",
    gradientFrom: "from-magenta/30",
  },
  yellow: {
    text: "text-yellow",
    border: "border-yellow",
    bgSoft: "bg-yellow/10",
    gradientFrom: "from-yellow/30",
  },
};

/** Rich content keyed by the canonical SITE.services slugs. */
const CONTENT: Record<string, ServiceContent> = {
  printing: {
    accent: "cyan",
    tagline: "Sharp, vibrant printing for every format.",
    intro:
      "From a single business card to wall-sized banners, we print on the right stock at the right finish so your work looks professional every time. Digital and large-format production, handled in-house in Harare.",
    included: [
      "Business cards",
      "Flyers & brochures",
      "Posters & large format",
      "Banners & roll-ups",
      "Booklets & manuals",
      "Stickers & labels",
    ],
    faqs: [
      {
        q: "How long does printing take?",
        a: "Most standard jobs are ready in 2–3 working days. We can fast-track urgent work — tell us your deadline when you request a quote.",
      },
      {
        q: "What file formats do you accept?",
        a: "Print-ready PDF is ideal. We also accept high-resolution PNG, JPG, and native design files, and we can fix or set up artwork for you.",
      },
      {
        q: "Is there a minimum order?",
        a: "No. We print short runs and one-offs as well as bulk orders, with better per-unit pricing at higher quantities.",
      },
    ],
    seoTitle: "Printing Services in Harare",
    seoDescription:
      "Business card, flyer, banner and large-format printing in Harare, Zimbabwe. Fast turnaround, sharp results from Print Circuit.",
  },
  "graphic-design-branding": {
    accent: "magenta",
    tagline: "Identities that make new brands look established.",
    intro:
      "We design logos and complete brand systems that help businesses and individuals look credible from day one — clear, consistent, and built to work across print and screen.",
    included: [
      "Logo design",
      "Brand identity systems",
      "Social media kits",
      "Marketing collateral",
      "Packaging design",
      "Brand guidelines",
    ],
    faqs: [
      {
        q: "How many logo concepts do we get?",
        a: "Our standard logo package includes three initial concepts and two rounds of revisions on your chosen direction. Larger brand projects are scoped to fit.",
      },
      {
        q: "Do we own the final artwork?",
        a: "Yes. On final payment you receive full ownership and all source files, including vector formats for print and web.",
      },
      {
        q: "Can you refresh our existing brand?",
        a: "Absolutely — we can modernise an existing identity while keeping the recognition you've already built.",
      },
    ],
    seoTitle: "Graphic Design & Branding in Harare",
    seoDescription:
      "Logo design, brand identity and marketing collateral in Harare, Zimbabwe. Print Circuit helps brands look established.",
  },
  "signage-advertising": {
    accent: "yellow",
    tagline: "Get seen — indoors, outdoors, and on the move.",
    intro:
      "We design and produce signage that puts your brand in front of customers, from shopfront fascias to vehicle branding and event displays, built to hold up in Zimbabwe's conditions.",
    included: [
      "Roll-up & pull-up banners",
      "Shopfront & fascia signage",
      "Vehicle branding & wraps",
      "Pop-up & event displays",
      "Outdoor & billboard printing",
      "Directional & safety signs",
    ],
    faqs: [
      {
        q: "Do you install signage?",
        a: "Yes — we handle production and installation for shopfront and outdoor signage in and around Harare.",
      },
      {
        q: "Are your outdoor materials weatherproof?",
        a: "We use UV- and weather-resistant materials for outdoor work so colours stay strong in sun and rain.",
      },
      {
        q: "Can you brand a vehicle from our logo?",
        a: "We can. Send us your logo and vehicle details and we'll design, print, and apply a wrap or decals to fit.",
      },
    ],
    seoTitle: "Signage & Advertising in Harare",
    seoDescription:
      "Banners, shopfront signage, vehicle branding and outdoor advertising in Harare, Zimbabwe, from Print Circuit.",
  },
  "stationery-supplies": {
    accent: "cyan",
    tagline: "The everyday essentials that keep you looking professional.",
    intro:
      "Branded business stationery and office supplies, printed consistently so every document, invoice, and folder reinforces your brand.",
    included: [
      "Letterheads",
      "Invoice & receipt books",
      "Branded notebooks",
      "Company folders",
      "Envelopes",
      "Office printing supplies",
    ],
    faqs: [
      {
        q: "Can you reprint our existing stationery?",
        a: "Yes — send us a sample or your files and we'll match your current stationery for reorders.",
      },
      {
        q: "Do you supply numbered invoice and receipt books?",
        a: "We do, with sequential numbering and duplicate or triplicate copies on request.",
      },
      {
        q: "Can we order in bulk for the year?",
        a: "Bulk orders are welcome and reduce your per-unit cost — tell us your annual volume for a quote.",
      },
    ],
    seoTitle: "Business Stationery & Supplies in Harare",
    seoDescription:
      "Branded letterheads, invoice books, folders and office stationery printing in Harare, Zimbabwe, from Print Circuit.",
  },
  "web-development": {
    accent: "magenta",
    tagline: "Modern websites that turn visitors into enquiries.",
    intro:
      "We build fast, mobile-first websites that match your brand and make it easy for customers to find and contact you — from one-page landing sites to full business sites and online stores.",
    included: [
      "Business websites",
      "Landing pages",
      "E-commerce stores",
      "Website redesigns",
      "Hosting & domains",
      "Maintenance & support",
    ],
    faqs: [
      {
        q: "How long does a website take to build?",
        a: "A focused business site typically takes 2–4 weeks depending on the number of pages and content readiness. We'll confirm a timeline in your quote.",
      },
      {
        q: "Will the site work on phones?",
        a: "Every site we build is mobile-first and tested across phones, tablets, and desktops.",
      },
      {
        q: "Can you host and maintain the site for us?",
        a: "Yes — we offer hosting, domain setup, and ongoing maintenance so you don't have to manage the technical side.",
      },
    ],
    seoTitle: "Web Development in Harare",
    seoDescription:
      "Business websites, landing pages and e-commerce development in Harare, Zimbabwe, by Print Circuit.",
  },
};

export const SERVICES: Service[] = SITE.services.map((s) => ({
  ...s,
  ...CONTENT[s.slug],
}));

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
```

- [ ] **Step 3: Write the failing overview test**

Create `tests/services-overview.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("services overview lists all services linking to detail pages", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Graphic Design & Branding/ }),
  ).toHaveAttribute("href", "/services/graphic-design-branding");
  await expect(
    page.getByRole("link", { name: /Web Development/ }),
  ).toHaveAttribute("href", "/services/web-development");
});
```

- [ ] **Step 4: Run to verify it fails**

Run: `npx playwright test tests/services-overview.spec.ts`
Expected: FAIL (current `/services` stub has no service links).

- [ ] **Step 5: Implement the animated services list**

Create `components/services/ServicesList.tsx`:
```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICES, ACCENT } from "@/lib/services";

export default function ServicesList() {
  return (
    <ul className="mt-16 border-t border-white/10">
      {SERVICES.map((s, i) => {
        const accent = ACCENT[s.accent];
        return (
          <motion.li
            key={s.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            className="border-b border-white/10"
          >
            <Link
              href={`/services/${s.slug}`}
              className="group flex items-center justify-between gap-6 py-8"
            >
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-bold text-primary transition-colors group-hover:text-cyan sm:text-4xl">
                  {s.label}
                </h2>
                <p className="mt-2 max-h-0 overflow-hidden text-muted opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
                  {s.tagline}
                </p>
              </div>
              <span
                aria-hidden
                className={`shrink-0 text-2xl text-muted transition-colors ${`group-hover:${accent.text}`}`}
              >
                →
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
```
Note: `group-hover:${accent.text}` is a literal-prefixed concatenation of a known literal (`text-cyan` etc.) — acceptable because the suffix is from the `ACCENT` record. If Tailwind purges it, replace with an explicit per-accent literal in `ACCENT` (e.g. add `groupHoverText: "group-hover:text-cyan"`). Verify the arrow changes colour on hover in Step 7.

- [ ] **Step 6: Replace the overview page**

Replace `app/services/page.tsx` entirely:
```tsx
import type { Metadata } from "next";
import ServicesList from "@/components/services/ServicesList";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Printing, graphic design & branding, signage, stationery and web development — everything Print Circuit offers, in one place.",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
        Services
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-primary sm:text-6xl">
        Everything you need to look professional in print and online.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Five service lines, one team. Hover a service to see what we do, or open
        it for the full picture.
      </p>
      <ServicesList />
    </main>
  );
}
```

- [ ] **Step 7: Run to verify it passes**

Run: `npx playwright test tests/services-overview.spec.ts` → Expected: PASS.
Run: `npm run dev`, open `/services`, confirm rows reveal on scroll, tagline + arrow change on hover, reduced-motion shows all rows immediately. Run `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add services content layer and animated overview page"
```

---

### Task 2: Per-service detail route — hero, metadata & 404

**Files:**
- Create: `app/services/[slug]/page.tsx`, `components/services/ServiceHero.tsx`
- Test: `tests/service-detail.spec.ts`

**Interfaces:**
- Consumes: `getService`, `SERVICES`, `ACCENT` from `@/lib/services`; `MagneticButton`.
- Produces: a statically-generated route for each slug with `generateStaticParams`, `generateMetadata`, and `notFound()` on unknown slugs. `<ServiceHero service={Service} />`.

- [ ] **Step 1: Write the failing test**

Create `tests/service-detail.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("service detail renders an accent hero and quote CTA", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(
    page.getByRole("heading", { level: 1, name: /Printing Services/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Request a quote/i }).first(),
  ).toHaveAttribute("href", "/contact");
});

test("unknown service returns a 404", async ({ page }) => {
  const res = await page.goto("/services/not-a-real-service");
  expect(res?.status()).toBe(404);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/service-detail.spec.ts` → Expected: FAIL (route does not exist).

- [ ] **Step 3: Implement ServiceHero**

Create `components/services/ServiceHero.tsx`. The `<h1>` MUST be `service.label` (not the tagline) so the level-1 heading on `/services/printing` matches the test's `/Printing Services/`; the tagline is a lead paragraph below it:
```tsx
import MagneticButton from "@/components/ui/MagneticButton";
import { ACCENT, type Service } from "@/lib/services";

export default function ServiceHero({ service }: { service: Service }) {
  const accent = ACCENT[service.accent];
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-16">
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-32 left-1/2 h-96 w-[120%] -translate-x-1/2 bg-gradient-to-b ${accent.gradientFrom} to-transparent opacity-40 blur-3xl`}
      />
      <div className="relative mx-auto max-w-7xl">
        <p
          className={`font-display text-sm uppercase tracking-[0.2em] ${accent.text}`}
        >
          Service
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold text-primary sm:text-6xl">
          {service.label}
        </h1>
        <p className="mt-4 max-w-3xl font-display text-xl text-muted sm:text-2xl">
          {service.tagline}
        </p>
        <p className="mt-6 max-w-2xl text-lg text-muted">{service.intro}</p>
        <div className="mt-10">
          <MagneticButton href="/contact">Request a quote</MagneticButton>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement the detail route**

Create `app/services/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/lib/services";
import ServiceHero from "@/components/services/ServiceHero";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    openGraph: { title: service.seoTitle, description: service.seoDescription },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <main>
      <ServiceHero service={service} />
    </main>
  );
}
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx playwright test tests/service-detail.spec.ts` → Expected: PASS (both tests).
Run: `npm run build` → Expected: success; build output lists `/services/[slug]` prerendered for all 5 slugs.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add per-service detail route with hero, metadata and 404"
```

---

### Task 3: Detail page — "What's included" + sample gallery

**Files:**
- Create: `components/services/ServiceIncluded.tsx`, `components/services/ServiceGallery.tsx`
- Modify: `app/services/[slug]/page.tsx`
- Test: `tests/service-included.spec.ts`

**Interfaces:**
- Consumes: `Service` (via props), `ACCENT`, `Reveal`.
- Produces: `<ServiceIncluded service={Service} />`, `<ServiceGallery service={Service} />`.

- [ ] **Step 1: Write the failing test**

Create `tests/service-included.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("service detail shows what's included and a sample gallery", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(page.getByText("What's included")).toBeVisible();
  await expect(page.getByText("Business cards")).toBeVisible();
  await expect(page.getByText("Sample work")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/service-included.spec.ts` → Expected: FAIL.

- [ ] **Step 3: Implement ServiceIncluded**

Create `components/services/ServiceIncluded.tsx`:
```tsx
import Reveal from "@/components/animation/Reveal";
import { ACCENT, type Service } from "@/lib/services";

export default function ServiceIncluded({ service }: { service: Service }) {
  const accent = ACCENT[service.accent];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          What&rsquo;s included
        </h2>
      </Reveal>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.included.map((item, i) => (
          <Reveal key={item} delay={i * 0.05}>
            <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface px-5 py-4">
              <span
                aria-hidden
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${accent.bgSoft} ${accent.text} font-display text-sm`}
              >
                +
              </span>
              <span className="text-primary">{item}</span>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Implement ServiceGallery**

Create `components/services/ServiceGallery.tsx` (placeholder blocks — real images land in the Portfolio phase, mirroring `FeaturedWork`):
```tsx
import Reveal from "@/components/animation/Reveal";
import { type Service } from "@/lib/services";

export default function ServiceGallery({ service }: { service: Service }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          Sample work
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          A taste of {service.label.toLowerCase()} we&rsquo;ve produced. Full
          case studies are on the way.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Reveal key={i} delay={i * 0.05}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface via-base to-surface" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Mount both in the detail page**

In `app/services/[slug]/page.tsx`, add imports and render below the hero:
```tsx
import ServiceIncluded from "@/components/services/ServiceIncluded";
import ServiceGallery from "@/components/services/ServiceGallery";
```
```tsx
    <main>
      <ServiceHero service={service} />
      <ServiceIncluded service={service} />
      <ServiceGallery service={service} />
    </main>
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/service-included.spec.ts` → Expected: PASS.
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add service what's-included and sample gallery sections"
```

---

### Task 4: Detail page — FAQ accordion

**Files:**
- Create: `components/services/ServiceFaq.tsx`
- Modify: `app/services/[slug]/page.tsx`
- Test: `tests/service-faq.spec.ts`

**Interfaces:**
- Consumes: `Service` (via props).
- Produces: `<ServiceFaq service={Service} />` — an accessible accordion. Answers stay in the DOM for SEO but collapse via CSS `grid-template-rows` (0fr → 1fr); reduced-motion makes the toggle instant.

- [ ] **Step 1: Write the failing test**

Create `tests/service-faq.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("service FAQ reveals an answer when its question is opened", async ({ page }) => {
  await page.goto("/services/printing");
  const question = page.getByRole("button", { name: /How long does printing take/i });
  await expect(question).toBeVisible();
  await expect(page.getByText(/Most standard jobs/i)).not.toBeVisible();
  await question.click();
  await expect(page.getByText(/Most standard jobs/i)).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/service-faq.spec.ts` → Expected: FAIL.

- [ ] **Step 3: Implement ServiceFaq**

Create `components/services/ServiceFaq.tsx`. All items start **closed** (`useState<number | null>(null)`) so the test's "answer hidden, then visible after click" assertion holds:
```tsx
"use client";

import { useState } from "react";
import { type Service } from "@/lib/services";

export default function ServiceFaq({ service }: { service: Service }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Frequently asked questions
      </h2>
      <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {service.faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-lg text-primary">
                  {faq.q}
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-cyan transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {/* grid-rows trick keeps the answer in the DOM (SEO) while collapsing it */}
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-muted">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount in the detail page**

In `app/services/[slug]/page.tsx`, add the import and render after the gallery:
```tsx
import ServiceFaq from "@/components/services/ServiceFaq";
```
```tsx
      <ServiceGallery service={service} />
      <ServiceFaq service={service} />
    </main>
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx playwright test tests/service-faq.spec.ts` → Expected: PASS.
Run `npm run dev`, confirm answers expand/collapse and that with reduced-motion the toggle is instant (answer still appears). Run `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add per-service FAQ accordion"
```

---

### Task 5: Detail page — sticky quote CTA + full Phase 2 verification

**Files:**
- Create: `components/services/StickyQuoteCta.tsx`
- Modify: `app/services/[slug]/page.tsx`
- Test: `tests/service-sticky-cta.spec.ts`

**Interfaces:**
- Consumes: `Service` (via props), `MagneticButton`.
- Produces: `<StickyQuoteCta service={Service} />` — a persistent bar (sticky at the bottom of the page on all viewports) with service-specific text and a `/contact` CTA.

- [ ] **Step 1: Write the failing test**

Create `tests/service-sticky-cta.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("service detail has a sticky request-a-quote CTA for this service", async ({ page }) => {
  await page.goto("/services/printing");
  const cta = page.getByRole("link", { name: /Request a quote for this/i });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/contact");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/service-sticky-cta.spec.ts` → Expected: FAIL.

- [ ] **Step 3: Implement StickyQuoteCta**

Create `components/services/StickyQuoteCta.tsx`:
```tsx
import MagneticButton from "@/components/ui/MagneticButton";
import { type Service } from "@/lib/services";

export default function StickyQuoteCta({ service }: { service: Service }) {
  return (
    <div className="sticky bottom-4 z-40 mx-auto mt-20 max-w-5xl px-6">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/90 px-6 py-5 backdrop-blur sm:flex-row">
        <p className="text-center font-display text-lg text-primary sm:text-left">
          Ready to start your {service.label.toLowerCase()} project?
        </p>
        <MagneticButton href="/contact">
          Request a quote for this
        </MagneticButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Mount in the detail page**

In `app/services/[slug]/page.tsx`, add the import and render as the last child inside `<main>`:
```tsx
import StickyQuoteCta from "@/components/services/StickyQuoteCta";
```
```tsx
      <ServiceFaq service={service} />
      <StickyQuoteCta service={service} />
    </main>
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx playwright test tests/service-sticky-cta.spec.ts` → Expected: PASS.
Confirm in `npm run dev` that the bar stays pinned above the footer while scrolling the detail page.

- [ ] **Step 6: Full Phase 2 verification**

Run: `npm run typecheck` → Expected: clean.
Run: `npm run lint` → Expected: clean (no unused imports/vars).
Run: `npm run build` → Expected: success; output lists `/services` and a prerendered `/services/[slug]` for all 5 slugs.
Run: `npx playwright test` → Expected: ALL tests pass (Phase 1 + Phase 2).
Manual: from the home `ServicesGrid` and the footer, click through each service link and confirm it lands on the matching detail page (no 404s).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add sticky service quote CTA and verify Phase 2"
```

---

## Self-Review

**Spec coverage (Phase 2 scope — spec §5.2, §4, §6, §7):**
- Services overview `/services` with animated list of all services, rows expand on hover → Task 1. ✓
- Per-service `/services/[slug]` ×5 with accent hero, what's-included, sample gallery, FAQ, sticky "Request a quote for this" CTA → Tasks 2–5. ✓
- Local-SEO keyword copy + per-page title/description/OpenGraph → Task 1 (`seoTitle`/`seoDescription` content) + Task 2 (`generateMetadata`). ✓
- Static generation of all service routes → Task 2 (`generateStaticParams`, `dynamicParams = false`). ✓
- Company-voice, honest copy, no placeholder staff/stats → all content in `lib/services.ts` (Task 1). ✓
- Resolves home/footer `/services/[slug]` links built in Phase 1 → verified in Task 5 Step 6. ✓
- Reduced-motion safety → overview list (whileInView, instant under reduced-motion), Reveal sections, FAQ CSS toggle, all noted. ✓

**Correctly deferred (own phases):** real gallery/case-study images (Portfolio phase); JSON-LD `LocalBusiness`, `sitemap.xml`, `robots.txt`, Lighthouse pass (Phase 6 SEO/deploy); `/work`, `/about`, `/contact` full builds + quote API (Phases 4–5).

**Placeholder scan:** All code steps contain complete code; all five services have full, distinct copy (tagline, intro, 6 included items, 3 FAQs, SEO title/description). Gallery uses solid-block placeholders — flagged explicitly as Portfolio-phase work, matching the Phase 1 `FeaturedWork` precedent.

**Type consistency:** `Service`/`ServiceContent`/`Accent` defined in Task 1 and consumed unchanged by `ServiceHero`, `ServiceIncluded`, `ServiceGallery`, `ServiceFaq`, `StickyQuoteCta` (all take `service: Service`). `getService(slug)` and `SERVICES` used by the route (Task 2). `ACCENT` record keys (`text`/`border`/`bgSoft`/`gradientFrom`) used consistently. `MagneticButton`/`Reveal` props match their Phase 1 signatures.

**Test-fragility traps called out at the code:** the `<h1>` must be `service.label` (not the tagline) so the level-1 heading matches `/Printing Services/` (Task 2 Step 3); the FAQ default state must be `null` so the "hidden then visible" assertion holds (Task 4 Step 3). Both are baked into the correct code blocks with a one-line reason.

## Execution Handoff

Phase 2 plan complete. Phase 3+ (Portfolio + case studies, then About + Contact + quote API, then SEO/deploy) each get their own plan once this ships.
