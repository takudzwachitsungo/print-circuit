# Storefront Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-lay out printcircuit.co.zw as a light, SKO-style storefront with a ~30-product quote-only catalogue and an "Add to quote" basket, without changing any existing URL.

**Architecture:** Design tokens in `app/globals.css` flip the whole site to the light palette; a typed product catalogue (`lib/products.ts`) feeds `/shop`, `/shop/[slug]`, the home page and service pages; a pure basket module (`lib/basket.ts`) plus a `useSyncExternalStore` client store persist the quote in `localStorage`; the existing `/api/quote` route gains an optional `items` array. Pages are then re-skinned one area per task.

**Tech Stack:** Next.js 16.2 (App Router, async `params`/`searchParams`, `next/form`), React 19.2, TypeScript, Tailwind v4 (`@theme` tokens), GSAP `Reveal`, Lenis, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-15-storefront-redesign-design.md`

## Global Constraints

- Work only on branch `redesign-storefront`. Never push to or merge into `master` without the owner's explicit go-ahead.
- Next.js 16: `params` and `searchParams` are **Promises** — always `await` them (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`). Read the relevant doc in `node_modules/next/dist/docs/` before using any Next API not already used in this repo.
- No prices anywhere. Every product is "quote only".
- Token values (exact): `base #f7f5f0`, `surface #fffdf8`, `primary #16140f`, `muted #6b6860`, `line #e7e3da`, `ink #16140f`, `tint-cyan #dcf1f8`, `tint-pink #fbe1ef`, `tint-butter #fff6c7`, `ochre #9a7b00`; `cyan/magenta/yellow` unchanged.
- Never use `text-yellow` (unreadable on light) — use `text-ochre`. Never use `text-base` as a colour (it collides with the font-size utility) — use `text-surface` for light text on dark fills.
- Basket storage key: `pc-quote-basket`. Limits: max **50** items, qty integer **1–100000**, product name ≤ **120**, option ≤ **60**, note ≤ **500** chars.
- Every `localStorage` access is wrapped in try/catch; the site must work with storage blocked.
- URLs, canonical tags, metadata and JSON-LD of existing pages stay unchanged.
- Copy voice: company "we", plain English, no invented claims (no prices, no "#1 in Harare").
- Tests: Playwright only (`tests/*.spec.ts`). Pure-logic tests import `../lib/...` directly (relative paths) and use no `page` fixture.
- **Stop your own `npm run dev` before running Playwright** — tests start their own server on port 3100 with SMTP blanked (Task 1) so no real emails are sent.
- Commit after every task with a `feat:`/`test:`/`docs:` message ending in:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

## Review Focus

1. **Corrupt or stale basket in `localStorage`** (invalid JSON, wrong shapes, a product slug that was later deleted, `qty: "abc"`) → page loads with those entries dropped/sanitised, never crashes. *Pinned in Task 4 (`parseBasket` unit tests) and Task 6 (`basket.spec.ts` corrupt-storage test).*
2. **Storage blocked** (Safari private mode, disabled site data — `localStorage` throws) → basket still works in memory for the visit. *Pinned in Task 5 (`shop.spec.ts` blocked-storage test).*
3. **Odd quantity input** (empty, `0`, negative, decimal, `9999999`, letters) → always an integer 1–100000, never `NaN` in the email or WhatsApp text; the API rejects anything else. *Pinned in Task 3 (API rejects), Task 4 (`clampQty` table), Task 6 (drawer qty typing).*
4. **Odd shop URLs** (`?cat=nonsense`, repeated `?cat=a&cat=b`, `?q=` of only spaces, `?q=<script>`) → 200, sensible results, no crash. *Pinned in Task 5 (`shop.spec.ts` odd-params test).*
5. **Special characters in notes** (`&`, `#`, newlines, emoji) → WhatsApp link decodes back to the exact text. *Pinned in Task 4 (`whatsappHref` round-trip test).*

---

## File Structure

**Create**
- `components/ui/ButtonLink.tsx` — `buttonClass()` + `ButtonLink` (primary/outline/whatsapp/light).
- `components/ui/SectionHeading.tsx` — small uppercase label + title + optional "View all →" link.
- `components/ui/icons.tsx` — inline SVG icons (search, bag, category icons).
- `lib/products.ts` — catalogue data + query helpers.
- `lib/basket.ts` — pure basket logic (parse, add, update, remove, WhatsApp text).
- `components/shop/basket-store.ts` — client external store over `localStorage`.
- `components/shop/BasketProvider.tsx` — React context (`useBasket`).
- `components/shop/BasketDrawer.tsx`, `components/shop/BasketToast.tsx`, `components/shop/QtyInput.tsx`.
- `components/shop/ProductImage.tsx`, `ProductCard.tsx`, `ProductGrid.tsx`, `AddToQuoteButton.tsx`, `ProductConfigurator.tsx`.
- `app/shop/page.tsx`, `app/shop/[slug]/page.tsx`.
- `components/home/CategoryCards.tsx`, `MostRequested.tsx`, `RecentWork.tsx`, `HowItWorks.tsx`, `OrderBand.tsx`.
- Tests: `tests/unit-products.spec.ts`, `tests/unit-quote.spec.ts`, `tests/unit-basket.spec.ts`, `tests/shop.spec.ts`, `tests/basket.spec.ts`, `tests/product-page.spec.ts`, `tests/quote-basket.spec.ts`.

**Modify**
- `playwright.config.ts`, `app/globals.css`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/layout.tsx`, `app/page.tsx`, `app/sitemap.ts`
- `lib/quote.ts`, `app/api/quote/route.ts`, `lib/services.ts` (ACCENT)
- `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, `components/ui/FloatingButtons.tsx`, `components/ui/SocialLinks.tsx`
- `components/contact/QuoteForm.tsx`, `components/contact/ContactInfo.tsx`, `app/contact/page.tsx`
- `components/home/Hero.tsx`, `components/home/Testimonials.tsx`, `components/work/*`, `components/services/*`, `components/about/*`, `app/services/page.tsx`, `app/work/page.tsx`, `app/work/[slug]/page.tsx`, `app/about/page.tsx`
- `MAINTENANCE.md`, `public/showcase/CREDITS.md`

**Delete**
- `components/home/{Marquee,AboutTeaser,ServicesGrid,ServiceCard,FeaturedWork,Process,CtaBand,InkBlend}.tsx`, `components/animation/{TextType,Counter}.tsx`, `components/ui/MagneticButton.tsx`, `lib/showcase.ts`
- `tests/{home-marquee,home-stats,home-scroll-pin,magnetic-button}.spec.ts`

---

### Task 1: Test-server safety, design tokens and UI primitives

**Files:**
- Modify: `playwright.config.ts`, `app/globals.css`, `app/manifest.ts`, `app/opengraph-image.tsx`
- Create: `components/ui/ButtonLink.tsx`, `components/ui/SectionHeading.tsx`, `components/ui/icons.tsx`
- Test: `tests/brand-assets.spec.ts`, `tests/quote-api.spec.ts` (existing)

**Interfaces:**
- Produces: `buttonClass(variant?: ButtonVariant, extra?: string): string`; `ButtonLink` props `{ href: string; variant?: ButtonVariant; className?: string; external?: boolean; children: ReactNode }`; `type ButtonVariant = "primary" | "outline" | "whatsapp" | "light"`; `SectionHeading` props `{ id?: string; label: string; title: string; link?: { href: string; label: string }; as?: "h1" | "h2" }`; icons `SearchIcon`, `BagIcon`, `CATEGORY_ICONS: Record<string, (p: { className?: string }) => JSX.Element>`; CSS class `.dot-pattern`; Tailwind colours `line`, `ink`, `tint-cyan`, `tint-pink`, `tint-butter`, `ochre`.

- [ ] **Step 1: Make tests never send real email**

`.env.local` holds the real Gmail credentials; the existing `quote-form`/`quote-api` specs currently email the sales inbox. Next's env loader never overrides a variable that is already set (even to `""`), so blanking them for the test server forces the "log only" path. Replace `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

// Own port so tests never reuse a developer's `npm run dev` (which has the real
// SMTP credentials from .env.local loaded).
const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    // Blank SMTP so /api/quote logs submissions instead of emailing them.
    // Next's env loader won't override a variable that's already set.
    env: { SMTP_HOST: "", SMTP_USER: "", SMTP_PASS: "", QUOTE_TO: "" },
  },
});
```

- [ ] **Step 2: Verify no email is sent**

Run: `npx playwright test tests/quote-api.spec.ts --reporter=line`
Expected: 2 passed, and the piped server output contains `[quote] new submission (mail not configured)`. If it does not, STOP and report — do not run any quote test until it does.

- [ ] **Step 3: Update the brand-assets test for the light theme (failing test)**

In `tests/brand-assets.spec.ts` change the manifest assertion:

```ts
  expect(manifest.theme_color).toBe("#F7F5F0");
```

Run: `npx playwright test tests/brand-assets.spec.ts`
Expected: FAIL (`#0A0A0C` received).

- [ ] **Step 4: Replace the design tokens**

In `app/globals.css` replace the first `@theme { … }` block with:

```css
@theme {
  --color-base: #f7f5f0;
  --color-surface: #fffdf8;
  --color-primary: #16140f;
  --color-muted: #6b6860;
  --color-line: #e7e3da;
  --color-ink: #16140f;
  --color-tint-cyan: #dcf1f8;
  --color-tint-pink: #fbe1ef;
  --color-tint-butter: #fff6c7;
  --color-ochre: #9a7b00;
  --color-cyan: #00aeef;
  --color-magenta: #ec008c;
  --color-yellow: #fff200;
}
```

Update the comment above it to list the new utilities (`bg-line`, `bg-ink`, `bg-tint-*`, `text-ochre`). Append after the `:root` block:

```css
/* CMYK halftone dots — product/work image placeholders */
.dot-pattern {
  background-image: radial-gradient(circle, rgb(22 20 15 / 0.12) 1.5px, transparent 1.5px);
  background-size: 14px 14px;
}
```

- [ ] **Step 5: Light manifest + OG image**

`app/manifest.ts`: set `background_color: "#F7F5F0"` and `theme_color: "#F7F5F0"`.

`app/opengraph-image.tsx`: change `background: "#0A0A0C"` → `"#F7F5F0"`, the title colour `"#FFFFFF"` → `"#16140F"`, the subtitle colour `"#A1A1AA"` → `"#6B6860"`. Leave the three CMYK dots.

- [ ] **Step 6: Create `components/ui/ButtonLink.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "whatsapp" | "light";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:opacity-40";

/** Literal class strings per variant (never build these by concatenation). */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-surface hover:bg-primary/85",
  outline: "border border-line bg-surface text-primary hover:border-primary",
  whatsapp: "bg-[#25D366] text-white hover:brightness-95",
  light: "bg-surface text-primary hover:bg-surface/85",
};

/** Shared button look for <button>s and links. */
export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}

export default function ButtonLink({
  href,
  variant = "primary",
  className = "",
  external = false,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  /** Opens in a new tab (WhatsApp, socials). */
  external?: boolean;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass(variant, className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 7: Create `components/ui/SectionHeading.tsx`**

```tsx
import Link from "next/link";

