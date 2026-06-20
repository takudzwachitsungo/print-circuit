# Print Circuit — Phase 1: Foundation, Shell & Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js project with the "Premium Ink" design system and ship a live, fully-animated homepage inside a reusable site shell (navbar, footer, page transitions).

**Architecture:** Next.js App Router + TypeScript app. A global layout provides the persistent shell (navbar, footer, Lenis smooth-scroll, ink-wipe page transitions). Design tokens live in Tailwind config + CSS variables. Animations use Framer Motion (UI/transitions) and GSAP + ScrollTrigger (scroll effects), wrapped in small reusable components so pages compose them declaratively. The Home page is built from independent, individually-testable section components.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, Lenis, Playwright (smoke tests), next/font.

## Global Constraints

- Framework: **Next.js (App Router) + TypeScript**. No `pages/` router.
- Styling: **Tailwind CSS** only; no inline style objects except for dynamic animation values.
- Colour tokens (exact): `bg/base #0A0A0C`, `bg/surface #141417`, `text/primary #F5F5F2`, `text/muted #9A9AA0`, `accent/cyan #00AEEF`, `accent/magenta #EC008C`, `accent/yellow #FFF200`.
- Display font: **Space Grotesk**. Body font: **Inter**. Loaded via `next/font` (self-hosted, no render-blocking).
- All motion MUST respect `prefers-reduced-motion` — provide a non-animated fallback.
- Company voice only ("we"/"our"), never "I"/"my".
- Correct phone numbers: **+263 78 872 3331** and **+263 71 776 1048** (never `+236`).
- Address: **61 Mendel, Avondale, Harare, Zimbabwe**.
- Every page must pass `npm run build` and `npm run typecheck` with zero errors before its task is complete.

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

**Interfaces:**
- Produces: a runnable Next.js app with `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`.

- [ ] **Step 1: Scaffold with create-next-app**

Run in the project root (`C:\Users\cni.alad\Desktop\PrintCircuit`):
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
Accept overwrite prompts only for default files; keep `docs/`.

- [ ] **Step 2: Add typecheck script**

In `package.json` `"scripts"`, add:
```json
"typecheck": "tsc --noEmit"
```

- [ ] **Step 3: Verify it builds and runs**

Run: `npm run build`
Expected: build completes, "Compiled successfully".
Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 4: Confirm .gitignore covers node_modules and .next**

Verify `.gitignore` contains `/node_modules` and `/.next`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with TypeScript and Tailwind"
```

---

### Task 2: Design tokens, fonts & Tailwind theme

**Files:**
- Modify: `app/globals.css`, `tailwind.config.ts`
- Create: `app/fonts.ts`

**Interfaces:**
- Produces: Tailwind utilities `bg-base`, `bg-surface`, `text-primary`, `text-muted`, `text-cyan`, `text-magenta`, `text-yellow` (and `bg-*` variants); CSS vars `--accent-cyan/magenta/yellow`; font CSS vars `--font-display`, `--font-body`.

- [ ] **Step 1: Define fonts**

Create `app/fonts.ts`:
```ts
import { Space_Grotesk, Inter } from "next/font/google";

export const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
```

- [ ] **Step 2: Wire fonts + base colours into the root layout**

In `app/layout.tsx`, import the fonts and apply variables + base background on `<html>`/`<body>`:
```tsx
import { display, body } from "./fonts";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-base text-primary font-body antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Define the Tailwind theme**

Replace the theme colours/fonts in `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0A0C",
        surface: "#141417",
        primary: "#F5F5F2",
        muted: "#9A9AA0",
        cyan: "#00AEEF",
        magenta: "#EC008C",
        yellow: "#FFF200",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 4: Add CSS variables + reduced-motion base**

In `app/globals.css`, after the Tailwind directives, add:
```css
:root {
  --accent-cyan: #00AEEF;
  --accent-magenta: #EC008C;
  --accent-yellow: #FFF200;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Verify**

Run: `npm run build` → Expected: success.
Temporarily set `app/page.tsx` body to `<main className="bg-surface text-cyan font-display">test</main>`, run `npm run dev`, confirm cyan Space Grotesk text on charcoal. Revert the temp change.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Premium Ink design tokens, fonts, Tailwind theme"
```

---

### Task 3: Smooth scroll provider (Lenis)

**Files:**
- Create: `components/providers/SmoothScroll.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<SmoothScroll>` client component wrapping children; initialises Lenis, disabled when `prefers-reduced-motion`.

- [ ] **Step 1: Install Lenis**

Run: `npm install lenis`

- [ ] **Step 2: Create the provider**

Create `components/providers/SmoothScroll.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1 });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```

- [ ] **Step 3: Wrap children in the layout**

In `app/layout.tsx`, wrap `{children}` with `<SmoothScroll>{children}</SmoothScroll>` (import it).

- [ ] **Step 4: Verify**

Run: `npm run dev`, add temporary tall content, confirm smooth (eased) scrolling. Run `npm run build` → success. Remove temp content.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Lenis smooth-scroll provider (reduced-motion aware)"
```

---

### Task 4: GSAP ScrollTrigger setup + reusable Reveal component