/** SKO-style section header: small uppercase label, title, optional "View all →". */
export default function SectionHeading({
  id,
  label,
  title,
  link,
  as: Heading = "h2",
}: {
  id?: string;
  label: string;
  title: string;
  link?: { href: string; label: string };
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
        <Heading
          id={id}
          className="mt-2 font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl"
        >
          {title}
        </Heading>
      </div>
      {link && (
        <Link
          href={link.href}
          className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-magenta"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create `components/ui/icons.tsx`**

```tsx
type IconProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function PrinterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M7 14h10v7H7z" />
    </svg>
  );
}

function PenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="m12 19 7-7 3 3-7 7-3-3Z" />
      <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function SignIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M12 3v18" />
      <path d="M5 6h12l3 3-3 3H5z" />
    </svg>
  );
}

function NotebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 3v18M12 8h4M12 12h4" />
    </svg>
  );
}

function MonitorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

/** One icon per SITE.services slug. */
export const CATEGORY_ICONS: Record<string, (p: IconProps) => React.JSX.Element> = {
  printing: PrinterIcon,
  "graphic-design-branding": PenIcon,
  "signage-advertising": SignIcon,
  "stationery-supplies": NotebookIcon,
  "web-development": MonitorIcon,
};
```

- [ ] **Step 9: Verify**

Run: `npx playwright test tests/brand-assets.spec.ts && npm run typecheck && npm run lint`
Expected: PASS / no errors. (The site now renders light; old dark-styled sections look rough until their tasks — expected mid-branch.)

- [ ] **Step 10: Commit**

```bash
git add playwright.config.ts app/globals.css app/manifest.ts app/opengraph-image.tsx components/ui/ButtonLink.tsx components/ui/SectionHeading.tsx components/ui/icons.tsx tests/brand-assets.spec.ts
git commit -m "feat: light storefront design tokens, UI primitives, email-safe test server

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Product catalogue data

**Files:**
- Create: `lib/products.ts`
- Test: `tests/unit-products.spec.ts`

**Interfaces:**
- Produces:
  - `type CategorySlug = (typeof SITE.services)[number]["slug"]`
  - `type ProductBadge = "Popular" | "Fast turnaround" | "New"`
  - `interface Product { slug: string; name: string; category: CategorySlug; blurb: string; options?: string[]; image?: string; badge?: ProductBadge; featured?: boolean }`
  - `CATEGORY_SHORT: Record<CategorySlug, string>`
  - `PRODUCTS: Product[]`, `PRODUCT_SLUGS: ReadonlySet<string>`
  - `isCategory(v: unknown): v is CategorySlug`
  - `getProduct(slug: string): Product | undefined`
  - `productsByCategory(category: string): Product[]`
  - `featuredProducts(): Product[]` (first 2 with `featured`)
  - `mostRequested(limit?: number): Product[]` (badged first, default 8)
  - `relatedProducts(product: Product, limit?: number): Product[]` (default 4)
  - `searchProducts(query: string, pool?: Product[]): Product[]`

- [ ] **Step 1: Write the failing test** — `tests/unit-products.spec.ts`

```ts
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  PRODUCTS,
  CATEGORY_SHORT,
  featuredProducts,
  getProduct,
  isCategory,
  mostRequested,
  productsByCategory,
  relatedProducts,
  searchProducts,
} from "../lib/products";
import { SITE } from "../lib/site";

test("product slugs are unique and URL-safe", () => {
  const slugs = PRODUCTS.map((p) => p.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test("every category has products and a short label", () => {
  for (const s of SITE.services) {
    expect(productsByCategory(s.slug).length).toBeGreaterThan(0);
    expect(CATEGORY_SHORT[s.slug]).toBeTruthy();
  }
});

test("every product image file exists in public/", () => {
  for (const p of PRODUCTS) {
    if (p.image) {
      expect(existsSync(join(process.cwd(), "public", p.image)), p.image).toBe(true);
    }
  }
});

test("exactly two featured products for the hero", () => {
  expect(featuredProducts()).toHaveLength(2);
});

test("mostRequested lists badged products first and respects the limit", () => {
  const list = mostRequested(8);
  expect(list).toHaveLength(8);
  expect(list.every((p) => p.badge)).toBe(true);
  expect(mostRequested(3)).toHaveLength(3);
});

test("getProduct finds by slug", () => {
  expect(getProduct("business-cards")?.name).toBe("Business Cards");
  expect(getProduct("nope")).toBeUndefined();
});

test("search is case-insensitive and needs every term", () => {
  expect(searchProducts("CARDS business").map((p) => p.slug)).toContain("business-cards");
  expect(searchProducts("banner").map((p) => p.slug)).toEqual(
    expect.arrayContaining(["vinyl-banners", "roll-up-banners"]),
  );
  expect(searchProducts("zzzz")).toEqual([]);
  expect(searchProducts("<script>")).toEqual([]);
});

test("blank search returns the whole pool", () => {
  expect(searchProducts("   ")).toHaveLength(PRODUCTS.length);
  const pool = productsByCategory("printing");
  expect(searchProducts("", pool)).toEqual(pool);
});

test("isCategory only accepts real category slugs", () => {
  expect(isCategory("printing")).toBe(true);
  expect(isCategory("nonsense")).toBe(false);
  expect(isCategory(undefined)).toBe(false);
});

test("relatedProducts stays in category and excludes itself", () => {
  const product = getProduct("business-cards")!;
  const related = relatedProducts(product);
  expect(related.length).toBeGreaterThan(0);
  expect(related.length).toBeLessThanOrEqual(4);
  expect(related.every((p) => p.category === "printing" && p.slug !== product.slug)).toBe(true);
});
```

- [ ] **Step 2: Run to confirm it fails**

Run: `npx playwright test tests/unit-products.spec.ts`
Expected: FAIL — cannot resolve `../lib/products`.

- [ ] **Step 3: Implement `lib/products.ts`**

```ts
import { SITE } from "./site";

export type CategorySlug = (typeof SITE.services)[number]["slug"];
export type ProductBadge = "Popular" | "Fast turnaround" | "New";

export interface Product {
  /** Unique, URL-safe — becomes /shop/<slug>. */
  slug: string;
  name: string;
  category: CategorySlug;
  /** One line of honest spec shown on the card. */
  blurb: string;
  /** Selectable choices on the product page (one may be chosen). */
  options?: string[];
  /** Path under /public. Leave out to show the branded placeholder. */
  image?: string;
  badge?: ProductBadge;
  /** Shown in the home hero (first two). */
  featured?: boolean;
}

/** Short names for chips and cards ("Printing Services" → "Printing"). */
export const CATEGORY_SHORT: Record<CategorySlug, string> = {
  printing: "Printing",
  "graphic-design-branding": "Design & Branding",
  "signage-advertising": "Signage",
  "stationery-supplies": "Stationery",
  "web-development": "Web",
};

/**
 * The catalogue. Edit names/blurbs/options freely; keep slugs stable once live
 * (they are page URLs and live in visitors' saved quotes). No prices — every
 * product is quoted on request.
 */
export const PRODUCTS: Product[] = [
  // ── Printing ─────────────────────────────────────────────
  {
    slug: "business-cards",
    name: "Business Cards",
    category: "printing",
    blurb: "Single or double-sided on premium card — matte, gloss or spot UV finish.",
    options: ["Matte", "Gloss", "Spot UV"],
    image: "/showcase/business-cards.jpg",
    badge: "Popular",
    featured: true,
  },
  {
    slug: "flyers-brochures",
    name: "Flyers & Brochures",
    category: "printing",
    blurb: "Promote events, menus and offers — A5, A4 or DL, folded or flat.",
    options: ["A5", "A4", "DL"],
    image: "/showcase/flyers.jpg",
    badge: "Popular",
  },
  {
    slug: "posters-large-format",
    name: "Posters & Large Format",
    category: "printing",
    blurb: "Eye-catching posters from A3 up to A0 and beyond, indoor or outdoor.",
    options: ["A3", "A2", "A1", "A0"],
    image: "/showcase/large-format-printing.jpg",
  },
  {
    slug: "vinyl-banners",
    name: "Vinyl Banners",
    category: "printing",
    blurb: "Weatherproof banners for shopfronts, events and fences, any size.",
    options: ["Eyelets", "Pole pockets"],
    image: "/showcase/banners.jpg",
    badge: "Fast turnaround",
    featured: true,
  },
  {
    slug: "booklets-manuals",
    name: "Booklets & Manuals",
    category: "printing",
    blurb: "Programmes, catalogues and training manuals, stapled or bound.",
    options: ["Saddle-stitched", "Perfect bound"],
  },
  {
    slug: "stickers-labels",
    name: "Stickers & Labels",
    category: "printing",
    blurb: "Product labels and promo stickers, cut to any shape.",
    options: ["Gloss", "Matte", "Die-cut"],
    image: "/showcase/stickers.jpg",
    badge: "New",
  },
  // ── Graphic design & branding ────────────────────────────
  {
    slug: "logo-design",
    name: "Logo Design",
    category: "graphic-design-branding",
    blurb: "A distinctive logo with concepts, revisions and print-ready files.",
    badge: "Popular",
  },
  {
    slug: "brand-identity",
    name: "Brand Identity",
    category: "graphic-design-branding",
    blurb: "Logo, colours, type and templates that make your business recognisable.",
    image: "/showcase/branding.jpg",
  },
  {
    slug: "social-media-kits",
    name: "Social Media Kits",
    category: "graphic-design-branding",
    blurb: "Branded post and story templates for your channels.",
  },
  {
    slug: "marketing-collateral",
    name: "Marketing Collateral",
    category: "graphic-design-branding",
    blurb: "Designed flyers, brochures and presentations ready for print or screen.",
  },
  {
    slug: "packaging-design",
    name: "Packaging Design",
    category: "graphic-design-branding",
    blurb: "Boxes, bags and labels designed to stand out on the shelf.",
  },
  {
    slug: "brand-guidelines",
    name: "Brand Guidelines",
    category: "graphic-design-branding",
    blurb: "A simple guide so everyone uses your brand consistently.",
  },
  // ── Signage & advertising ────────────────────────────────
  {
    slug: "roll-up-banners",
    name: "Roll-up Banners",
    category: "signage-advertising",
    blurb: "Portable pull-up banners for events, expos and reception areas.",
    options: ["Standard 85 × 200 cm", "Wide 100 × 200 cm"],
    badge: "Popular",
  },
  {
    slug: "shopfront-signage",
    name: "Shopfront Signage",
    category: "signage-advertising",
    blurb: "Fascia boards and shop signs, made and installed.",
    image: "/showcase/signage.jpg",
  },
  {
    slug: "vehicle-branding",
    name: "Vehicle Branding",
    category: "signage-advertising",
    blurb: "Decals and wraps that turn your vehicles into adverts.",
    options: ["Decals", "Partial wrap", "Full wrap"],
  },
  {
    slug: "event-displays",
    name: "Event Displays",
    category: "signage-advertising",
    blurb: "Pop-up walls, backdrops and table covers for events.",
  },
  {
    slug: "billboard-printing",
    name: "Billboard Printing",
    category: "signage-advertising",
    blurb: "Large-format outdoor billboard skins, printed to spec.",
  },
  {
    slug: "directional-signs",
    name: "Directional & Safety Signs",
    category: "signage-advertising",
    blurb: "Clear wayfinding and safety signage for offices and sites.",
  },
  // ── Stationery & supplies ────────────────────────────────
  {
    slug: "letterheads",
    name: "Letterheads",
    category: "stationery-supplies",
    blurb: "Branded letterheads on quality bond paper.",
    options: ["80gsm", "100gsm"],
    image: "/showcase/stationery.jpg",
  },
  {
    slug: "receipt-books",
    name: "Invoice & Receipt Books",
    category: "stationery-supplies",
    blurb: "Numbered, carbonless duplicate or triplicate books.",
    options: ["Duplicate", "Triplicate"],
    badge: "Popular",
  },
  {
    slug: "branded-notebooks",
    name: "Branded Notebooks",
    category: "stationery-supplies",
    blurb: "Notebooks with your logo for staff, clients and events.",
    options: ["A5", "A4"],
  },
  {
    slug: "company-folders",
    name: "Company Folders",
    category: "stationery-supplies",
    blurb: "Presentation folders with pockets for proposals and documents.",
  },
  {
    slug: "envelopes",
    name: "Envelopes",
    category: "stationery-supplies",
    blurb: "Printed envelopes in standard sizes.",
    options: ["DL", "C5", "C4"],
  },
  {
    slug: "office-printing",
    name: "Office Printing Supplies",
    category: "stationery-supplies",
    blurb: "Everyday office printing and supplies, sorted in one order.",
  },
  // ── Web development ──────────────────────────────────────
  {
    slug: "business-websites",
    name: "Business Websites",
    category: "web-development",
    blurb: "A fast, mobile-first website that shows customers who you are.",
    badge: "Popular",
  },
  {
    slug: "landing-pages",
    name: "Landing Pages",
    category: "web-development",
    blurb: "A focused single page for a campaign, product or event.",
  },
  {
    slug: "ecommerce-stores",
    name: "E-commerce Stores",
    category: "web-development",
    blurb: "An online store to show products and take orders.",
  },
  {
    slug: "website-redesigns",
    name: "Website Redesigns",
    category: "web-development",
    blurb: "Refresh an outdated site with a modern look and better speed.",
  },
  {
    slug: "hosting-domains",
    name: "Hosting & Domains",
    category: "web-development",
    blurb: "Domain registration, hosting and business email set-up.",
  },
  {
    slug: "website-maintenance",
    name: "Maintenance & Support",
    category: "web-development",
    blurb: "Updates, backups and fixes so your site keeps running.",
  },
];

export const PRODUCT_SLUGS: ReadonlySet<string> = new Set(PRODUCTS.map((p) => p.slug));

export function isCategory(value: unknown): value is CategorySlug {
  return typeof value === "string" && SITE.services.some((s) => s.slug === value);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, 2);
}

/** Badged products first, then the rest in catalogue order. */
export function mostRequested(limit = 8): Product[] {
  const badged = PRODUCTS.filter((p) => p.badge);
  const rest = PRODUCTS.filter((p) => !p.badge);
  return [...badged, ...rest].slice(0, limit);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, limit);
}

/** Case-insensitive; every whitespace-separated term must appear somewhere in
    the name, blurb, category or options. Blank query returns the pool. */
export function searchProducts(query: string, pool: Product[] = PRODUCTS): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return pool;
  return pool.filter((p) => {
    const haystack = [p.name, p.blurb, CATEGORY_SHORT[p.category], ...(p.options ?? [])]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
```

- [ ] **Step 4: Run tests**

Run: `npx playwright test tests/unit-products.spec.ts && npm run typecheck`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/products.ts tests/unit-products.spec.ts
git commit -m "feat: product catalogue data and query helpers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Quote API accepts a list of items

**Files:**
- Modify: `lib/quote.ts`, `app/api/quote/route.ts`
- Test: `tests/unit-quote.spec.ts` (create), `tests/quote-api.spec.ts` (extend)

**Interfaces:**
- Produces:
  - `interface QuoteItem { name: string; qty: number; option?: string; note?: string }`
  - `QuoteRequest` gains `items?: QuoteItem[]`
  - `QUOTE_LIMITS = { maxItems: 50, maxQty: 100000, name: 120, option: 60, note: 500 } as const`
  - `formatQuoteItems(items: QuoteItem[]): string` — one line per item: `• Name × qty (option) — note`
  - `validateQuote(input)` unchanged signature; when non-empty `items` is present: `service` defaults to `"Multiple products (n)"`, `details` may be empty.

- [ ] **Step 1: Write failing unit tests** — `tests/unit-quote.spec.ts`

```ts
import { test, expect } from "@playwright/test";
import { formatQuoteItems, validateQuote } from "../lib/quote";

const contact = { name: "Test User", email: "test@example.com", phone: "+263 78 000 0000" };

test("legacy request without items still validates as before", () => {
  const r = validateQuote({ ...contact, service: "Printing Services", details: "500 business cards please" });
  expect(r).toEqual({
    valid: true,
    data: { ...contact, service: "Printing Services", details: "500 business cards please" },
  });
  expect(validateQuote({ ...contact, service: "", details: "500 business cards please" }).valid).toBe(false);
  expect(validateQuote({ ...contact, service: "Printing Services", details: "short" }).valid).toBe(false);
});

test("items make service and details optional", () => {
  const r = validateQuote({
    ...contact,
    service: "",
    details: "",
    items: [{ name: "  Business Cards ", qty: 500, option: "Matte", note: "" }],
  });
  expect(r).toEqual({
    valid: true,
    data: {
      ...contact,
      service: "Multiple products (1)",
      details: "",
      items: [{ name: "Business Cards", qty: 500, option: "Matte" }],
    },
  });
});

test("an empty items array falls back to the legacy rules", () => {
  expect(validateQuote({ ...contact, service: "", details: "", items: [] }).valid).toBe(false);
});

test("item rules", () => {
  const base = { ...contact, service: "", details: "" };
  const bad = [
    "nope",
    [{ name: "", qty: 1 }],
    [{ name: "x".repeat(121), qty: 1 }],
    [{ name: "Cards", qty: 0 }],
    [{ name: "Cards", qty: -1 }],
    [{ name: "Cards", qty: 2.5 }],
    [{ name: "Cards", qty: 100001 }],
    [{ name: "Cards", qty: "5" }],
    [{ name: "Cards", qty: 1, option: "o".repeat(61) }],
    [{ name: "Cards", qty: 1, note: "n".repeat(501) }],
    [null],
    Array.from({ length: 51 }, () => ({ name: "Cards", qty: 1 })),
  ];
  for (const items of bad) {
    expect(validateQuote({ ...base, items }).valid, JSON.stringify(items).slice(0, 80)).toBe(false);
  }
  expect(validateQuote({ ...base, items: [{ name: "Cards", qty: 100000 }] }).valid).toBe(true);
});

test("formatQuoteItems renders one line per item", () => {
  expect(
    formatQuoteItems([
      { name: "Business Cards", qty: 500, option: "Matte", note: "Double-sided" },
      { name: "Vinyl Banners", qty: 2 },
    ]),
  ).toBe("• Business Cards × 500 (Matte) — Double-sided\n• Vinyl Banners × 2");
});
```

Append to `tests/quote-api.spec.ts`:

```ts
test("quote API accepts a basket of items", async ({ request }) => {
  const res = await request.post("/api/quote", {
    data: {
      service: "",
      details: "",
      name: "Test User",
      email: "test@example.com",
      phone: "+263 78 000 0000",
      items: [
        { name: "Business Cards", qty: 500, option: "Matte", note: "Double-sided" },
        { name: "Vinyl Banners", qty: 2 },
      ],
    },
  });
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});

test("quote API rejects an invalid item quantity", async ({ request }) => {
  const res = await request.post("/api/quote", {
    data: {
      service: "",
      details: "",
      name: "Test User",
      email: "test@example.com",
      phone: "+263 78 000 0000",
      items: [{ name: "Business Cards", qty: 0 }],
    },
  });
  expect(res.status()).toBe(400);
  expect((await res.json()).ok).toBe(false);
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx playwright test tests/unit-quote.spec.ts tests/quote-api.spec.ts`
Expected: FAIL (`formatQuoteItems` missing; basket API test returns 400).

- [ ] **Step 3: Implement in `lib/quote.ts`** (replace the file)

```ts
export interface QuoteItem {
  name: string;
  qty: number;
  option?: string;
  note?: string;
}

export interface QuoteRequest {
  service: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  /** Products from the quote basket. When present (non-empty), service and
      details become optional. */
  items?: QuoteItem[];
}

export interface QuoteResponse {
  ok: boolean;
  error?: string;
}

export const QUOTE_LIMITS = {
  maxItems: 50,
  maxQty: 100000,
  name: 120,
  option: 60,
  note: 500,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** "• Business Cards × 500 (Matte) — Double-sided", one line per item. */
export function formatQuoteItems(items: QuoteItem[]): string {
  return items
    .map(
      (i) =>
        `• ${i.name} × ${i.qty}${i.option ? ` (${i.option})` : ""}${i.note ? ` — ${i.note}` : ""}`,
    )
    .join("\n");
}

function parseItems(
  input: unknown,
): { ok: true; items: QuoteItem[] } | { ok: false; error: string } {
  if (input === undefined || input === null) return { ok: true, items: [] };
  if (!Array.isArray(input)) return { ok: false, error: "Invalid product list." };
  if (input.length > QUOTE_LIMITS.maxItems) {
    return {
      ok: false,
      error: `Please send at most ${QUOTE_LIMITS.maxItems} products per request.`,
    };
  }
  const items: QuoteItem[] = [];
  for (const raw of input) {
    if (typeof raw !== "object" || raw === null) {
      return { ok: false, error: "Invalid product list." };
    }
    const r = raw as Record<string, unknown>;
    const name = str(r.name);
    const option = str(r.option);
    const note = str(r.note);
    if (!name || name.length > QUOTE_LIMITS.name) {
      return { ok: false, error: "Invalid product name." };
    }
    if (
      typeof r.qty !== "number" ||
      !Number.isInteger(r.qty) ||
      r.qty < 1 ||
      r.qty > QUOTE_LIMITS.maxQty
    ) {
      return {
        ok: false,
        error: `Quantities must be whole numbers from 1 to ${QUOTE_LIMITS.maxQty}.`,
      };
    }
    if (option.length > QUOTE_LIMITS.option) {
      return { ok: false, error: "Product option is too long." };
    }
    if (note.length > QUOTE_LIMITS.note) {
      return { ok: false, error: "Product note is too long." };
    }
    items.push({
      name,
      qty: r.qty,
      ...(option ? { option } : {}),
      ...(note ? { note } : {}),
    });
  }
  return { ok: true, items };
}

export function validateQuote(
  input: unknown,
):
  | { valid: true; data: QuoteRequest }
  | { valid: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { valid: false, error: "Invalid request body." };
  }
  const r = input as Record<string, unknown>;
  const service = str(r.service);
  const details = str(r.details);
  const name = str(r.name);
  const email = str(r.email);
  const phone = str(r.phone);

  const parsed = parseItems(r.items);
  if (!parsed.ok) return { valid: false, error: parsed.error };
  const { items } = parsed;
  const hasItems = items.length > 0;

  if (!service && !hasItems) return { valid: false, error: "Please choose a service." };
  if (!name) return { valid: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  if (!phone) return { valid: false, error: "Please enter a phone number." };
  if (!hasItems && details.length < 10) {
    return { valid: false, error: "Please tell us a little more about your project." };
  }

  return {
    valid: true,
    data: {
      service: service || `Multiple products (${items.length})`,
      details,
      name,
      email,
      phone,
      ...(hasItems ? { items } : {}),
    },
  };
}
```

- [ ] **Step 4: List items in the email** — `app/api/quote/route.ts`

Change the import to `import { formatQuoteItems, validateQuote, type QuoteRequest, type QuoteResponse } from "@/lib/quote";` and replace the `text:` array in `sendMail` with:

```ts
    text: [
      `Service: ${data.service}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      ...(data.items?.length ? ["", "Products:", formatQuoteItems(data.items)] : []),
      "",
      data.details || "(no extra message)",
    ].join("\n"),
```

- [ ] **Step 5: Run tests**

Run: `npx playwright test tests/unit-quote.spec.ts tests/quote-api.spec.ts && npm run typecheck`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/quote.ts app/api/quote/route.ts tests/unit-quote.spec.ts tests/quote-api.spec.ts
git commit -m "feat: quote API accepts a basket of product items

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Pure basket logic

**Files:**
- Create: `lib/basket.ts`
- Test: `tests/unit-basket.spec.ts`

**Interfaces:**
- Consumes: `PRODUCT_SLUGS`, `getProduct` (Task 2); `QuoteItem`, `QUOTE_LIMITS`, `formatQuoteItems` (Task 3).
- Produces:
  - `BASKET_KEY = "pc-quote-basket"`
  - `interface BasketItem { slug: string; qty: number; option?: string; note?: string }`
  - `interface AddInput { slug: string; qty?: number; option?: string; note?: string }`
  - `itemKey(item: { slug: string; option?: string }): string` — `"<slug>|<option or empty>"`; a line is identified by slug **and** option (500 matte + 200 gloss cards are two lines)
  - `clampQty(value: unknown): number` — integer 1–100000; non-numeric → 1
  - `parseBasket(raw: string | null, known: ReadonlySet<string>): BasketItem[]`
  - `addItem(items: BasketItem[], input: AddInput): BasketItem[]` — same key → qty added; returns **the same array reference** when the basket is full (50) and the key is new
  - `updateItem(items, key, patch: { qty?: number; note?: string }): BasketItem[]`
  - `removeItem(items, key): BasketItem[]`
  - `toQuoteItems(items: BasketItem[]): QuoteItem[]` — product names; unknown slugs dropped
  - `buildWhatsAppMessage(items: QuoteItem[]): string`
  - `whatsappHref(base: string, items: QuoteItem[]): string`

- [ ] **Step 1: Write failing tests** — `tests/unit-basket.spec.ts`

```ts
import { test, expect } from "@playwright/test";
import {
  addItem,
  buildWhatsAppMessage,
  clampQty,
  itemKey,
  parseBasket,
  removeItem,
  toQuoteItems,
  updateItem,
  whatsappHref,
  type BasketItem,
} from "../lib/basket";
import { PRODUCT_SLUGS } from "../lib/products";

test("clampQty always yields an integer from 1 to 100000", () => {
  const cases: [unknown, number][] = [
    [5, 5], ["42", 42], [0, 1], [-3, 1], [2.9, 2], ["", 1], ["abc", 1],
    [NaN, 1], [Infinity, 1], [9_999_999, 100000], [undefined, 1],
  ];
  for (const [input, expected] of cases) expect(clampQty(input), String(input)).toBe(expected);
});

test("parseBasket tolerates garbage", () => {
  expect(parseBasket(null, PRODUCT_SLUGS)).toEqual([]);
  expect(parseBasket("{not json", PRODUCT_SLUGS)).toEqual([]);
  expect(parseBasket('{"a":1}', PRODUCT_SLUGS)).toEqual([]);
  expect(
    parseBasket(
      JSON.stringify([
        null,
        "x",
        { slug: "deleted-product", qty: 1 },
        { slug: "business-cards", qty: "abc" },
        { slug: "vinyl-banners", qty: 3, option: 7, note: "n".repeat(600) },
      ]),
      PRODUCT_SLUGS,
    ),
  ).toEqual([
    { slug: "business-cards", qty: 1 },
    { slug: "vinyl-banners", qty: 3, note: "n".repeat(500) },
  ]);
});

test("parseBasket merges duplicates and caps at 50 lines", () => {
  const dupes = JSON.stringify([
    { slug: "business-cards", qty: 2, option: "Matte" },
    { slug: "business-cards", qty: 3, option: "Matte" },
  ]);
  expect(parseBasket(dupes, PRODUCT_SLUGS)).toEqual([
    { slug: "business-cards", qty: 5, option: "Matte" },
  ]);
  const many = JSON.stringify(
    Array.from({ length: 60 }, (_, i) => ({ slug: "business-cards", qty: 1, option: `o${i}` })),
  );
  expect(parseBasket(many, PRODUCT_SLUGS)).toHaveLength(50);
});

test("addItem increments the same slug+option and splits different options", () => {
  let items: BasketItem[] = [];
  items = addItem(items, { slug: "business-cards", option: "Matte" });
  items = addItem(items, { slug: "business-cards", option: "Matte", qty: 499 });
  items = addItem(items, { slug: "business-cards", option: "Gloss", qty: 200, note: "Rush" });
  expect(items).toEqual([
    { slug: "business-cards", qty: 500, option: "Matte" },
    { slug: "business-cards", qty: 200, option: "Gloss", note: "Rush" },
  ]);
});

test("addItem returns the same array when the basket is full", () => {
  const full = Array.from({ length: 50 }, (_, i) => ({ slug: "business-cards", qty: 1, option: `o${i}` }));
  expect(addItem(full, { slug: "vinyl-banners" })).toBe(full);
  // an existing line can still be incremented
  expect(addItem(full, { slug: "business-cards", option: "o0" })[0].qty).toBe(2);
});

test("updateItem and removeItem target one line by key", () => {
  const items: BasketItem[] = [
    { slug: "business-cards", qty: 1, option: "Matte" },
    { slug: "vinyl-banners", qty: 1 },
  ];
  const key = itemKey(items[0]);
  expect(updateItem(items, key, { qty: 0, note: " Logo on back " })[0]).toEqual({
    slug: "business-cards",
    qty: 1,
    option: "Matte",
    note: " Logo on back ",
  });
  expect(updateItem(items, key, { qty: 250 })[0].qty).toBe(250);
  expect(removeItem(items, key)).toEqual([{ slug: "vinyl-banners", qty: 1 }]);
});

test("toQuoteItems uses product names and drops unknown slugs", () => {
  expect(
    toQuoteItems([
      { slug: "business-cards", qty: 500, option: "Matte", note: "Double-sided" },
      { slug: "gone", qty: 1 },
    ]),
  ).toEqual([{ name: "Business Cards", qty: 500, option: "Matte", note: "Double-sided" }]);
});

test("WhatsApp text round-trips special characters", () => {
  const items = [{ name: "Business Cards", qty: 500, note: "Logo & #1 slogan\nline two 🎉" }];
  expect(buildWhatsAppMessage(items)).toBe(
    "Hi Print Circuit, I'd like a quote for:\n• Business Cards × 500 — Logo & #1 slogan\nline two 🎉",
  );
  const href = whatsappHref("https://wa.me/263788723331", items);
  expect(href.startsWith("https://wa.me/263788723331?text=")).toBe(true);
  const text = new URL(href).searchParams.get("text");
  expect(text).toBe(buildWhatsAppMessage(items));
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx playwright test tests/unit-basket.spec.ts`
Expected: FAIL — cannot resolve `../lib/basket`.

- [ ] **Step 3: Implement `lib/basket.ts`**

```ts
import { getProduct } from "./products";
import { QUOTE_LIMITS, formatQuoteItems, type QuoteItem } from "./quote";

/** localStorage key for the visitor's quote basket. */
export const BASKET_KEY = "pc-quote-basket";

export interface BasketItem {
  slug: string;
  qty: number;
  option?: string;
  note?: string;
}

export interface AddInput {
  slug: string;
  qty?: number;
  option?: string;
  note?: string;
}

/** A basket line is one product + one option. */
export function itemKey(item: { slug: string; option?: string }): string {
  return `${item.slug}|${item.option ?? ""}`;
}

/** Any input → an integer between 1 and the max quantity. */
export function clampQty(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(QUOTE_LIMITS.maxQty, Math.max(1, Math.floor(n)));
}

function cleanText(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value !== "" ? value.slice(0, max) : undefined;
}

function line(slug: string, qty: number, option?: string, note?: string): BasketItem {
  return { slug, qty, ...(option ? { option } : {}), ...(note ? { note } : {}) };
}

/** Read whatever is in storage; anything unexpected is dropped, never thrown. */
export function parseBasket(raw: string | null, known: ReadonlySet<string>): BasketItem[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  let items: BasketItem[] = [];
  for (const entry of data) {
    if (typeof entry !== "object" || entry === null) continue;
    const r = entry as Record<string, unknown>;
    if (typeof r.slug !== "string" || !known.has(r.slug)) continue;
    items = addItem(items, {
      slug: r.slug,
      qty: clampQty(r.qty),
      option: cleanText(r.option, QUOTE_LIMITS.option),
      note: cleanText(r.note, QUOTE_LIMITS.note),
    });
  }
  return items;
}

/** Adds a line, or increases the quantity of the matching slug+option line.
    Returns the same array when a new line would exceed the 50-line limit. */
export function addItem(items: BasketItem[], input: AddInput): BasketItem[] {
  const key = itemKey(input);
  const qty = clampQty(input.qty ?? 1);
  const existing = items.find((i) => itemKey(i) === key);
  if (existing) {
    return items.map((i) =>
      i === existing
        ? line(i.slug, clampQty(i.qty + qty), i.option, input.note ?? i.note)
        : i,
    );
  }
  if (items.length >= QUOTE_LIMITS.maxItems) return items;
  return [...items, line(input.slug, qty, input.option, input.note)];
}

export function updateItem(
  items: BasketItem[],
  key: string,
  patch: { qty?: number; note?: string },
): BasketItem[] {
  return items.map((i) =>
    itemKey(i) === key
      ? line(
          i.slug,
          patch.qty === undefined ? i.qty : clampQty(patch.qty),
          i.option,
          patch.note === undefined ? i.note : patch.note.slice(0, QUOTE_LIMITS.note),
        )
      : i,
  );
}

export function removeItem(items: BasketItem[], key: string): BasketItem[] {
  return items.filter((i) => itemKey(i) !== key);
}

/** Basket lines → the API/WhatsApp shape, with product names. */
export function toQuoteItems(items: BasketItem[]): QuoteItem[] {
  return items.flatMap((i) => {
    const product = getProduct(i.slug);
    if (!product) return [];
    const note = i.note?.trim();
    return [
      {
        name: product.name,
        qty: i.qty,
        ...(i.option ? { option: i.option } : {}),
        ...(note ? { note } : {}),
      },
    ];
  });
}

export function buildWhatsAppMessage(items: QuoteItem[]): string {
  return `Hi Print Circuit, I'd like a quote for:\n${formatQuoteItems(items)}`;
}

export function whatsappHref(base: string, items: QuoteItem[]): string {
  return `${base}?text=${encodeURIComponent(buildWhatsAppMessage(items))}`;
}
```

Note: `updateItem` keeps the note untrimmed while typing (trimming happens in `toQuoteItems`) so the cursor doesn't jump.

- [ ] **Step 4: Run tests**

Run: `npx playwright test tests/unit-basket.spec.ts && npm run typecheck`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/basket.ts tests/unit-basket.spec.ts
git commit -m "feat: pure quote-basket logic with WhatsApp message builder

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Basket state, product cards and the `/shop` page

**Files:**
- Create: `components/shop/basket-store.ts`, `components/shop/BasketProvider.tsx`, `components/shop/AddToQuoteButton.tsx`, `components/shop/ProductImage.tsx`, `components/shop/ProductCard.tsx`, `components/shop/ProductGrid.tsx`, `app/shop/page.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/shop.spec.ts`

**Interfaces:**
- Consumes: Task 2 (`PRODUCTS`, `PRODUCT_SLUGS`, `CATEGORY_SHORT`, `isCategory`, `productsByCategory`, `searchProducts`, `getProduct`, `Product`, `CategorySlug`), Task 4 (`BASKET_KEY`, `parseBasket`, `addItem`, `updateItem`, `removeItem`, `BasketItem`, `AddInput`), Task 1 (`buttonClass`).
- Produces:
  - `useBasket(): BasketApi` where `BasketApi = { items: BasketItem[]; count: number; has(slug: string): boolean; add(input: AddInput): void; update(key: string, patch: { qty?: number; note?: string }): void; remove(key: string): void; clear(): void; isOpen: boolean; open(): void; close(): void; notice: string | null }`
  - `<BasketProvider>` (default export) mounted in `app/layout.tsx`
  - `<ProductImage product sizes priority? className?>`, `<ProductCard product>` (renders `<article aria-labelledby>` named by the product), `<ProductGrid products label?>` (renders `<ul>`), `<AddToQuoteButton slug className? tone?: "outline" | "light">` (text "+ Add to quote" / "✓ In your quote")

- [ ] **Step 1: Write the failing e2e test** — `tests/shop.spec.ts`

```ts
import { test, expect } from "@playwright/test";
import { PRODUCTS, productsByCategory, searchProducts } from "../lib/products";

test("shop lists every product", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { level: 1, name: "Shop all" })).toBeVisible();
  await expect(page.locator("main").getByRole("article")).toHaveCount(PRODUCTS.length);
});

test("category chips filter the grid", async ({ page }) => {
  await page.goto("/shop?cat=signage-advertising");
  await expect(page.getByRole("heading", { level: 1, name: "Signage" })).toBeVisible();
  await expect(page.locator("main").getByRole("article")).toHaveCount(
    productsByCategory("signage-advertising").length,
  );
  // Scoped: the footer (Task 9) also has a "Signage" link.
  await expect(
    page.getByRole("navigation", { name: "Categories" }).getByRole("link", { name: "Signage", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("search narrows results", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("searchbox", { name: "Search the catalogue" }).fill("business cards");
  await page.getByRole("searchbox", { name: "Search the catalogue" }).press("Enter");
  await expect(page).toHaveURL(/\/shop\?q=business\+cards/);
  await expect(page.getByRole("article", { name: "Business Cards" })).toBeVisible();
  await expect(page.locator("main").getByRole("article")).toHaveCount(
    searchProducts("business cards").length,
  );
});

test("no results shows a custom-quote way out", async ({ page }) => {
  await page.goto("/shop?q=zzzz");
  await expect(page.getByText(/Can.t find it\?/)).toBeVisible();
  await expect(page.getByRole("link", { name: /custom quote/i })).toHaveAttribute("href", "/contact");
});

test("odd query strings don't break the page", async ({ page }) => {
  for (const url of ["/shop?cat=nonsense", "/shop?q=%20%20%20", "/shop?q=%3Cscript%3E"]) {
    const res = await page.goto(url);
    expect(res?.status(), url).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/shop?cat=nonsense");
  await expect(page.locator("main").getByRole("article")).toHaveCount(PRODUCTS.length);
  await page.goto("/shop?cat=printing&cat=web-development");
  await expect(page.getByRole("heading", { level: 1, name: "Printing" })).toBeVisible();
});

test("add to quote persists across reloads", async ({ page }) => {
  await page.goto("/shop");
  const card = page.getByRole("article", { name: "Business Cards" });
  await card.getByRole("button", { name: "+ Add to quote" }).click();
  await expect(card.getByRole("button", { name: "✓ In your quote" })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("article", { name: "Business Cards" }).getByRole("button", { name: "✓ In your quote" }),
  ).toBeVisible();
});

test("basket still works when storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("storage blocked");
      },
    });
  });
  await page.goto("/shop");
  const card = page.getByRole("article", { name: "Vinyl Banners" });
  await card.getByRole("button", { name: "+ Add to quote" }).click();
  await expect(card.getByRole("button", { name: "✓ In your quote" })).toBeVisible();
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx playwright test tests/shop.spec.ts`
Expected: FAIL — `/shop` is a 404.

- [ ] **Step 3: Create `components/shop/basket-store.ts`**

```ts
import { BASKET_KEY, parseBasket, type BasketItem } from "@/lib/basket";
import { PRODUCT_SLUGS } from "@/lib/products";

// External store for useSyncExternalStore: one cached array per change so
// snapshots are referentially stable; storage failures fall back to memory.
const EMPTY: BasketItem[] = [];
const listeners = new Set<() => void>();
let current: BasketItem[] | null = null;

function load(): BasketItem[] {
  try {
    return parseBasket(window.localStorage.getItem(BASKET_KEY), PRODUCT_SLUGS);
  } catch {
    return EMPTY;
  }
}

export function getSnapshot(): BasketItem[] {
  if (current === null) current = load();
  return current;
}

export function getServerSnapshot(): BasketItem[] {
  return EMPTY;
}

export function setBasket(next: BasketItem[]): void {
  current = next;
  try {
    window.localStorage.setItem(BASKET_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode etc.) — keep the basket in memory for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === BASKET_KEY) {
      current = load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
```

- [ ] **Step 4: Create `components/shop/BasketProvider.tsx`**

```tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addItem, removeItem, updateItem, type AddInput, type BasketItem } from "@/lib/basket";
import { getProduct } from "@/lib/products";
import { getServerSnapshot, getSnapshot, setBasket, subscribe } from "./basket-store";

export interface BasketApi {
  items: BasketItem[];
  /** Number of lines (not total quantity). */
  count: number;
  has(slug: string): boolean;
  add(input: AddInput): void;
  update(key: string, patch: { qty?: number; note?: string }): void;
  remove(key: string): void;
  clear(): void;
  isOpen: boolean;
  open(): void;
  close(): void;
  /** Short "added" message for the toast; null when hidden. */
  notice: string | null;
}

const BasketContext = createContext<BasketApi | null>(null);

export function useBasket(): BasketApi {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}

export default function BasketProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(id);
  }, [notice]);

  const api = useMemo<BasketApi>(
    () => ({
      items,
      count: items.length,
      has: (slug) => items.some((i) => i.slug === slug),
      add: (input) => {
        const before = getSnapshot();
        const next = addItem(before, input);
        if (next === before) {
          setNotice("Your quote is full (50 items) — send it, then start another.");
          return;
        }
        setBasket(next);
        setNotice(`${getProduct(input.slug)?.name ?? "Item"} added to your quote`);
      },
      update: (key, patch) => setBasket(updateItem(getSnapshot(), key, patch)),
      remove: (key) => setBasket(removeItem(getSnapshot(), key)),
      clear: () => setBasket([]),
      isOpen,
      open: () => {
        setNotice(null);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
      notice,
    }),
    [items, isOpen, notice],
  );

  return <BasketContext.Provider value={api}>{children}</BasketContext.Provider>;
}
```

- [ ] **Step 5: Mount the provider** — `app/layout.tsx`

Add `import BasketProvider from "@/components/shop/BasketProvider";` and wrap the body contents:

```tsx
      <body className="min-h-full flex flex-col bg-base text-primary font-body antialiased">
        <JsonLd />
        <BasketProvider>
          <SmoothScroll>
            <Navbar />
            {children}
            <Footer />
          </SmoothScroll>
          <FloatingButtons />
        </BasketProvider>
        <Analytics />
        <SpeedInsights />
      </body>
```

- [ ] **Step 6: Create `components/shop/AddToQuoteButton.tsx`**

```tsx
"use client";

import { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "./BasketProvider";

export default function AddToQuoteButton({
  slug,
  className = "",
  tone = "outline",
}: {
  slug: string;
  className?: string;
  /** "light" for use on the dark ink card. */
  tone?: "outline" | "light";
}) {
  const { has, add, open } = useBasket();

  if (has(slug)) {
    return (
      <button
        type="button"
        onClick={open}
        className={`${buttonClass("outline", className)} border-magenta/30 bg-tint-pink`}
      >
        ✓ In your quote
      </button>
    );
  }
  return (
    <button type="button" onClick={() => add({ slug })} className={buttonClass(tone, className)}>
      + Add to quote
    </button>
  );
}
```

- [ ] **Step 7: Create `components/shop/ProductImage.tsx`**

```tsx
import Image from "next/image";
import type { CategorySlug, Product } from "@/lib/products";

/** Literal tint per category for the placeholder. */
const TINT: Record<CategorySlug, string> = {
  printing: "bg-tint-cyan",
  "graphic-design-branding": "bg-tint-pink",
  "signage-advertising": "bg-tint-butter",
  "stationery-supplies": "bg-tint-cyan",
  "web-development": "bg-tint-pink",
};

/** Square product image, or a branded halftone placeholder when the product
    has no photo yet (never a broken image). */
export default function ProductImage({
  product,
  sizes,
  priority = false,
  className = "",
}: {
  product: Product;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl ${className}`}>
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={product.name}
          className={`dot-pattern absolute inset-0 grid place-items-center p-4 ${TINT[product.category]}`}
        >
          <span aria-hidden className="text-center font-display text-lg font-medium leading-tight text-primary/70">
            {product.name}
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create `components/shop/ProductCard.tsx` and `ProductGrid.tsx`**

```tsx
// components/shop/ProductCard.tsx
import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductImage from "./ProductImage";
import AddToQuoteButton from "./AddToQuoteButton";

export default function ProductCard({ product }: { product: Product }) {
  const titleId = `product-${product.slug}`;
  const href = `/shop/${product.slug}`;
  return (
    <article aria-labelledby={titleId} className="flex h-full flex-col">
      {/* Image link is a duplicate of the title link — hidden from AT/tab order. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="group relative block">
        <ProductImage
          product={product}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="border border-line transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-primary">
            {product.badge}
          </span>
        )}
      </Link>
      <h3 id={titleId} className="mt-4 font-display text-lg font-medium leading-snug text-primary">
        <Link href={href} className="transition-colors hover:text-magenta">
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{product.blurb}</p>
      <AddToQuoteButton slug={product.slug} className="mt-4 w-full" />
    </article>
  );
}
```

```tsx
// components/shop/ProductGrid.tsx
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, label }: { products: Product[]; label?: string }) {
  return (
    <ul aria-label={label} className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 9: Create `app/shop/page.tsx`**

Read `node_modules/next/dist/docs/01-app/03-api-reference/02-components/form.md` first (for `next/form`).

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Form from "next/form";
import { SITE } from "@/lib/site";
import {
  CATEGORY_SHORT,
  PRODUCTS,
  isCategory,
  productsByCategory,
  searchProducts,
} from "@/lib/products";
import ProductGrid from "@/components/shop/ProductGrid";
import { SearchIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Shop printing & branding products",
  description:
    "Browse business cards, flyers, banners, signage, stationery and websites from Print Circuit in Harare — add what you need to a quote.",
  alternates: { canonical: "/shop" },
  openGraph: { url: "/shop" },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** Repeated params (?cat=a&cat=b) arrive as arrays — use the first. */
function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function shopHref(cat: string | null, q: string): string {
  const params = new URLSearchParams();
  if (cat) params.set("cat", cat);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawCat = first(params.cat);
  const category = isCategory(rawCat) ? rawCat : null;
  const q = first(params.q).trim().slice(0, 100);
  const results = searchProducts(q, category ? productsByCategory(category) : PRODUCTS);
  const chips: { slug: string | null; label: string }[] = [
    { slug: null, label: "All" },
    ...SITE.services.map((s) => ({ slug: s.slug, label: CATEGORY_SHORT[s.slug] })),
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Shop</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
        {category ? CATEGORY_SHORT[category] : "Shop all"}
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Add what you need to your quote — we&rsquo;ll reply with prices, usually the same day.
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Categories" className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const active = chip.slug === category;
            return (
              <Link
                key={chip.label}
                href={shopHref(chip.slug, q)}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-surface"
                    : "border-line bg-surface text-primary hover:border-primary"
                }`}
              >
                {chip.label}
              </Link>
            );
          })}
        </nav>
        <Form action="/shop" role="search" className="relative w-full lg:max-w-sm">
          {category && <input type="hidden" name="cat" value={category} />}
          <label htmlFor="shop-search" className="sr-only">
            Search the catalogue
          </label>
          <input
            key={q}
            id="shop-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search products…"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </Form>
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "product" : "products"}
        {q && <> for &ldquo;{q}&rdquo;</>}
      </p>

      {results.length > 0 ? (
        <div className="mt-6">
          <ProductGrid products={results} label="Products" />
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-line bg-surface p-10 text-center">
          <p className="font-display text-2xl text-primary">Can&rsquo;t find it?</p>
          <p className="mt-2 text-muted">We print and design far more than what&rsquo;s listed.</p>
          <Link
            href="/contact"
            className="mt-6 inline-block font-medium text-primary underline underline-offset-4 hover:text-magenta"
          >
            Describe it in a custom quote →
          </Link>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 10: Run tests**

Run: `npx playwright test tests/shop.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS. If lint flags `react-hooks/*` in `BasketProvider`, fix the code (don't disable the rule).

- [ ] **Step 11: Commit**

```bash
git add components/shop app/shop/page.tsx app/layout.tsx tests/shop.spec.ts
git commit -m "feat: /shop catalogue with product cards and persistent quote basket

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Store-style header, basket drawer and toast

**Files:**
- Create: `components/shop/BasketDrawer.tsx`, `components/shop/BasketToast.tsx`, `components/shop/QtyInput.tsx`
- Modify: `components/layout/Navbar.tsx` (rewrite), `components/shop/BasketProvider.tsx` (render drawer + toast)
- Delete: `tests/magnetic-button.spec.ts`
- Test: `tests/navbar.spec.ts` (rewrite), `tests/basket.spec.ts` (create)

**Interfaces:**
- Consumes: `useBasket` (Task 5), `ProductImage` (Task 5), `itemKey`, `clampQty`, `toQuoteItems`, `whatsappHref` (Task 4), `CATEGORY_SHORT`, `getProduct` (Task 2), `SearchIcon`, `BagIcon`, `buttonClass` (Task 1).
- Produces: `<QtyInput value: number; onCommit(qty: number): void; label: string; className?: string>`; header basket button with accessible name `Quote basket, N item(s)`; header search `searchbox` named "Search products" (submits to `/shop?q=`); `<nav aria-label="Primary">`; drawer `dialog` named "Your quote" with links "Request quote" and "Send on WhatsApp".

- [ ] **Step 1: Write failing tests**

Replace `tests/navbar.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("header shows brand, search and quote basket", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header.getByRole("link", { name: "Print Circuit" })).toBeVisible();
  await expect(header.getByRole("searchbox", { name: "Search products" })).toBeVisible();
  await expect(header.getByRole("button", { name: "Quote basket, 0 items" })).toBeVisible();
});

test("primary nav links and categories menu", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const name of ["Home", "Shop", "Services", "Our work", "About", "Contact"]) {
    await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  }
  await nav.getByRole("button", { name: /Categories/ }).hover();
  await expect(nav.getByRole("link", { name: "Printing", exact: true })).toHaveAttribute(
    "href",
    "/shop?cat=printing",
  );
  await expect(nav.getByRole("link", { name: /Call/ })).toHaveAttribute("href", "tel:+263788723331");
});
```

Create `tests/basket.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("badge counts lines; drawer edits quantity and removes", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("article", { name: "Business Cards" }).getByRole("button", { name: "+ Add to quote" }).click();
  await expect(page.getByRole("status")).toContainText("Business Cards added to your quote");
  await page.getByRole("article", { name: "Vinyl Banners" }).getByRole("button", { name: "+ Add to quote" }).click();
  await page.getByRole("button", { name: "Quote basket, 2 items" }).click();

  const drawer = page.getByRole("dialog", { name: "Your quote" });
  await expect(drawer).toBeVisible();
  await drawer.getByRole("button", { name: "Increase Business Cards quantity" }).click();
  await expect(drawer.getByLabel("Business Cards quantity")).toHaveValue("2");
  await drawer.getByLabel("Business Cards quantity").fill("500");
  await expect(drawer.getByLabel("Business Cards quantity")).toHaveValue("500");
  await drawer.getByLabel("Business Cards quantity").fill("9999999");
  await expect(drawer.getByLabel("Business Cards quantity")).toHaveValue("100000");
  await drawer.getByRole("button", { name: "Remove Vinyl Banners" }).click();
  await expect(drawer.getByText("Vinyl Banners")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  // (header is inert while the modal is open, so check the badge after closing)
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
});

test("WhatsApp link carries the basket", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("article", { name: "Business Cards" }).getByRole("button", { name: "+ Add to quote" }).click();
  await page.getByRole("button", { name: "Quote basket, 1 item" }).click();
  const href = await page
    .getByRole("dialog", { name: "Your quote" })
    .getByRole("link", { name: "Send on WhatsApp" })
    .getAttribute("href");
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe("https://wa.me/263788723331");
  expect(url.searchParams.get("text")).toContain("• Business Cards × 1");
});

test("corrupt saved basket is ignored", async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("pc-quote-basket", "{not json");
      sessionStorage.setItem("seeded", "1");
    }
  });
  await page.goto("/shop");
  await expect(page.getByRole("button", { name: "Quote basket, 0 items" })).toBeVisible();
  await page.getByRole("article", { name: "Envelopes" }).getByRole("button", { name: "+ Add to quote" }).click();
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
});

test("header search goes to shop results", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("banner").getByRole("searchbox", { name: "Search products" });
  await search.fill("banner");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/shop\?q=banner/);
  await expect(page.getByRole("article", { name: "Vinyl Banners" })).toBeVisible();
});
```

Delete `tests/magnetic-button.spec.ts` (the header no longer has a magnetic "Get a Quote"; the hero CTA is covered in Task 10).

- [ ] **Step 2: Run to confirm failure**

Run: `npx playwright test tests/navbar.spec.ts tests/basket.spec.ts`
Expected: FAIL (no searchbox / basket button / drawer).

- [ ] **Step 3: Create `components/shop/QtyInput.tsx`**

```tsx
"use client";

import { useState } from "react";
import { clampQty } from "@/lib/basket";

/** Quantity box that lets people clear and retype, but only ever commits an
    integer 1–100000. Syncs when the value changes from outside (− / + buttons). */
export default function QtyInput({
  value,
  onCommit,
  label,
  className = "",
}: {
  value: number;
  onCommit: (qty: number) => void;
  label: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setDraft(String(value));
  }

  return (
    <input
      aria-label={label}
      inputMode="numeric"
      value={draft}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 7);
        setDraft(digits);
        if (digits !== "") {
          const qty = clampQty(digits);
          onCommit(qty);
          if (String(qty) !== digits) setDraft(String(qty));
        }
      }}
      onBlur={() => setDraft(String(value))}
      className={`w-20 rounded-lg border border-line bg-surface px-2 py-1.5 text-center text-sm text-primary focus:border-primary focus:outline-none ${className}`}
    />
  );
}
```

- [ ] **Step 4: Create `components/shop/BasketDrawer.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";
import { getProduct } from "@/lib/products";
import { itemKey, toQuoteItems, whatsappHref } from "@/lib/basket";
import { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "./BasketProvider";
import ProductImage from "./ProductImage";
import QtyInput from "./QtyInput";

/** Right-hand quote panel. Native <dialog> gives focus trapping, Esc and a backdrop. */
export default function BasketDrawer() {
  const { items, isOpen, close, update, remove } = useBasket();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-label="Your quote"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close(); // backdrop click
      }}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-base p-0 text-primary backdrop:bg-primary/40 sm:border-l sm:border-line"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-medium">Your quote</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close quote"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-line"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Your quote is empty.</p>
            <Link href="/shop" onClick={close} className={buttonClass("primary")}>
              Browse products
            </Link>
          </div>
        ) : (
          <ul data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
            {items.map((item) => {
              const product = getProduct(item.slug);
              if (!product) return null;
              const key = itemKey(item);
              return (
                <li key={key} className="flex gap-4 rounded-2xl border border-line bg-surface p-3">
                  <ProductImage product={product} sizes="64px" className="w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{product.name}</p>
                    {item.option && <p className="text-xs text-muted">{item.option}</p>}
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name} quantity`}
                        disabled={item.qty <= 1}
                        onClick={() => update(key, { qty: item.qty - 1 })}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
                      >
                        −
                      </button>
                      <QtyInput
                        value={item.qty}
                        label={`${product.name} quantity`}
                        onCommit={(qty) => update(key, { qty })}
                      />
                      <button
                        type="button"
                        aria-label={`Increase ${product.name} quantity`}
                        onClick={() => update(key, { qty: item.qty + 1 })}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => remove(key)}
                        className="ml-auto text-xs text-muted underline hover:text-primary"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      aria-label={`${product.name} note`}
                      placeholder="Size, colours, deadline…"
                      maxLength={500}
                      value={item.note ?? ""}
                      onChange={(e) => update(key, { note: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-line bg-base px-3 py-1.5 text-sm placeholder:text-muted focus:border-primary focus:outline-none"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {items.length > 0 && (
          <div className="space-y-3 border-t border-line px-6 py-4">
            <Link href="/contact" onClick={close} className={buttonClass("primary", "w-full")}>
              Request quote
            </Link>
            <a
              href={whatsappHref(SITE.whatsapp, toQuoteItems(items))}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("whatsapp", "w-full")}
            >
              Send on WhatsApp
            </a>
          </div>
        )}
      </div>
    </dialog>
  );
}
```

- [ ] **Step 5: Create `components/shop/BasketToast.tsx`**

```tsx
"use client";

import { useBasket } from "./BasketProvider";

export default function BasketToast() {
  const { notice, open } = useBasket();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4"
    >
      {notice && (
        <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-ink px-5 py-3 text-sm text-surface shadow-lg">
          <span>{notice}</span>
          <button type="button" onClick={open} className="font-medium underline underline-offset-2">
            View quote
          </button>
        </div>
      )}
    </div>
  );
}
```

In `BasketProvider.tsx`, import both and render them inside the provider:

```tsx
  return (
    <BasketContext.Provider value={api}>
      {children}
      <BasketDrawer />
      <BasketToast />
    </BasketContext.Provider>
  );
```

- [ ] **Step 6: Rewrite `components/layout/Navbar.tsx`**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { SITE } from "@/lib/site";
import { CATEGORY_SHORT } from "@/lib/products";
import SocialLinks from "@/components/ui/SocialLinks";
import { BagIcon, SearchIcon } from "@/components/ui/icons";
import { useBasket } from "@/components/shop/BasketProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Our work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const PHONE = SITE.phones[0];
const tel = (p: string) => `tel:${p.replace(/\s+/g, "")}`;

function SearchForm({ className = "", autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const id = useId();
  return (
    <Form action="/shop" role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        autoFocus={autoFocus}
        placeholder="Search products…"
        className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none"
      />
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </Form>
  );
}

function BasketButton() {
  const { count, open } = useBasket();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Quote basket, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative grid h-10 w-10 place-items-center rounded-full text-primary transition-colors hover:bg-line"
    >
      <BagIcon className="h-5 w-5" />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-magenta px-1 text-[11px] font-semibold text-white"
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CategoriesMenu() {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className="rounded-lg px-3 py-1.5 text-muted transition-colors hover:text-primary group-focus-within:text-primary"
      >
        Categories ▾
      </button>
      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="w-56 rounded-2xl border border-line bg-surface p-2 shadow-lg">
          {SITE.services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/shop?cat=${s.slug}`}
                onClick={(e) => e.currentTarget.blur()}
                className="block rounded-lg px-3 py-2 text-sm text-primary hover:bg-base"
              >
                {CATEGORY_SHORT[s.slug]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (href: string) =>
    `rounded-lg px-3 py-1.5 transition-colors ${
      isActive(href) ? "bg-line text-primary" : "text-muted hover:text-primary"
    }`;

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-xs text-surface">
        Print Circuit, Harare ·{" "}
        <Link href="/shop" className="font-medium underline underline-offset-2">
          Get a quote in minutes →
        </Link>
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-base/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold text-primary">
            {/* Decorative — the wordmark beside it carries the name. */}
            <Image src="/logo.png" alt="" width={256} height={240} priority className="h-10 w-auto" />
            Print Circuit
          </Link>

          <SearchForm className="mx-auto hidden w-full max-w-xl md:block" />

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              type="button"
              aria-label="Search products"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-primary hover:bg-line md:hidden"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            <BasketButton />
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-xl leading-none text-primary hover:bg-line md:hidden"
            >
              ☰
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-line px-4 py-3 md:hidden">
            <SearchForm autoFocus />
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-line bg-base px-4 py-4 md:hidden">
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setMenuOpen(false)} className={`block ${linkClass(l.href)}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 px-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">Categories</p>
            <ul className="mt-1 space-y-1">
              {SITE.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/shop?cat=${s.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-1.5 text-muted hover:text-primary"
                  >
                    {CATEGORY_SHORT[s.slug]}
                  </Link>
                </li>
              ))}
            </ul>
            <a href={tel(PHONE)} className="mt-4 block px-3 text-sm text-primary">
              Call {PHONE}
            </a>
            <SocialLinks className="mt-3 px-3" />
          </div>
        )}
      </header>

      <nav aria-label="Primary" className="hidden border-b border-line md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-2 text-sm">
          {LINKS.slice(0, 2).map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <CategoriesMenu />
          {LINKS.slice(2).map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-4">
            <a href={tel(PHONE)} className="text-muted transition-colors hover:text-primary">
              Call <span className="font-medium text-primary">{PHONE}</span>
            </a>
            <SocialLinks variant="compact" />
          </div>
        </div>
      </nav>
    </>
  );
}
```

In `components/ui/SocialLinks.tsx` replace `border-white/15` with `border-line` and `hover:text-cyan`/`hover:border-cyan` with `hover:text-magenta`/`hover:border-primary`.

- [ ] **Step 7: Run tests**

Run: `npx playwright test tests/navbar.spec.ts tests/basket.spec.ts tests/shop.spec.ts tests/nav-client-side.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS. If the dialog doesn't sit on the right edge, check the `m-0 ml-auto` classes against the browser's default `dialog` margin.

- [ ] **Step 8: Commit**

```bash
git add components/layout/Navbar.tsx components/ui/SocialLinks.tsx components/shop tests/navbar.spec.ts tests/basket.spec.ts
git rm tests/magnetic-button.spec.ts
git commit -m "feat: store header with search, quote basket drawer and toast

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Product detail pages and sitemap

**Files:**
- Create: `components/shop/ProductConfigurator.tsx`, `app/shop/[slug]/page.tsx`
- Modify: `app/sitemap.ts`
- Test: `tests/product-page.spec.ts` (create), `tests/sitemap.spec.ts`, `tests/canonical.spec.ts`

**Interfaces:**
- Consumes: `PRODUCTS`, `getProduct`, `relatedProducts`, `CATEGORY_SHORT` (Task 2); `ProductImage`, `ProductGrid`, `useBasket` (Task 5); `QtyInput` (Task 6); `SectionHeading`, `buttonClass` (Task 1).
- Produces: route `/shop/<slug>`; form named `Configure <Product name>` with option radios, a `Quantity` field, a `Notes` textarea, buttons "Add to quote" and "View quote".

- [ ] **Step 1: Write failing tests**

`tests/product-page.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("product page renders with its own metadata", async ({ page }) => {
  await page.goto("/shop/business-cards");
  await expect(page.getByRole("heading", { level: 1, name: "Business Cards" })).toBeVisible();
  await expect(page).toHaveTitle(/Business Cards \| Print Circuit/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.printcircuit.co.zw/shop/business-cards",
  );
  await expect(page.getByRole("heading", { name: "You might also need" })).toBeVisible();
});

test("unknown product returns 404", async ({ page }) => {
  const res = await page.goto("/shop/not-a-real-product");
  expect(res?.status()).toBe(404);
});

test("adds the configured item to the quote", async ({ page }) => {
  await page.goto("/shop/business-cards");
  const form = page.getByRole("form", { name: "Configure Business Cards" });
  await form.locator("label", { hasText: "Gloss" }).click();
  await form.getByLabel("Quantity").fill("250");
  await form.getByLabel("Notes").fill("Logo on the back");
  await form.getByRole("button", { name: "Add to quote", exact: true }).click();
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();

  await form.getByRole("button", { name: "View quote" }).click();
  const drawer = page.getByRole("dialog", { name: "Your quote" });
  await expect(drawer.getByText("Gloss")).toBeVisible();
  await expect(drawer.getByLabel("Business Cards quantity")).toHaveValue("250");
  await expect(drawer.getByLabel("Business Cards note")).toHaveValue("Logo on the back");
});
```

`tests/sitemap.spec.ts`: add `"/shop"` and `"/shop/business-cards"` to the path list.
`tests/canonical.spec.ts`: add `["/shop", "https://www.printcircuit.co.zw/shop"]` to `cases`.

- [ ] **Step 2: Run to confirm failure**

Run: `npx playwright test tests/product-page.spec.ts tests/sitemap.spec.ts tests/canonical.spec.ts`
Expected: product + sitemap tests FAIL; canonical `/shop` PASSES already (from Task 5).

- [ ] **Step 3: Create `components/shop/ProductConfigurator.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "./BasketProvider";
import QtyInput from "./QtyInput";

export default function ProductConfigurator({ product }: { product: Product }) {
  const { add, open } = useBasket();
  const [option, setOption] = useState<string | undefined>(product.options?.[0]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  return (
    <form
      aria-label={`Configure ${product.name}`}
      onSubmit={(e) => {
        e.preventDefault();
        add({ slug: product.slug, qty, option, note: note.trim() || undefined });
        setNote("");
      }}
      className="mt-8 space-y-6"
    >
      {product.options && product.options.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium text-primary">Option</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.options.map((o) => (
              <label
                key={o}
                className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-sm text-primary transition-colors has-checked:border-primary has-checked:bg-primary has-checked:text-surface has-focus-visible:outline-2 has-focus-visible:outline-cyan"
              >
                <input
                  type="radio"
                  name="option"
                  value={o}
                  checked={option === o}
                  onChange={() => setOption(o)}
                  className="sr-only"
                />
                {o}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <p className="text-sm font-medium text-primary">Quantity</p>
        <QtyInput value={qty} onCommit={setQty} label="Quantity" className="mt-3 w-28 py-2" />
      </div>

      <div>
        <label htmlFor="product-note" className="text-sm font-medium text-primary">
          Notes
        </label>
        <textarea
          id="product-note"
          rows={3}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Size, colours, deadline…"
          className="mt-3 w-full rounded-xl border border-line bg-surface p-3 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={buttonClass("primary")}>
          Add to quote
        </button>
        <button type="button" onClick={open} className={buttonClass("outline")}>
          View quote
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Create `app/shop/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { CATEGORY_SHORT, PRODUCTS, getProduct, relatedProducts } from "@/lib/products";
import ProductImage from "@/components/shop/ProductImage";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductConfigurator from "@/components/shop/ProductConfigurator";
import SectionHeading from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const description = `${product.blurb} Get a quote from Print Circuit in Harare.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${slug}` },
    openGraph: { title: product.name, description, url: `/shop/${slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const service = SITE.services.find((s) => s.slug === product.category);
  const related = relatedProducts(product);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`/shop?cat=${product.category}`} className="hover:text-primary">
          {CATEGORY_SHORT[product.category]}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <ProductImage
            product={product}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="border border-line"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {CATEGORY_SHORT[product.category]}
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-muted">{product.blurb}</p>

          <ProductConfigurator product={product} />

          <p className="mt-8 text-sm text-muted">
            Prices depend on quantity, size and finish — we&rsquo;ll send an exact quote, usually the
            same day.{" "}
            {service && (
              <Link
                href={`/services/${service.slug}`}
                className="font-medium text-primary underline underline-offset-4 hover:text-magenta"
              >
                More about {service.label}
              </Link>
            )}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-20">
          <SectionHeading id="related-heading" label="Related" title="You might also need" />
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 5: Add shop routes to the sitemap** — `app/sitemap.ts`

Add `import { PRODUCTS } from "@/lib/products";`, add to `staticRoutes`:

```ts
    { url: url("/shop"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
```

and before `return`:

```ts
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: url(`/shop/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
```

Return `[...staticRoutes, ...serviceRoutes, ...productRoutes, ...workRoutes]`.

- [ ] **Step 6: Run tests**

Run: `npx playwright test tests/product-page.spec.ts tests/sitemap.spec.ts tests/canonical.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add components/shop/ProductConfigurator.tsx "app/shop/[slug]/page.tsx" app/sitemap.ts tests/product-page.spec.ts tests/sitemap.spec.ts tests/canonical.spec.ts
git commit -m "feat: product detail pages with options, quantity and notes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Quote form uses the basket

**Files:**
- Modify: `components/contact/QuoteForm.tsx` (rewrite)
- Test: `tests/quote-basket.spec.ts` (create); `tests/quote-form.spec.ts` must still pass unchanged

**Interfaces:**
- Consumes: `useBasket` (Task 5), `QtyInput` (Task 6), `itemKey`, `toQuoteItems` (Task 4), `formatQuoteItems`, `QuoteRequest` (Task 3), `getProduct` (Task 2), `buttonClass` (Task 1).
- Produces: form named "Request a quote"; when the basket has items step 1 is "Your products" (editable); submission posts `items`; basket cleared only on success.

- [ ] **Step 1: Write the failing test** — `tests/quote-basket.spec.ts`

```ts
import { test, expect, type Page } from "@playwright/test";

async function addBusinessCards(page: Page) {
  await page.goto("/shop/business-cards");
  const form = page.getByRole("form", { name: "Configure Business Cards" });
  await form.locator("label", { hasText: "Gloss" }).click();
  await form.getByLabel("Quantity").fill("250");
  await form.getByRole("button", { name: "Add to quote", exact: true }).click();
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
}

async function fillContactAndSend(page: Page) {
  const form = page.getByRole("form", { name: "Request a quote" });
  await form.getByRole("button", { name: "Next" }).click();
  await form.getByRole("button", { name: "Next" }).click(); // details optional with items
  await form.getByLabel("Name", { exact: true }).fill("Test User");
  await form.getByLabel("Email", { exact: true }).fill("test@example.com");
  await form.getByLabel("Phone", { exact: true }).fill("+263 78 000 0000");
  await form.getByRole("button", { name: /Send request/i }).click();
}

test("drawer → form lists basket items, posts them and clears the basket", async ({ page }) => {
  await addBusinessCards(page);
  let posted: unknown = null;
  await page.route("**/api/quote", async (route) => {
    posted = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });

  await page.getByRole("button", { name: "Quote basket, 1 item" }).click();
  await page.getByRole("dialog", { name: "Your quote" }).getByRole("link", { name: "Request quote" }).click();
  await expect(page).toHaveURL(/\/contact$/);

  const form = page.getByRole("form", { name: "Request a quote" });
  await expect(form.getByText("Your products")).toBeVisible();
  await expect(form.getByText("Business Cards")).toBeVisible();
  await expect(form.getByLabel("Business Cards quantity")).toHaveValue("250");

  await fillContactAndSend(page);
  await expect(page.getByText(/Thanks/i)).toBeVisible();
  expect(posted).toMatchObject({
    name: "Test User",
    items: [{ name: "Business Cards", qty: 250, option: "Gloss" }],
  });
  await expect(page.getByRole("button", { name: "Quote basket, 0 items" })).toBeVisible();
});

test("a failed submission keeps the basket", async ({ page }) => {
  await addBusinessCards(page);
  await page.route("**/api/quote", (route) =>
    route.fulfill({ status: 500, json: { ok: false, error: "Server down." } }),
  );
  await page.goto("/contact");
  await fillContactAndSend(page);
  await expect(page.getByRole("alert")).toContainText("Server down.");
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
});
```

(The failure test relies on EmailJS being unconfigured locally — `.env.local` has no `NEXT_PUBLIC_EMAILJS_*` keys.)

- [ ] **Step 2: Run to confirm failure**

Run: `npx playwright test tests/quote-basket.spec.ts`
Expected: FAIL ("Your products" not found).

- [ ] **Step 3: Rewrite `components/contact/QuoteForm.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/lib/site";
import { getProduct } from "@/lib/products";
import { itemKey, toQuoteItems } from "@/lib/basket";
import { formatQuoteItems, type QuoteRequest } from "@/lib/quote";
import { useBasket } from "@/components/shop/BasketProvider";
import QtyInput from "@/components/shop/QtyInput";
import { buttonClass } from "@/components/ui/ButtonLink";

const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

// Env-gated reliability fallback. Inert (returns false) unless all three keys
// are configured, so dev/CI use the /api/quote path only. EmailJS templates
// take flat strings, so basket items are folded into `details`.
async function sendViaEmailJs(data: QuoteRequest): Promise<boolean> {
  if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) return false;
  const { items, ...rest } = data;
  const details = [items?.length ? formatQuoteItems(items) : "", rest.details]
    .filter(Boolean)
    .join("\n\n");
  const emailjs = (await import("@emailjs/browser")).default;
  await emailjs.send(
    EMAILJS.serviceId,
    EMAILJS.templateId,
    { ...rest, details },
    { publicKey: EMAILJS.publicKey },
  );
  return true;
}

type Status = "idle" | "submitting" | "success" | "error";
type Fields = Omit<QuoteRequest, "items">;

const inputClass =
  "mt-1 w-full rounded-xl border border-line bg-base p-3 text-primary focus:border-primary focus:outline-none";

export default function QuoteForm() {
  const basket = useBasket();
  const hasItems = basket.items.length > 0;
  const steps = [hasItems ? "Products" : "Service", "Details", "Contact"];

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState<Fields>({
    service: "",
    details: "",
    name: "",
    email: "",
    phone: "",
  });

  const set = (k: keyof Fields, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canAdvance =
    (step === 0 && (hasItems || form.service !== "")) ||
    (step === 1 && (hasItems || form.details.trim().length >= 10)) ||
    step === 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const payload: QuoteRequest = hasItems
      ? { ...form, service: "", items: toQuoteItems(basket.items) }
      : form;
    const succeed = () => {
      basket.clear();
      setStatus("success");
    };
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return succeed();
      if (await sendViaEmailJs(payload).catch(() => false)) return succeed();
      const body = await res.json().catch(() => ({}));
      setStatus("error");
      setError(typeof body.error === "string" ? body.error : "Something went wrong.");
    } catch {
      if (await sendViaEmailJs(payload).catch(() => false)) return succeed();
      setStatus("error");
      setError("We couldn't reach the server.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8">
        <h2 className="font-display text-2xl font-medium text-primary">
          Thanks — we&rsquo;ve got it.
        </h2>
        <p className="mt-3 text-muted">
          We&rsquo;ll get back to you with a quote, usually the same day. Need us sooner?
        </p>
        <a
          href={SITE.whatsapp}
          className="mt-4 inline-block font-medium text-primary underline underline-offset-4 hover:text-magenta"
        >
          Chat on WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form
      aria-label="Request a quote"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <ol className="flex gap-2" aria-hidden>
        {steps.map((label, i) => (
          <li
            key={label}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-line"}`}
          />
        ))}
      </ol>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Step {step + 1} of {steps.length} — {steps[step]}
      </p>

      {step === 0 && hasItems && (
        <fieldset className="mt-6">
          <legend className="font-display text-xl text-primary">Your products</legend>
          <ul className="mt-4 space-y-3">
            {basket.items.map((item) => {
              const product = getProduct(item.slug);
              if (!product) return null;
              const key = itemKey(item);
              return (
                <li key={key} className="flex items-center gap-3 rounded-xl border border-line bg-base p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-primary">{product.name}</p>
                    {item.option && <p className="text-xs text-muted">{item.option}</p>}
                    {item.note && <p className="truncate text-xs text-muted">{item.note}</p>}
                  </div>
                  <QtyInput
                    value={item.qty}
                    label={`${product.name} quantity`}
                    onCommit={(qty) => basket.update(key, { qty })}
                  />
                  <button
                    type="button"
                    onClick={() => basket.remove(key)}
                    className="text-xs text-muted underline hover:text-primary"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:text-magenta"
          >
            + Add more products
          </Link>
        </fieldset>
      )}

      {step === 0 && !hasItems && (
        <fieldset className="mt-6">
          <legend className="font-display text-xl text-primary">Which service do you need?</legend>
          <div className="mt-4 space-y-3">
            {SITE.services.map((s) => (
              <label
                key={s.slug}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-base p-3 hover:border-primary"
              >
                <input
                  type="radio"
                  name="service"
                  value={s.label}
                  checked={form.service === s.label}
                  onChange={() => set("service", s.label)}
                  className="accent-primary"
                />
                <span className="text-primary">{s.label}</span>
              </label>
            ))}
          </div>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4 hover:text-magenta"
          >
            Or pick specific products from the shop →
          </Link>
        </fieldset>
      )}

      {step === 1 && (
        <div className="mt-6">
          <label htmlFor="details" className="font-display text-xl text-primary">
            {hasItems ? "Anything else? (optional)" : "Tell us about your project"}
          </label>
          <textarea
            id="details"
            name="details"
            rows={6}
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder={
              hasItems ? "Deadline, delivery, artwork you already have…" : "What do you need, how many, and by when?"
            }
            className="mt-4 w-full rounded-xl border border-line bg-base p-4 text-primary placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-muted">Name</label>
            <input id="name" name="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-muted">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-muted">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
          </div>
        </div>
      )}

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-magenta">
          {error} Please try again, or reach us on{" "}
          <a href={SITE.whatsapp} className="underline">
            WhatsApp
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-muted hover:text-primary disabled:opacity-40"
        >
          ← Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => canAdvance && setStep((s) => s + 1)}
            disabled={!canAdvance}
            className={buttonClass("primary", "rounded-full px-6 py-2")}
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className={buttonClass("primary", "rounded-full px-6 py-2")}
          >
            {status === "submitting" ? "Sending…" : "Send request"}
          </button>
        )}
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Run tests**

Run: `npx playwright test tests/quote-basket.spec.ts tests/quote-form.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS (the legacy `quote-form.spec.ts` uses an empty basket and the old flow).

- [ ] **Step 5: Commit**

```bash
git add components/contact/QuoteForm.tsx tests/quote-basket.spec.ts
git commit -m "feat: quote form sends basket items and clears the basket on success

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Dark footer and floating buttons

**Files:**
- Modify: `components/layout/Footer.tsx` (rewrite), `components/ui/FloatingButtons.tsx`
- Test: `tests/footer.spec.ts`

**Interfaces:**
- Consumes: `mostRequested`, `CATEGORY_SHORT` (Task 2), `SocialLinks`, `SITE`.
- Produces: `<footer>` (role contentinfo) with column headings Shop, Categories, Company, Get in touch.

- [ ] **Step 1: Extend the failing test** — append to `tests/footer.spec.ts`:

```ts
test("footer links into the shop and categories", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  for (const heading of ["Shop", "Categories", "Company", "Get in touch"]) {
    await expect(footer.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(footer.getByRole("link", { name: "Business Cards" })).toHaveAttribute(
    "href",
    "/shop/business-cards",
  );
  await expect(footer.getByRole("link", { name: "Signage", exact: true })).toHaveAttribute(
    "href",
    "/shop?cat=signage-advertising",
  );
  await expect(footer).toContainText("Printcircuit Enterprises (Private) Limited");
});
```

- [ ] **Step 2: Run to confirm failure**

Run: `npx playwright test tests/footer.spec.ts`
Expected: new test FAILS (no "Shop" heading).

- [ ] **Step 3: Rewrite `components/layout/Footer.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { CATEGORY_SHORT, mostRequested } from "@/lib/products";
import SocialLinks from "@/components/ui/SocialLinks";

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Our work" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const heading = "text-xs font-medium uppercase tracking-[0.2em] text-surface/50";
const link = "text-sm text-surface/80 transition-colors hover:text-surface";

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <Image src="/logo.png" alt="" width={256} height={240} className="h-12 w-auto rounded-lg bg-surface p-1" />
            Print Circuit
          </Link>
          <p className="mt-4 text-sm text-surface/70">{SITE.address}</p>
          <dl className="mt-4 space-y-1 text-sm text-surface/70">
            {SITE.hours.map((h) => (
              <div key={h.days} className="flex gap-2">
                <dt>{h.days}:</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className={heading}>Shop</h3>
          <ul className="mt-4 space-y-2">
            {mostRequested(6).map((p) => (
              <li key={p.slug}>
                <Link href={`/shop/${p.slug}`} className={link}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>Categories</h3>
          <ul className="mt-4 space-y-2">
            {SITE.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/shop?cat=${s.slug}`} className={link}>
                  {CATEGORY_SHORT[s.slug]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>Company</h3>
          <ul className="mt-4 space-y-2">
            {COMPANY.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={link}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>Get in touch</h3>
          <address className="mt-4 space-y-2 not-italic">
            {SITE.phones.map((p) => (
              <p key={p}>
                <a href={`tel:${p.replace(/\s+/g, "")}`} className={link}>
                  {p}
                </a>
              </p>
            ))}
            <p>
              <a href={`mailto:${SITE.email}`} className={link}>
                {SITE.email}
              </a>
            </p>
            <p>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
                Chat on WhatsApp
              </a>
            </p>
          </address>
          <SocialLinks tone="dark" className="mt-4" />
        </div>
      </div>

      <div className="border-t border-surface/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-surface/60 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-2">
            {["Harare-made", "Same-day quotes"].map((chip) => (
              <li key={chip} className="rounded-md bg-surface/10 px-2.5 py-1 font-medium text-surface/80">
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
```

In `components/ui/SocialLinks.tsx` add a `tone?: "light" | "dark"` prop (default `"light"`). For `tone === "dark"` and the default variant use `border-surface/20 text-surface/80 hover:border-surface hover:text-surface` instead of the light classes (keep both as literal strings).

- [ ] **Step 4: Restyle `components/ui/FloatingButtons.tsx`**

Replace the back-to-top button class with:
`"grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-primary shadow-lg transition-colors hover:border-primary"`. Leave the WhatsApp button as is.

- [ ] **Step 5: Run tests**

Run: `npx playwright test tests/footer.spec.ts tests/navbar.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS (the `navbar.spec` mobile drawer still uses `SocialLinks` with the default tone).

- [ ] **Step 6: Commit**

```bash
git add components/layout/Footer.tsx components/ui/FloatingButtons.tsx components/ui/SocialLinks.tsx tests/footer.spec.ts
git commit -m "feat: dark storefront footer with shop and category columns

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Home page — bento hero, categories, products, work, steps, order band

**Files:**
- Modify: `app/page.tsx`, `components/home/Hero.tsx` (rewrite), `components/home/Testimonials.tsx` (rewrite), `components/work/WorkCard.tsx` (restyle)
- Create: `components/home/CategoryCards.tsx`, `MostRequested.tsx`, `RecentWork.tsx`, `HowItWorks.tsx`, `OrderBand.tsx`
- Delete: `components/home/{Marquee,AboutTeaser,ServicesGrid,ServiceCard,FeaturedWork,Process}.tsx`, `components/animation/TextType.tsx`, `lib/showcase.ts`; tests `home-marquee`, `home-stats`, `home-scroll-pin`
- Test: `tests/home-hero.spec.ts`, `tests/home-services.spec.ts`, `tests/home-featured.spec.ts`, `tests/home-rest.spec.ts` (rewrite); `tests/reveal.spec.ts` unchanged

**Interfaces:**
- Consumes: `featuredProducts`, `mostRequested`, `PRODUCTS` (Task 2); `ProductImage`, `ProductGrid`, `AddToQuoteButton`, `useBasket` (Task 5); `ButtonLink`, `buttonClass`, `SectionHeading`, `CATEGORY_ICONS` (Task 1); `PROJECTS`, `getCover`.
- Produces: `<OrderBand />` (reused by About in Task 13); restyled `<WorkCard project cover>` (reused by Task 12).

- [ ] **Step 1: Rewrite the home tests (failing)**

`tests/home-hero.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("bento hero shows headline, CTAs and featured products", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("look established");
  await expect(page.getByRole("link", { name: "Browse products" })).toHaveAttribute("href", "/shop");
  const hero = page.getByRole("region", { name: "Introduction" });
  await expect(hero.getByRole("link", { name: "Get a quote", exact: true })).toHaveAttribute("href", "/contact");
  await expect(hero.getByRole("article", { name: "Business Cards" })).toBeVisible();
  await expect(hero.getByRole("article", { name: "Vinyl Banners" })).toBeVisible();
});
```

`tests/home-services.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("shop-by-category cards link to filtered shop", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Shop by category" });
  await expect(section.getByRole("link", { name: /Graphic Design & Branding/ })).toHaveAttribute(
    "href",
    "/shop?cat=graphic-design-branding",
  );
  await expect(section.getByRole("link", { name: /Web Development/ })).toHaveAttribute(
    "href",
    "/shop?cat=web-development",
  );
});
```

`tests/home-featured.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home shows most requested products and recent work", async ({ page }) => {
  await page.goto("/");
  const products = page.getByRole("region", { name: "Most requested" });
  await expect(products.getByRole("article")).toHaveCount(8);
  await expect(page.getByRole("link", { name: /See all work/ })).toHaveAttribute("href", "/work");
});
```

`tests/home-rest.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("how-it-works steps and the order band", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Choose products", { exact: true })).toBeVisible();
  await expect(page.getByText("Collect or delivery", { exact: true })).toBeVisible();
  const band = page.getByRole("region", { name: "Place an order" });
  await expect(band.getByRole("heading", { name: "Ready to place an order?" })).toBeVisible();
  await expect(band.getByRole("link", { name: "Start a quote" })).toHaveAttribute("href", "/shop");
});
```

Delete `tests/home-marquee.spec.ts`, `tests/home-stats.spec.ts`, `tests/home-scroll-pin.spec.ts`.

Run: `npx playwright test tests/home-hero.spec.ts tests/home-services.spec.ts tests/home-featured.spec.ts tests/home-rest.spec.ts`
Expected: FAIL.

- [ ] **Step 2: Rewrite `components/home/Hero.tsx`**

```tsx
import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import ProductImage from "@/components/shop/ProductImage";
import AddToQuoteButton from "@/components/shop/AddToQuoteButton";
import { PRODUCTS, featuredProducts, type Product } from "@/lib/products";
import { SITE } from "@/lib/site";

function FeatureCard({ product, dark }: { product: Product; dark: boolean }) {
  const titleId = `feature-${product.slug}`;
  return (
    <article
      aria-labelledby={titleId}
      className={`flex gap-5 rounded-3xl p-6 sm:p-8 ${dark ? "bg-ink text-surface" : "bg-tint-butter text-primary"}`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {product.badge && (
          <span
            className={`self-start rounded-full px-2.5 py-1 text-xs font-medium ${dark ? "bg-surface/15" : "bg-surface"}`}
          >
            {product.badge}
          </span>
        )}
        <h2 id={titleId} className="mt-3 font-display text-2xl font-medium leading-tight sm:text-3xl">
          {product.name}
        </h2>
        <p className={`mt-2 text-sm ${dark ? "text-surface/70" : "text-primary/70"}`}>{product.blurb}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <AddToQuoteButton slug={product.slug} tone={dark ? "light" : "outline"} />
          <Link href={`/shop/${product.slug}`} className="text-sm font-medium underline underline-offset-4">
            View product
          </Link>
        </div>
      </div>
      <ProductImage product={product} sizes="160px" className="hidden w-36 shrink-0 self-center sm:block" />
    </article>
  );
}

export default function Hero() {
  const [first, second] = featuredProducts();
  return (
    <section aria-label="Introduction" className="mx-auto grid w-full max-w-7xl gap-4 px-4 pt-6 sm:px-6 lg:grid-cols-12">
      <div className="relative overflow-hidden rounded-3xl bg-tint-cyan p-8 sm:p-12 lg:col-span-7">
        <div aria-hidden className="absolute right-8 top-8 h-24 w-24 rounded-full bg-magenta/25 sm:h-32 sm:w-32" />
        <div aria-hidden className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-cyan/15" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">
            Harare · Printing &amp; branding
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl">
            Print that makes your brand look established.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-primary/75">
            Business cards, banners, signage, stationery and websites — pick what you need and get
            a quote the same day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop">Browse products</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Get a quote
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary/70">
            <li>{PRODUCTS.length} products</li>
            <li>{SITE.services.length} categories</li>
            <li>
              <a href={`tel:${SITE.phones[0].replace(/\s+/g, "")}`} className="hover:text-primary">
                {SITE.phones[0]}
              </a>
            </li>
            <li>
              {SITE.hours[0].days} {SITE.hours[0].time}
            </li>
          </ul>
        </div>
      </div>
      <div className="grid gap-4 lg:col-span-5">
        {first && <FeatureCard product={first} dark={false} />}
        {second && <FeatureCard product={second} dark />}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create the section components**

`components/home/CategoryCards.tsx`:

```tsx
import Link from "next/link";
import Reveal from "@/components/animation/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORY_ICONS } from "@/components/ui/icons";
import { SITE } from "@/lib/site";

const TINTS = ["bg-tint-cyan", "bg-tint-pink", "bg-tint-butter", "bg-tint-cyan", "bg-tint-pink"];

export default function CategoryCards() {
  return (
    <section aria-labelledby="categories-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <div data-testid="reveal-probe">
          <SectionHeading
            id="categories-heading"
            label="Categories"
            title="Shop by category"
            link={{ href: "/shop", label: "All categories" }}
          />
        </div>
      </Reveal>
      <ul className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
        {SITE.services.map((s, i) => {
          const Icon = CATEGORY_ICONS[s.slug];
          return (
            <li key={s.slug} className="w-44 shrink-0 snap-start sm:w-auto">
              <Link
                href={`/shop?cat=${s.slug}`}
                className="flex h-full flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center transition-colors hover:border-primary"
              >
                <span className={`grid h-14 w-14 place-items-center rounded-full text-primary ${TINTS[i % TINTS.length]}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-4 font-medium text-primary">{s.label}</span>
                <span className="mt-1 text-xs text-muted">View products</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
```

`components/home/MostRequested.tsx`:

```tsx
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/shop/ProductGrid";
import { mostRequested } from "@/lib/products";

export default function MostRequested() {
  return (
    <section aria-labelledby="popular-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="popular-heading"
        label="Products"
        title="Most requested"
        link={{ href: "/shop", label: "View all" }}
      />
      <div className="mt-8">
        <ProductGrid products={mostRequested(8)} />
      </div>
    </section>
  );
}
```

`components/home/RecentWork.tsx`:

```tsx
import SectionHeading from "@/components/ui/SectionHeading";
import WorkCard from "@/components/work/WorkCard";
import { PROJECTS } from "@/lib/projects";
import { getCover } from "@/lib/gallery";

export default function RecentWork() {
  return (
    <section aria-labelledby="work-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="work-heading"
        label="Portfolio"
        title="Fresh off the press"
        link={{ href: "/work", label: "See all work" }}
      />
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.slice(0, 3).map((p) => (
          <li key={p.slug}>
            <WorkCard project={p} cover={getCover(p.slug)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

`components/home/HowItWorks.tsx`:

```tsx
const STEPS = [
  { title: "Choose products", body: "Browse the shop and add what you need to your quote." },
  { title: "Send your request", body: "Submit the quote form, or send the list on WhatsApp." },
  { title: "Approve the proof", body: "We send pricing and a digital proof — nothing prints until you sign off." },
  { title: "Collect or delivery", body: "Pick up in Avondale or get it delivered across Harare." },
];

export default function HowItWorks() {
  return (
    <section aria-label="How it works" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">How it works</p>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-tint-butter font-display font-medium text-primary">
                {i + 1}
              </span>
              <p className="mt-4 font-display text-lg font-medium text-primary">{step.title}</p>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

`components/home/OrderBand.tsx`:

```tsx
"use client";

import ButtonLink, { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "@/components/shop/BasketProvider";
import { SITE } from "@/lib/site";

export default function OrderBand() {
  const { count, open } = useBasket();
  return (
    <section aria-label="Place an order" className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
      <div className="grid items-center gap-8 rounded-3xl bg-tint-cyan p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-primary sm:text-5xl">
            Ready to place an order?
          </h2>
          <p className="mt-4 max-w-md text-primary/75">
            Pick products, add them to your quote, and we&rsquo;ll reply the same day.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          {count > 0 ? (
            <button type="button" onClick={open} className={buttonClass("primary", "sm:min-w-56")}>
              View my quote ({count})
            </button>
          ) : (
            <ButtonLink href="/shop" className="sm:min-w-56">
              Start a quote
            </ButtonLink>
          )}
          <ButtonLink href={SITE.whatsapp} variant="outline" external>
            WhatsApp us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `components/home/Testimonials.tsx`** (static grid, no carousel)

```tsx
const QUOTES = [
  {
    quote:
      "Print Circuit turned our event around on short notice — the banners and flyers looked sharp and arrived on time. We keep coming back.",
    name: "Rotaract Club",
    role: "Community partner",
  },
  {
    quote:
      "They handled our full branding rollout with care, from logo to signage. The result made our store feel established overnight.",
    name: "Value Store",
    role: "Retail client",
  },
  {
    quote: "Clear proofs, honest advice and clean printing. Working with the team is genuinely easy.",
    name: "University of Zimbabwe",
    role: "Faculty department",
  },
];

export default function Testimonials() {
  return (
    <section aria-label="What our clients say" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Client words</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {QUOTES.map((q) => (
          <li key={q.name}>
            <figure className="flex h-full flex-col rounded-3xl bg-tint-pink p-8">
              <blockquote className="flex-1 font-display text-lg leading-snug text-primary">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-primary/70">
                <span className="font-medium text-primary">{q.name}</span> — {q.role}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5: Restyle `components/work/WorkCard.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import { type Project } from "@/lib/projects";

export default function WorkCard({
  project,
  cover,
}: {
  project: Project;
  /** Cover image from public/work/<slug>/; halftone placeholder when absent. */
  cover?: string | null;
}) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-tint-butter">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="dot-pattern absolute inset-0" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-primary">
          {project.category}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-medium text-primary">{project.title}</h3>
        <span aria-hidden className="text-muted transition-colors group-hover:text-magenta">
          →
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">{project.summary}</p>
    </Link>
  );
}
```

- [ ] **Step 6: Replace `app/page.tsx`**

```tsx
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryCards from "@/components/home/CategoryCards";
import MostRequested from "@/components/home/MostRequested";
import RecentWork from "@/components/home/RecentWork";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import OrderBand from "@/components/home/OrderBand";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryCards />
      <MostRequested />
      <RecentWork />
      <HowItWorks />
      <Testimonials />
      <OrderBand />
    </main>
  );
}
```

- [ ] **Step 7: Delete dead home code**

```bash
git rm components/home/Marquee.tsx components/home/AboutTeaser.tsx components/home/ServicesGrid.tsx components/home/ServiceCard.tsx components/home/FeaturedWork.tsx components/home/Process.tsx components/animation/TextType.tsx tests/home-marquee.spec.ts tests/home-stats.spec.ts tests/home-scroll-pin.spec.ts
```

Then run `grep -rn "lib/showcase\|SHOWCASE" app components lib`. If nothing references it, `git rm lib/showcase.ts`. Remove the `@keyframes marquee` and `.animate-marquee` rules from `app/globals.css`. Update the comment in `app/template.tsx` that mentions the Process timeline — say only that the enter-only transition avoids AnimatePresence unmount issues.

- [ ] **Step 8: Run tests**

Run: `npx playwright test tests/home-hero.spec.ts tests/home-services.spec.ts tests/home-featured.spec.ts tests/home-rest.spec.ts tests/reveal.spec.ts tests/work-overview.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS.

- [ ] **Step 9: Commit**

```bash
git add -A app/page.tsx app/globals.css app/template.tsx components/home components/work/WorkCard.tsx tests lib
git commit -m "feat: storefront home page with bento hero and product sections

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Services pages restyle

**Files:**
- Modify: `lib/services.ts` (ACCENT), `app/services/page.tsx`, `components/services/{ServicesList,ServiceHero,ServiceIncluded,ServiceGallery,ServiceFaq,StickyQuoteCta}.tsx`
- Test: `tests/service-included.spec.ts` (update); `service-detail`, `service-faq`, `service-seo`, `service-sticky-cta`, `services-overview`, `reveal-list` unchanged

**Interfaces:**
- Consumes: `productsByCategory`, `CATEGORY_SHORT`, `isCategory` (Task 2), `ProductGrid` (Task 5), `ButtonLink`, `SectionHeading` (Task 1), `getServiceSamples`.
- Produces: `ACCENT[accent].tint` (`"bg-tint-cyan" | "bg-tint-pink" | "bg-tint-butter"`); yellow accent text becomes `text-ochre`.

- [ ] **Step 1: Update the test (failing)** — `tests/service-included.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("service page lists its products and sample work", async ({ page }) => {
  await page.goto("/services/printing");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: "What's included" })).toBeVisible();
  await expect(main.getByRole("article", { name: "Business Cards" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Browse Printing products" })).toHaveAttribute(
    "href",
    "/shop?cat=printing",
  );
  await expect(main.getByText("Sample work")).toBeVisible();
});
```

Run: `npx playwright test tests/service-included.spec.ts` → FAIL.

- [ ] **Step 2: Extend ACCENT in `lib/services.ts`**

Add `tint: string;` to the ACCENT value type and set: cyan `tint: "bg-tint-cyan"`, magenta `tint: "bg-tint-pink"`, yellow `tint: "bg-tint-butter"`. In the yellow entry change `text: "text-yellow"` → `"text-ochre"` and `groupHoverText: "group-hover:text-yellow"` → `"group-hover:text-ochre"`.

- [ ] **Step 3: Restyle components**

`components/services/ServiceHero.tsx`:

```tsx
import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import { ACCENT, type Service } from "@/lib/services";
import { CATEGORY_SHORT, isCategory } from "@/lib/products";
import { getServiceSamples } from "@/lib/gallery";

export default function ServiceHero({ service }: { service: Service }) {
  const accent = ACCENT[service.accent];
  const cover = getServiceSamples(service.slug)[0];
  const short = isCategory(service.slug) ? CATEGORY_SHORT[service.slug] : service.label;
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pt-6 sm:px-6 lg:grid-cols-12">
      <div className={`rounded-3xl p-8 sm:p-12 lg:col-span-7 ${accent.tint}`}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">Service</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
          {service.seoTitle}
        </h1>
        <p className="mt-4 font-display text-xl text-primary/80">{service.tagline}</p>
        <p className="mt-4 max-w-2xl text-primary/70">{service.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Request a quote</ButtonLink>
          <ButtonLink href={`/shop?cat=${service.slug}`} variant="outline">
            Browse {short} products
          </ButtonLink>
        </div>
      </div>
      <div className="relative min-h-64 overflow-hidden rounded-3xl bg-ink lg:col-span-5">
        {cover ? (
          <Image src={cover} alt={`${service.label} sample`} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        ) : (
          <div className="dot-pattern absolute inset-0 bg-tint-butter" />
        )}
      </div>
    </section>
  );
}
```

`components/services/ServiceIncluded.tsx`:

```tsx
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/shop/ProductGrid";
import { productsByCategory } from "@/lib/products";
import { type Service } from "@/lib/services";

export default function ServiceIncluded({ service }: { service: Service }) {
  return (
    <section aria-labelledby="included-heading" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        id="included-heading"
        label="Products"
        title="What's included"
        link={{ href: `/shop?cat=${service.slug}`, label: "Shop this category" }}
      />
      <div className="mt-8">
        <ProductGrid products={productsByCategory(service.slug)} label={`${service.label} products`} />
      </div>
    </section>
  );
}
```

`components/services/ServiceGallery.tsx`: change `py-20` → `py-16`, `px-6` → `px-4 sm:px-6`, heading classes to `font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl`, every `border-white/10` → `border-line`, `rounded-2xl` → `rounded-3xl`, and the placeholder div class to `dot-pattern aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-tint-butter`.

`components/services/ServiceFaq.tsx`: heading classes as above; `divide-white/10 border-white/10` → `divide-line border-line`; wrap the list in `rounded-3xl border border-line bg-surface px-6` (drop `border-y`); the `+` icon `text-cyan` → `text-magenta`. Keep the ids/aria and the grid-rows/visibility trick unchanged.

`components/services/StickyQuoteCta.tsx`:

```tsx
import ButtonLink from "@/components/ui/ButtonLink";
import { type Service } from "@/lib/services";

export default function StickyQuoteCta({ service }: { service: Service }) {
  return (
    <div className="sticky bottom-4 z-40 mx-auto mt-16 max-w-3xl px-4">
      <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-line bg-surface/95 p-3 pl-6 shadow-lg backdrop-blur sm:flex-row sm:rounded-full">
        <p className="text-center font-display text-primary sm:text-left">
          Ready to start your {service.label.toLowerCase()} project?
        </p>
        <ButtonLink href="/contact" className="rounded-full">
          Request a quote for this
        </ButtonLink>
      </div>
    </div>
  );
}
```

`components/services/ServicesList.tsx` (server component now):

```tsx
import Link from "next/link";
import { SERVICES, ACCENT } from "@/lib/services";

export default function ServicesList() {
  return (
    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => (
        <li key={s.slug}>
          <Link
            href={`/services/${s.slug}`}
            className={`group flex h-full flex-col rounded-3xl p-8 transition-transform hover:-translate-y-0.5 ${ACCENT[s.accent].tint}`}
          >
            <h2 className="font-display text-2xl font-medium text-primary">{s.label}</h2>
            <p className="mt-3 text-primary/70">{s.tagline}</p>
            <span className="mt-auto pt-8 text-sm font-medium text-primary">
              Explore <span aria-hidden className="transition-colors group-hover:text-magenta">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

`app/services/page.tsx`: main class `mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6`; label `text-xs font-medium uppercase tracking-[0.2em] text-muted`; h1 `mt-2 max-w-3xl font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl`; intro copy → "Five service lines, one team. Open a service for the full picture, or jump straight to the shop."

- [ ] **Step 4: Run tests**

Run: `npx playwright test tests/service-included.spec.ts tests/service-detail.spec.ts tests/service-faq.spec.ts tests/service-seo.spec.ts tests/service-sticky-cta.spec.ts tests/services-overview.spec.ts tests/reveal-list.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/services.ts app/services/page.tsx components/services tests/service-included.spec.ts
git commit -m "feat: storefront styling for service pages with product rows

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Work pages restyle

**Files:**
- Modify: `app/work/page.tsx`, `app/work/[slug]/page.tsx`, `components/work/{WorkGallery,CaseStudyHero,CaseStudyGallery}.tsx`
- Test: `tests/work-overview.spec.ts`, `tests/case-study.spec.ts`, `tests/case-study-gallery.spec.ts` (unchanged — must still pass)

**Interfaces:**
- Consumes: `WorkCard` (Task 10), `ButtonLink` (Task 1).

- [ ] **Step 1: Confirm the existing work tests pass before restyling**

Run: `npx playwright test tests/work-overview.spec.ts tests/case-study.spec.ts tests/case-study-gallery.spec.ts`
Expected: PASS (baseline — this task must keep them green).

- [ ] **Step 2: Restyle**

`app/work/page.tsx`: main class `mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6`; label `text-xs font-medium uppercase tracking-[0.2em] text-muted`; h1 `mt-2 max-w-3xl font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl`; intro `mt-4 max-w-2xl text-muted`.

`components/work/WorkGallery.tsx`: chip classes — active `border-primary bg-primary text-surface`, inactive `border-line bg-surface text-primary hover:border-primary`. Grid stays.

`components/work/CaseStudyHero.tsx`:

```tsx
import { type Project } from "@/lib/projects";

export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pt-6 sm:px-6 lg:grid-cols-12">
      <div className="rounded-3xl bg-tint-butter p-8 sm:p-12 lg:col-span-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">{project.category}</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary/75">{project.summary}</p>
        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 text-sm">
          <div>
            <dt className="text-primary/60">Client</dt>
            <dd className="mt-1 text-primary">{project.client}</dd>
          </div>
          <div>
            <dt className="text-primary/60">Year</dt>
            <dd className="mt-1 text-primary">{project.year}</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12 lg:col-span-5">
        <h2 className="font-display text-2xl font-medium text-primary">What we did</h2>
        <p className="mt-4 text-muted">{project.scope}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Services provided">
          {project.services.map((s) => (
            <li key={s} className="rounded-full border border-line bg-base px-3 py-1 text-sm text-primary">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

`components/work/CaseStudyGallery.tsx`: `max-w-5xl px-6 py-12` → `max-w-7xl px-4 py-16 sm:px-6`; heading `font-display text-2xl font-medium text-primary`; `border-white/10` → `border-line`; `rounded-2xl` → `rounded-3xl`; placeholder → `dot-pattern aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-tint-butter`.

`app/work/[slug]/page.tsx`: replace the `MagneticButton` import/usage with `ButtonLink` (`<ButtonLink href="/contact">Start a project</ButtonLink>`); CTA section becomes `mx-auto max-w-7xl px-4 pb-20 sm:px-6` containing a `rounded-3xl bg-tint-cyan p-10 text-center` block with the h2 (`font-display text-3xl font-medium text-primary sm:text-4xl`), the button, and the "← All work" link (`text-sm text-primary/70 hover:text-primary`).

- [ ] **Step 3: Run tests**

Run: `npx playwright test tests/work-overview.spec.ts tests/case-study.spec.ts tests/case-study-gallery.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add app/work components/work
git commit -m "feat: storefront styling for work pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: About and Contact restyle, remove dead components

**Files:**
- Modify: `app/about/page.tsx`, `components/about/{AboutHero,StorySection,ValuesPanels,TeamGrid,AboutStats}.tsx`, `app/contact/page.tsx`, `components/contact/ContactInfo.tsx`
- Delete: `components/home/{CtaBand,InkBlend}.tsx`, `components/animation/Counter.tsx`, `components/ui/MagneticButton.tsx`
- Test: `tests/about-stats.spec.ts` (update); `about-hero`, `about-team`, `about-values`, `contact-info`, `nav-client-side`, `reveal-list` unchanged

**Interfaces:**
- Consumes: `OrderBand` (Task 10), `ButtonLink` (Task 1), `COMPANY_STATS`, `TEAM`, `getTeamPhoto`.

- [ ] **Step 1: Update the test (failing)** — `tests/about-stats.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("about shows static stats and the order band", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Service lines")).toBeVisible();
  const band = page.getByRole("region", { name: "Place an order" });
  await expect(band.getByRole("link", { name: "Start a quote" })).toHaveAttribute("href", "/shop");
});
```

Run: `npx playwright test tests/about-stats.spec.ts` → FAIL.

- [ ] **Step 2: Restyle About**

`components/about/AboutHero.tsx` (no InkBlend; do **not** repeat the "20 May 2026" text — `about-hero.spec` expects exactly one match):

```tsx
export default function AboutHero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pt-6 sm:px-6 lg:grid-cols-12">
      <div className="relative overflow-hidden rounded-3xl bg-tint-butter p-8 sm:p-12 lg:col-span-8">
        <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-magenta/15" />
        <p className="relative text-xs font-medium uppercase tracking-[0.2em] text-primary/60">About Print Circuit</p>
        <h1 className="relative mt-4 font-display text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl">
          New, hungry, and built for modern brands.
        </h1>
        <p className="relative mt-6 max-w-2xl text-lg text-primary/75">
          We&rsquo;re a Harare print and design studio on a simple mission: to help businesses and
          individuals improve performance and productivity through high-quality, reliable, and
          creative printing and branding solutions.
        </p>
      </div>
      <div className="flex flex-col justify-end rounded-3xl bg-ink p-8 text-surface sm:p-12 lg:col-span-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-surface/50">Based in</p>
        <p className="mt-2 font-display text-2xl font-medium">Avondale, Harare</p>
        <p className="mt-4 text-sm text-surface/70">Printing, branding, signage, stationery and web — under one roof.</p>
      </div>
    </section>
  );
}
```

`components/about/StorySection.tsx`: section `mx-auto w-full max-w-7xl px-4 py-16 sm:px-6`; wrap content in `rounded-3xl border border-line bg-surface p-8 sm:p-12`; h2 `font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl`; keep the paragraphs (fix the existing typo "aZimbabwean" → "a Zimbabwean").

`components/about/ValuesPanels.tsx`: section padding as above; h2 classes as above; panels get tints by index — use a literal array `const TINTS = ["bg-tint-cyan", "bg-tint-pink", "bg-tint-butter"];` and panel class `h-full rounded-3xl p-8 ${TINTS[i]}`; panel h3 `font-display text-xl font-medium text-primary`; body `mt-4 text-primary/75`.

`components/about/TeamGrid.tsx`: section padding as above; h2 classes as above; card `h-full rounded-3xl border border-line bg-surface p-6`; photo border `border-line`; placeholder avatar `dot-pattern aspect-square w-20 overflow-hidden rounded-full bg-tint-pink`; name `font-display text-lg font-medium`; role `text-magenta`. Keep `ul > li` + `h3` structure (reveal-list spec).

`components/about/AboutStats.tsx`:

```tsx
import { COMPANY_STATS } from "@/lib/stats";

export default function AboutStats() {
  return (
    <section aria-label="Print Circuit in numbers" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {COMPANY_STATS.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-line bg-surface p-8">
            <dd className="font-display text-4xl font-medium text-primary sm:text-5xl">
              {stat.to}
              {stat.suffix}
            </dd>
            <dt className="mt-2 text-sm text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

`app/about/page.tsx`: replace `import CtaBand from "@/components/home/CtaBand";` with `import OrderBand from "@/components/home/OrderBand";` and `<CtaBand />` with `<OrderBand />`.

- [ ] **Step 3: Restyle Contact**

`app/contact/page.tsx`: main `mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6`; label `text-xs font-medium uppercase tracking-[0.2em] text-muted`; h1 `mt-2 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl`; intro `mt-4 max-w-2xl text-muted`; grid `mt-10 grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]`.

`components/contact/ContactInfo.tsx`: aside class `space-y-6 rounded-3xl bg-tint-butter p-8`; h2 `font-display text-xl font-medium text-primary`; address text `text-primary/75`; replace the WhatsApp anchor with `<ButtonLink href={SITE.whatsapp} variant="whatsapp" external className="mt-4">Chat on WhatsApp</ButtonLink>` (import `ButtonLink`); hours heading `text-xs font-medium uppercase tracking-[0.2em] text-primary/60`; `dt` `text-primary/70`; map wrapper `overflow-hidden rounded-2xl border border-line`.

- [ ] **Step 4: Delete dead components and check nothing references them**

```bash
git rm components/home/CtaBand.tsx components/home/InkBlend.tsx components/animation/Counter.tsx components/ui/MagneticButton.tsx
```

Run: `grep -rn "MagneticButton\|InkBlend\|Counter\|CtaBand\|TextType\|Marquee" app components lib`
Expected: no output.

- [ ] **Step 5: Run tests**

Run: `npx playwright test tests/about-stats.spec.ts tests/about-hero.spec.ts tests/about-team.spec.ts tests/about-values.spec.ts tests/contact-info.spec.ts tests/nav-client-side.spec.ts tests/reveal-list.spec.ts && npm run typecheck && npm run lint`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add -A app/about app/contact components/about components/contact components/home components/animation components/ui tests/about-stats.spec.ts
git commit -m "feat: storefront styling for about and contact; remove old animations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Leftover sweep, docs, full verification and preview

**Files:**
- Modify: any file still using dark-theme classes; `MAINTENANCE.md`; `public/showcase/CREDITS.md`

- [ ] **Step 1: Sweep for leftovers**

Run: `grep -rn "white/\|text-yellow\|from-surface via-base\|pt-32\|text-base\b" app components`
Expected: no output. Fix each hit with the light equivalents (`white/10|15` → `line`, `text-yellow` → `text-ochre`, gradient placeholders → `dot-pattern bg-tint-butter`, `pt-32` → `pt-10`, `text-base` colour → `text-surface`). Re-run until empty.

- [ ] **Step 2: Update docs**

`public/showcase/CREDITS.md`: replace the first paragraph's reference to the home marquee with: "Images in this folder are used as product photos in the shop (`lib/products.ts`, the `image` field). They are free-licensed stock **placeholders** — replace any file with a real Print Circuit job photo (keep the filename) to make it ours."

`MAINTENANCE.md`:
- In section 4's `lib/` table, replace the `lib/showcase.ts` row with: `| lib/products.ts | The **shop catalogue** — every product's name, one-line description, options, photo and badge. |`
- Replace section 7 ("Changing the homepage scrolling strip") with:

```markdown
## 7. Adding or editing PRODUCTS in the shop

Everything in the shop (and the "Most requested" cards on the homepage) comes
from **`lib/products.ts`**. Each product looks like this:

```ts
{
  slug: "business-cards",                 // web address: /shop/business-cards — keep it lowercase-with-dashes
  name: "Business Cards",                 // shown on the card
  category: "printing",                   // one of: printing, graphic-design-branding, signage-advertising, stationery-supplies, web-development
  blurb: "Single or double-sided …",      // one short line
  options: ["Matte", "Gloss", "Spot UV"], // optional — choices the customer can pick
  image: "/showcase/business-cards.jpg",  // optional — leave out to show a coloured placeholder
  badge: "Popular",                       // optional — "Popular", "Fast turnaround" or "New"
  featured: true,                         // optional — the first two featured products appear in the big homepage cards
},
```

- **Change wording:** edit the text inside the quotes.
- **Add a photo:** upload it to `public/showcase/` (square photos look best,
  under ~300 KB), then set `image: "/showcase/your-file.jpg"`.
- **Add a product:** copy a whole `{ … },` block, paste it in the right
  category section, and give it a **new, unique slug**.
- **Remove a product:** delete its whole `{ … },` block. Anyone who had it in
  their quote basket simply won't see it any more.
- **Don't rename a slug** of a live product unless you have to — it changes
  the page's web address.

There are **no prices** on the site on purpose: customers add products to a
quote and you reply with pricing.
```

- [ ] **Step 3: Full verification**

Run each and read the output:

```bash
npm run typecheck
npm run lint
npm run build
npx playwright test
```

Expected: typecheck/lint clean; build succeeds and lists `/shop` as dynamic and `/shop/[slug]` with ~30 prerendered paths; every Playwright test passes. If anything fails, fix it before continuing — do not claim completion with failures.

- [ ] **Step 4: Manual check at phone width**

Run `npm run dev`, open http://localhost:3000 at ~390px width and at desktop width, and check: header (search icon, basket, menu), hero stacking, category cards scroll horizontally, drawer full-height, product page, contact form with basket items, footer. Fix any horizontal page scroll.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: product maintenance guide; sweep leftover dark-theme styles

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Ask before pushing**

Ask the owner: "OK to push `redesign-storefront` to GitHub so Vercel builds a preview? (This does not touch the live site.)" Only on a yes:

```bash
git push -u origin redesign-storefront
```

Then give the owner the preview checklist: open the branch preview from Vercel → Deployments; submit one real quote with 2+ basket items and confirm the email lists them; tap "Send on WhatsApp" on a phone and confirm the message. Merging to `master` happens only on the owner's explicit go-ahead.