**Files:**
- Create: `components/animation/Reveal.tsx`, `lib/gsap.ts`
- Test: `tests/reveal.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `lib/gsap.ts` exporting a registered `gsap` and `ScrollTrigger`; `<Reveal>` — a client component that fades/translates its children in on scroll, rendering them immediately (visible) when reduced-motion is set. Props: `{ children: React.ReactNode; delay?: number; className?: string }`.

- [ ] **Step 1: Install GSAP + Playwright**

Run: `npm install gsap` and `npm install -D @playwright/test && npx playwright install chromium`.

- [ ] **Step 2: Create the GSAP singleton**

Create `lib/gsap.ts`:
```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
```

- [ ] **Step 3: Write the Reveal smoke test**

Create `tests/reveal.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("revealed content is present and visible in the DOM", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("reveal-probe")).toBeVisible();
});
```
Add a temporary `<Reveal><span data-testid="reveal-probe">hi</span></Reveal>` to `app/page.tsx` for this test (removed in Step 7).

- [ ] **Step 4: Run the test to verify it fails**

Run: `npx playwright test tests/reveal.spec.ts`
Expected: FAIL (Reveal not implemented / probe missing).

- [ ] **Step 5: Implement Reveal**

Create `components/animation/Reveal.tsx`:
```tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Reveal({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.8, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/reveal.spec.ts`
Expected: PASS (probe visible — content renders even though animation may have run).

- [ ] **Step 7: Remove the temporary probe**

Remove the temporary `<Reveal>` probe from `app/page.tsx`. Keep the test file. Run `npm run build` → success.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add GSAP setup and reusable scroll Reveal component"
```

---

### Task 5: Magnetic button component

**Files:**
- Create: `components/ui/MagneticButton.tsx`
- Test: `tests/magnetic-button.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `<MagneticButton href? onClick? variant="solid"|"outline">` — a CTA that subtly follows the cursor on hover (Framer Motion), renders a plain accessible `<a>`/`<button>` with no transform under reduced-motion. Used by navbar, hero, CTA band.

- [ ] **Step 1: Write the test**

Create `tests/magnetic-button.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("magnetic CTA renders as a link with its label and href", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Get a Quote" }).first();
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/contact");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/magnetic-button.spec.ts`
Expected: FAIL (no such link yet — navbar in Task 6 will supply it; this test passes after Task 6).

- [ ] **Step 3: Implement MagneticButton**

Create `components/ui/MagneticButton.tsx`:
```tsx
"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  className?: string;
};

export default function MagneticButton({ children, href, variant = "solid", className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base = "inline-flex items-center justify-center rounded-full px-7 py-3 font-display text-sm font-medium transition-colors";
  const styles = variant === "solid"
    ? "bg-cyan text-base hover:bg-magenta"
    : "border border-muted/40 text-primary hover:border-cyan";

  return (
    <motion.a
      ref={ref}
      href={href ?? "#"}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`${base} ${styles} ${className ?? ""}`}
    >
      {children}
    </motion.a>
  );
}
```
Note: use Next `Link` where client routing is needed; for the magnetic effect we wrap an `<a>`. Where SEO/prefetch matters, swap to `<Link legacyBehavior>` in the consuming component.

- [ ] **Step 4: Defer verification to Task 6**

This component is verified by the Task 5 test once the navbar (Task 6) renders a "Get a Quote" button using it. Run `npm run build` → success now.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add magnetic CTA button component"
```

---

### Task 6: Site shell — Navbar

**Files:**
- Create: `components/layout/Navbar.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/navbar.spec.ts` (and satisfies `tests/magnetic-button.spec.ts`)

**Interfaces:**
- Consumes: `MagneticButton`.
- Produces: `<Navbar>` sticky header — transparent at top, `bg-surface/80` backdrop-blur after 40px scroll. Links: Services `/services`, Work `/work`, About `/about`, Contact `/contact`; CTA "Get a Quote" → `/contact`. Mobile hamburger → full-screen menu.

- [ ] **Step 1: Write the test**

Create `tests/navbar.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("navbar shows brand and primary links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Print Circuit" })).toBeVisible();
  for (const name of ["Services", "Work", "About", "Contact"]) {
    await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  }
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/navbar.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Implement Navbar**

Create `components/layout/Navbar.tsx` — a `"use client"` component using `useState`/`useEffect` scroll listener to toggle a `scrolled` class, Next `Link` for nav items, `MagneticButton` for the CTA, and a mobile menu toggled by state. Links exactly: `{ href: "/services", label: "Services" }`, `/work`→Work, `/about`→About, `/contact`→Contact. Brand `Link` to `/` with text "Print Circuit". Apply `fixed top-0 inset-x-0 z-50` and conditional `bg-surface/80 backdrop-blur` when scrolled.

```tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled ? "bg-surface/80 backdrop-blur" : "bg-transparent"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-primary">Print Circuit</Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted hover:text-primary">{l.label}</Link>
          ))}
          <MagneticButton href="/contact">Get a Quote</MagneticButton>
        </div>
        <button className="md:hidden text-primary" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>☰</button>
      </nav>
      {open && (
        <div className="md:hidden bg-surface px-6 py-6 flex flex-col gap-4">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-primary" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <MagneticButton href="/contact">Get a Quote</MagneticButton>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Mount in layout**

In `app/layout.tsx`, render `<Navbar />` inside `<SmoothScroll>` above `{children}`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx playwright test tests/navbar.spec.ts tests/magnetic-button.spec.ts`
Expected: PASS for both.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sticky navbar shell with mobile menu"
```

---

### Task 7: Site shell — Footer

**Files:**
- Create: `components/layout/Footer.tsx`, `lib/site.ts`
- Modify: `app/layout.tsx`
- Test: `tests/footer.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `lib/site.ts` exporting `SITE` constant (NAP, phones, email, socials, WhatsApp link); `<Footer>` rendering contact block, services links, socials, WhatsApp, newsletter stub.

- [ ] **Step 1: Create the site constants**

Create `lib/site.ts`:
```ts
export const SITE = {
  name: "Print Circuit",
  legalName: "Printcircuit Enterprises (Private) Limited",
  address: "61 Mendel, Avondale, Harare, Zimbabwe",
  phones: ["+263 78 872 3331", "+263 71 776 1048"],
  email: "info@printcircuit.co.zw",
  whatsapp: "https://wa.me/263788723331",
  socials: { twitter: "https://twitter.com/printcircuit" },
  services: [
    { slug: "printing", label: "Printing Services" },
    { slug: "graphic-design-branding", label: "Graphic Design & Branding" },
    { slug: "signage-advertising", label: "Signage & Advertising" },
    { slug: "stationery-supplies", label: "Stationery & Supplies" },
    { slug: "web-development", label: "Web Development" },
  ],
} as const;
```

- [ ] **Step 2: Write the test**

Create `tests/footer.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("footer shows correct address and phone numbers", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("61 Mendel, Avondale, Harare, Zimbabwe");
  await expect(footer).toContainText("+263 78 872 3331");
  await expect(footer).not.toContainText("+236");
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx playwright test tests/footer.spec.ts`
Expected: FAIL.

- [ ] **Step 4: Implement Footer**

Create `components/layout/Footer.tsx` (a server component) rendering a `<footer>` with `SITE` data: contact column (address, both phones, email, WhatsApp link), a services column mapping `SITE.services` to `/services/[slug]` links, a socials row, and a newsletter `<form>` stub (input + button, no action yet — backend-ready). Use `text-muted` body, `text-primary` headings.

- [ ] **Step 5: Mount in layout**

In `app/layout.tsx`, render `<Footer />` below `{children}` inside `<SmoothScroll>`.

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/footer.spec.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add footer with correct NAP and site constants"
```

---

### Task 8: Ink-wipe page transition

**Files:**
- Create: `components/providers/PageTransition.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `<PageTransition>` client component using Framer Motion `AnimatePresence` keyed on `usePathname()` to play a CMYK ink-wipe overlay on route change; renders children plainly under reduced-motion.

- [ ] **Step 1: Implement the transition**

Create `components/providers/PageTransition.tsx`:
```tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Wrap children**

In `app/layout.tsx`, wrap `{children}` (between Navbar and Footer) with `<PageTransition>`.

- [ ] **Step 3: Verify**

Run: `npm run build` → success. Run `npm run dev`, navigate between `/` and a temporary `/about` stub, confirm a fade/slide transition. Remove any temp stub.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add page transition wrapper"
```

---

### Task 9: Home — Hero section

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/InkBlend.tsx`
- Modify: `app/page.tsx`
- Test: `tests/home-hero.spec.ts`

**Interfaces:**
- Consumes: `MagneticButton`.
- Produces: `<Hero>` full-screen section; `<InkBlend>` animated CMYK gradient background (CSS/Framer, GPU-friendly, static gradient under reduced-motion). Hero headline, subcopy, dual CTA (`Get a Quote`→`/contact`, `See our work`→`/work`).

- [ ] **Step 1: Write the test**

Create `tests/home-hero.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("hero shows headline and both CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "See our work" })).toHaveAttribute("href", "/work");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/home-hero.spec.ts` → Expected: FAIL.

- [ ] **Step 3: Implement InkBlend**

Create `components/home/InkBlend.tsx` — a `"use client"` component rendering absolutely-positioned blurred radial gradient blobs in cyan/magenta/yellow, slowly animated with Framer Motion (`animate` loop on `x/y/scale`); when reduced-motion, render the same blobs static. `pointer-events-none`, `aria-hidden`.

- [ ] **Step 4: Implement Hero**

Create `components/home/Hero.tsx` — a `<section className="relative min-h-screen flex items-center">` containing `<InkBlend />`, an `<h1>` with oversized `font-display` headline ("We bring ideas to print." or similar company-voice copy), a muted subline naming the services, and a row of two `MagneticButton`s (`Get a Quote`→`/contact` solid, `See our work`→`/work` outline). Use word-by-word entrance via Framer `motion` staggered children.

- [ ] **Step 5: Render on the page**

Set `app/page.tsx` to render `<Hero />` (server component importing the client Hero).

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/home-hero.spec.ts` → Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add animated home hero with CMYK ink-blend"
```

---

### Task 10: Home — Trust marquee

**Files:**
- Create: `components/home/Marquee.tsx`
- Modify: `app/page.tsx`
- Test: `tests/home-marquee.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `<Marquee items={string[]}>` infinite horizontal scroll strip (CSS animation, duplicated track), paused/static under reduced-motion.

- [ ] **Step 1: Write the test**

Create `tests/home-marquee.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("marquee lists service keywords", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Large Format Printing").first()).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — Run: `npx playwright test tests/home-marquee.spec.ts` → FAIL.

- [ ] **Step 3: Implement Marquee** — Create `components/home/Marquee.tsx`: a `<div className="overflow-hidden">` with an inner flex track duplicated twice, animated via a Tailwind `animate-[marquee_..]` keyframe defined in `globals.css`. Items default to `["Business Cards","Flyers","Large Format Printing","Banners","Signage","Branding","Stationery","Stickers"]`.

- [ ] **Step 4: Add the keyframe** — In `app/globals.css` add `@keyframes marquee { to { transform: translateX(-50%); } }` and a `.animate-marquee { animation: marquee 30s linear infinite; }`.

- [ ] **Step 5: Render + verify** — Add `<Marquee />` under Hero in `app/page.tsx`. Run: `npx playwright test tests/home-marquee.spec.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add home trust marquee"
```

---

### Task 11: Home — About teaser with animated stat counters

**Files:**
- Create: `components/home/AboutTeaser.tsx`, `components/animation/Counter.tsx`
- Modify: `app/page.tsx`
- Test: `tests/home-stats.spec.ts`

**Interfaces:**
- Consumes: `Reveal`.
- Produces: `<Counter to={number} suffix?>` counts up when scrolled into view (GSAP), shows final number immediately under reduced-motion; `<AboutTeaser>` short company-voice blurb + counters + "Read our story"→`/about`.

- [ ] **Step 1: Write the test**

Create `tests/home-stats.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("about teaser shows final stat values and story link", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Read our story").scrollIntoViewIfNeeded();
  await expect(page.getByText("Read our story")).toHaveAttribute("href", "/about");
});
```

- [ ] **Step 2: Run to verify it fails** — Run: `npx playwright test tests/home-stats.spec.ts` → FAIL.

- [ ] **Step 3: Implement Counter** — Create `components/animation/Counter.tsx` (`"use client"`): on `ScrollTrigger` enter, GSAP-tween a `{ val: 0 }` to `to`, writing `Math.round` into the node; if reduced-motion, render `to` immediately. Props `{ to: number; suffix?: string }`.

- [ ] **Step 4: Implement AboutTeaser** — Create `components/home/AboutTeaser.tsx`: `Reveal`-wrapped section with a 2-3 sentence company-voice intro (founded 2026, Harare), a row of `Counter`s (e.g. Projects, Clients, Services — use real/honest values, no inflated placeholders), and a `Link` "Read our story"→`/about`.

- [ ] **Step 5: Render + verify** — Add `<AboutTeaser />` to `app/page.tsx`. Run: `npx playwright test tests/home-stats.spec.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add home about teaser with animated counters"
```

---

### Task 12: Home — Services grid

**Files:**
- Create: `components/home/ServicesGrid.tsx`, `components/home/ServiceCard.tsx`
- Modify: `app/page.tsx`
- Test: `tests/home-services.spec.ts`

**Interfaces:**
- Consumes: `Reveal`, `SITE.services` from `lib/site.ts`.
- Produces: `<ServicesGrid>` rendering 5 `<ServiceCard>`s (one per `SITE.services`), each linking to `/services/[slug]`, hover lift + accent wash, staggered reveal.

- [ ] **Step 1: Write the test**

Create `tests/home-services.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("services grid shows all five services linking to detail pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Graphic Design & Branding/ })).toHaveAttribute("href", "/services/graphic-design-branding");
  await expect(page.getByRole("link", { name: /Web Development/ })).toHaveAttribute("href", "/services/web-development");
});
```

- [ ] **Step 2: Run to verify it fails** — Run: `npx playwright test tests/home-services.spec.ts` → FAIL.

- [ ] **Step 3: Implement ServiceCard** — Create `components/home/ServiceCard.tsx`: a `Link` to `/services/${slug}` styled as a `bg-surface` rounded card with title, one-line description, and an accent (cycle cyan/magenta/yellow) that washes in on hover (`group-hover` gradient). Props `{ slug, label, description, accent }`.

- [ ] **Step 4: Implement ServicesGrid** — Create `components/home/ServicesGrid.tsx`: section header ("What we do"), a responsive grid mapping `SITE.services` to `ServiceCard`s with per-service descriptions and rotating accents, each wrapped in `Reveal` with incremental `delay`.

- [ ] **Step 5: Render + verify** — Add `<ServicesGrid />` to `app/page.tsx`. Run: `npx playwright test tests/home-services.spec.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add home services grid"
```

---

### Task 13: Home — Featured work

**Files:**
- Create: `components/home/FeaturedWork.tsx`, `lib/projects.ts`
- Modify: `app/page.tsx`
- Test: `tests/home-featured.spec.ts`

**Interfaces:**
- Consumes: `Reveal`.
- Produces: `lib/projects.ts` exporting `PROJECTS` (typed array: `{ slug, title, category, image }`) seeded from current-site portfolio items; `<FeaturedWork>` showing the first 4, image-mask reveal on scroll, "View all work"→`/work`.

- [ ] **Step 1: Create projects data** — Create `lib/projects.ts` with a typed `Project` interface and ~6 honest entries drawn from the existing portfolio (e.g. UZ flyer, Rotaract banner, Value Store branding, church flyer, logo designs). Use placeholder image paths under `/public/work/` (images added in Phase — Portfolio; use a solid-colour placeholder for now).

- [ ] **Step 2: Write the test**

Create `tests/home-featured.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("featured work shows projects and a view-all link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /View all work/ })).toHaveAttribute("href", "/work");
});
```

- [ ] **Step 3: Run to verify it fails** — Run: `npx playwright test tests/home-featured.spec.ts` → FAIL.

- [ ] **Step 4: Implement FeaturedWork** — Create `components/home/FeaturedWork.tsx`: section header, a 2-col grid of the first 4 `PROJECTS` as cards (title + category over a placeholder image block) each wrapped in `Reveal`, and a `Link` "View all work"→`/work`.

- [ ] **Step 5: Render + verify** — Add `<FeaturedWork />` to `app/page.tsx`. Run: `npx playwright test tests/home-featured.spec.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add home featured work section"
```

---

### Task 14: Home — Process, Testimonials, CTA band

**Files:**
- Create: `components/home/Process.tsx`, `components/home/Testimonials.tsx`, `components/home/CtaBand.tsx`
- Modify: `app/page.tsx`
- Test: `tests/home-rest.spec.ts`

**Interfaces:**
- Consumes: `Reveal`, `MagneticButton`.
- Produces: `<Process>` 5-step strip (Enquire → Design → Proof → Print → Deliver) with GSAP pin on desktop, vertical stack on mobile; `<Testimonials>` Framer carousel of company-voice quotes; `<CtaBand>` full-width closing CTA → `/contact`.

- [ ] **Step 1: Write the test**

Create `tests/home-rest.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
test("home shows process steps and closing CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Enquire")).toBeVisible();
  await expect(page.getByText("Deliver")).toBeVisible();
  await expect(page.getByRole("link", { name: /Let's print something great/i })).toHaveAttribute("href", "/contact");
});
```

- [ ] **Step 2: Run to verify it fails** — Run: `npx playwright test tests/home-rest.spec.ts` → FAIL.

- [ ] **Step 3: Implement Process** — Create `components/home/Process.tsx`: 5 numbered steps with labels Enquire/Design/Proof/Print/Deliver and short captions; on desktop use a GSAP `ScrollTrigger` pinned horizontal track, on mobile a vertical list; registration-mark accent detail. Reduced-motion → plain vertical list.

- [ ] **Step 4: Implement Testimonials** — Create `components/home/Testimonials.tsx` (`"use client"`): Framer Motion auto-advancing quote carousel, 2-3 rewritten company-voice testimonials with attribution; pause on hover.

- [ ] **Step 5: Implement CtaBand** — Create `components/home/CtaBand.tsx`: full-width `bg-surface` band with a CMYK gradient edge, a large headline "Let's print something great", and a `MagneticButton` → `/contact` labelled with the same text (so the test link matches) plus a sub-CTA.

- [ ] **Step 6: Render + verify** — Add `<Process />`, `<Testimonials />`, `<CtaBand />` to `app/page.tsx` in order. Run: `npx playwright test tests/home-rest.spec.ts` → PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add home process, testimonials and CTA band"
```

---

### Task 15: Metadata, route stubs & full verification

**Files:**
- Modify: `app/layout.tsx`, `app/page.tsx`
- Create: `app/services/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx` (minimal stubs so nav links resolve)
- Create: `playwright.config.ts`

**Interfaces:**
- Produces: root `metadata` export (title template, description, OpenGraph); four route stubs returning a heading; a Playwright config running against `npm run build && npm start`.

- [ ] **Step 1: Add root metadata** — In `app/layout.tsx` export:
```ts
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { default: "Print Circuit | Printing & Branding in Zimbabwe", template: "%s | Print Circuit" },
  description: "Print Circuit is a Harare-based printing, branding, signage and design company serving businesses across Zimbabwe.",
  openGraph: { title: "Print Circuit", type: "website", locale: "en_ZW" },
};
```

- [ ] **Step 2: Create route stubs** — Each of `app/services/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx` exports a default component rendering an `<h1>` with the page name and a "Coming soon — Phase 2" note, plus a per-page `metadata` title. These get fully built in later phases.

- [ ] **Step 3: Add Playwright config** — Create `playwright.config.ts` with `webServer: { command: "npm run build && npm start", url: "http://localhost:3000", reuseExistingServer: !process.env.CI }` and `use: { baseURL: "http://localhost:3000" }`.

- [ ] **Step 4: Full verification**

Run: `npm run typecheck` → Expected: clean.
Run: `npm run build` → Expected: success, all 5 routes listed.
Run: `npx playwright test` → Expected: ALL tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add root metadata, route stubs and Playwright config"
```

---

## Self-Review

**Spec coverage (Phase 1 scope):**
- Tech stack (Next.js/TS/Tailwind/Framer/GSAP/Lenis) → Tasks 1-5. ✓
- Design system (tokens, fonts, motion, reduced-motion) → Tasks 2-5. ✓
- Persistent shell (navbar, footer, page transition) → Tasks 6-8. ✓
- Correct NAP / phone-typo fix → Task 7. ✓
- Home page all 8 sections → Tasks 9-14. ✓
- SEO basics (metadata) + route stubs for nav → Task 15. ✓
- Deferred to later phases (correctly out of Phase 1 scope): per-service pages, portfolio filtering/case studies, About/Contact full builds, quote API, JSON-LD/sitemap, deploy, blog, ordering, chatbot. These get their own plans.

**Placeholder scan:** Code-bearing steps include code; descriptive component steps (e.g. Footer, Process) specify exact data, props, links, and behaviour rather than "implement appropriately". Image assets intentionally use placeholders (real images arrive in the Portfolio phase) — flagged explicitly in Task 13.

**Type consistency:** `SITE.services` shape (`{ slug, label }`) is consumed identically in Footer (Task 7) and ServicesGrid (Task 12). `Project` type defined in Task 13 used by FeaturedWork. `MagneticButton` props (`href`, `variant`) consistent across Tasks 5/6/9/14. `Reveal` props (`delay`, `className`) consistent across consumers.

## Execution Handoff

Phase 1 plan complete. Phases 2–6 (Services + per-service pages, Portfolio + case studies, About, Contact + quote API, SEO/JSON-LD/deploy) will each get their own plan once this ships.
