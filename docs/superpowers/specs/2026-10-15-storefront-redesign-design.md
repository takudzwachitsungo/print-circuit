# Print Circuit — Storefront Redesign Design Spec

**Date:** 2026-10-15
**Author:** Takudzwa Chitsungo (with Claude)
**Status:** Design approved in chat — awaiting written-spec review
**Branch:** `redesign-storefront`
**Inspiration:** SKO storefront — <https://dailysalesrecordapp.com/storefront/sko>

---

## 1. Intent

Re-lay out the live Print Circuit site (Next.js 16, Vercel) in the style of the
SKO online storefront: a light, calm, catalogue-first layout with bento hero
cards, a store-style header, category cards, a product grid and a dark footer.

**Decisions made by the owner**

| Question | Decision |
|---|---|
| What to take from SKO | Look **+ catalogue**, quote-based (no checkout) |
| Prices | **None** — every product is "quote only" |
| Colours | Light warm base + **soft CMYK tints** (not SKO's mint/peach) |
| Card action | **"Add to quote" basket** — multi-item quote request |
| Rollout | One branch, phased commits, merged once after preview review |

**Success criteria**

- A visitor can browse ~30 products by category or search, add several to a
  quote basket, and send one request (email via `/api/quote` or WhatsApp).
- Every existing URL still works, with unchanged canonical/metadata/JSON-LD.
- The whole site reads as one consistent light storefront — no leftover dark
  sections.
- `typecheck`, `lint`, `build` and the full Playwright suite pass.
- Nothing reaches `master` (live) until the owner approves the Vercel preview.

**Non-goals:** prices, payments/checkout, accounts, stock levels, ratings,
newsletter, CMS.

---

## 2. Design system

Token **names** are kept where possible so most components re-skin via
`app/globals.css` (`@theme`). New tokens are added.

| Token | Value | Role |
|---|---|---|
| `base` | `#f7f5f0` | page background (warm off-white) |
| `surface` | `#fffdf8` | cards |
| `primary` | `#16140f` | text, primary buttons |
| `muted` | `#6b6860` | secondary text |
| `line` *(new)* | `#e7e3da` | 1px card borders / dividers |
| `ink` *(new)* | `#16140f` | dark feature card, announcement bar, footer |
| `tint-cyan` *(new)* | `#dcf1f8` | pastel bento block |
| `tint-pink` *(new)* | `#fbe1ef` | pastel bento block / "in quote" state |
| `tint-butter` *(new)* | `#fff6c7` | pastel bento block |
| `cyan` / `magenta` | unchanged | small accents (badges, dots, focus rings) |
| `yellow` | unchanged | backgrounds/dots only |
| `ochre` *(new)* | `#9a7b00` | replaces any `text-yellow` (unreadable on light) |

- **Type:** Space Grotesk (display) + Inter (body), unchanged. Headings lighter
  weight / tighter tracking than today. Sections use a small uppercase label
  ("CATEGORIES", "PRODUCTS") above the title, with a "View all →" link aligned
  right.
- **Shape:** `rounded-2xl` cards, `rounded-3xl` bento blocks, 1px `line`
  borders, no heavy shadows.
- **Motion:** calm. Keep Lenis smooth scroll and the `Reveal` fade-up. Remove
  `InkBlend`, `TextType`, `MagneticButton`, `Marquee`, `Counter` (and their
  usages). `prefers-reduced-motion` handling stays.
- **Light only** — no dark-mode variant in this phase.

---

## 3. Global chrome

### Header (`components/layout/Navbar.tsx`, rewritten)

Sticky, solid `base` background, bottom `line` border. Three tiers:

1. **Announcement bar** (`ink`): "Print Circuit, Harare · Get a quote in
   minutes →" (links to `/shop`).
2. **Main row:** logo + wordmark (→ `/`) · **search input** (centre) · **quote
   basket icon** with item-count badge (opens the basket drawer).
   - Search submits to `/shop?q=<term>`; on `/shop` it updates the URL in place.
3. **Nav row:** Home · Shop · Categories ▾ (the 5 `SITE.services`, linking to
   `/shop?cat=<slug>`) · Services · Our work · About · Contact. Right side:
   "Call +263 78 872 3331" (`tel:` link) and `SocialLinks` (compact).

**Mobile (< md):** single row — logo, search icon (expands the input), basket,
☰. Drawer holds nav links, categories, phone and social icons.

### Footer (`components/layout/Footer.tsx`, rewritten)

`ink` background, light text. Columns: brand (logo, address, hours) · Shop (up
to 6 featured products) · Categories (5) · Company (About, Our work, Services,
Contact) · Get in touch (phones, email, WhatsApp, social icons). Bottom row:
© year + `SITE.legalName`, and chips "Harare-made · Same-day quotes".

### Floating buttons

`FloatingButtons` (WhatsApp + back-to-top) kept, restyled for the light theme.

---

## 4. Home page (`app/page.tsx`)

In order:

1. **Bento hero** (`components/home/Hero.tsx`, rewritten), 12-col grid:
   - Left (7 cols) `tint-cyan` block: label "HARARE · PRINTING & BRANDING",
     headline "Print that makes your brand look established.", one-line
     intro, buttons **Browse products** (black → `/shop`) and **Get a quote**
     (outlined → `/contact`), facts row "30+ products · 5 categories · phone ·
     opening hours". Decorative soft magenta circle + large faint circle.
   - Right (5 cols), two stacked cards driven by `featured: true` products:
     first `tint-butter` with badge, second `ink` with badge. Each shows image,
     name, **Add to quote** and **View** links.
   - Stacks vertically on mobile.
2. **Shop by category** (`components/home/CategoryCards.tsx`): five `surface`
   cards — tinted circle with an icon, category name, "View products" →
   `/shop?cat=<slug>`. Header link "All categories →" (`/shop`). Horizontal
   scroll on mobile.
3. **Most requested** (label "PRODUCTS"): 8 `ProductCard`s, 4-col desktop /
   2-col mobile, "View all →" `/shop`.
4. **Fresh off the press** (label "PORTFOLIO"): 3 project cards from
   `lib/projects.ts` (replaces `FeaturedWork` styling), "See all work →".
5. **How it works:** one `surface` panel, 4 numbered steps — Choose products →
   Send quote request → Approve proof → Collect or delivery (replaces
   `Process`).
6. **Testimonials:** existing content, `tint-pink` cards.
7. **Order band** (replaces `CtaBand`): `tint-cyan` block — "Ready to place an
   order?" + "Pick products, add them to your quote, and we'll reply the same
   day." Button **View my quote (n)** (opens drawer; reads "Start a quote" →
   `/shop` when empty) and "WhatsApp us" link.

Removed from home: `Marquee`, `AboutTeaser`, counters.

---

## 5. Catalogue

### Data — `lib/products.ts` (new)

```ts
export type ProductBadge = "Popular" | "Fast turnaround" | "New";

export interface Product {
  slug: string;          // unique, URL-safe, e.g. "business-cards"
  name: string;          // "Business Cards"
  category: string;      // one of SITE.services[].slug
  blurb: string;         // one line of spec, e.g. "350gsm, matte or gloss"
  options?: string[];    // selectable chips, e.g. ["Matte", "Gloss"]
  image?: string;        // public path; absent/missing → placeholder
  badge?: ProductBadge;
  featured?: boolean;    // shown in the hero (first two featured)
}

export const PRODUCTS: Product[];
export function getProduct(slug: string): Product | undefined;
export function productsByCategory(category: string): Product[];
export function searchProducts(query: string): Product[]; // case-insensitive over name, blurb, category label
```

- Seeded with ~30 products derived from the "included" lists in
  `lib/services.ts` (6 per category), with images mapped from
  `public/showcase/` and `public/services/<slug>/` where a sensible match
  exists.
- Category type is derived from `SITE.services` so an invalid category is a
  type error.
- **Placeholder:** `components/shop/ProductImage.tsx` renders the image, or —
  when `image` is absent — a tinted block (tint chosen by category) with a CMYK
  dot pattern and the product name. Never a broken image.

### `ProductCard` (`components/shop/ProductCard.tsx`)

Square rounded image (badge top-left), name (→ `/shop/<slug>`), one-line
blurb, full-width outlined **+ Add to quote** button. When the product is in
the basket the button reads **✓ In your quote** on `tint-pink` and opens the
drawer.

### `/shop` (`app/shop/page.tsx`)

- Heading "Shop all" (or the category label), category chips (All + 5) and a
  search box. Filters come from `searchParams` (`?cat=`, `?q=`) so results are
  server-rendered and shareable.
- Grid of `ProductCard`s. Empty state: "Can't find it? Describe it in a custom
  quote →" (`/contact`).
- Metadata: title "Shop printing & branding products", canonical `/shop`.

### `/shop/[slug]` (`app/shop/[slug]/page.tsx`)

- `generateStaticParams` over `PRODUCTS`; `notFound()` for unknown slugs.
- Layout: large image left; right — category label, name, blurb, option chips
  (single-select), quantity input (default 1), notes textarea ("size, colours,
  deadline…"), **Add to quote** button.
- Below: "You might also need" (up to 4 same-category products) and a link to
  the related `/services/<category>` page.
- Per-product `generateMetadata` (title, description from blurb, canonical).
- Added to `app/sitemap.ts`.

---

## 6. Quote basket

### State — `lib/basket.ts` + `components/shop/BasketProvider.tsx`

```ts
export interface BasketItem {
  slug: string;
  qty: number;        // 1..100000
  option?: string;    // chosen option chip
  note?: string;
}
```

- Stored in `localStorage` under `pc-quote-basket` as JSON. Every read/write is
  wrapped in try/catch; unreadable or invalid data → empty basket. Items whose
  slug no longer exists in `PRODUCTS` are dropped on load.
- Adding a slug already in the basket increments its quantity rather than
  duplicating it.
- A client context provider (mounted in `app/layout.tsx`) exposes `items`,
  `count`, `add`, `update`, `remove`, `clear`, `open`/`close` for the drawer.
  Renders an empty basket on the server and hydrates from storage on mount (no
  hydration mismatch).

### Drawer — `components/shop/BasketDrawer.tsx`

Right-side panel (full-screen on mobile), focus-trapped, closes on Esc /
backdrop click. Lists items (thumbnail, name, option, `− qty +`, remove, note
field). Empty state with "Browse products". Footer buttons:

- **Request quote** (black) → `/contact`.
- **Send on WhatsApp** (green) → `SITE.whatsapp` with `?text=` set to a
  pre-written message built by `buildWhatsAppMessage(items)`:
  `Hi Print Circuit, I'd like a quote for:\n• Business Cards × 500 (Matte) — note\n…`

Adding an item shows a brief toast "Added to your quote · View quote".

### Quote form + API

- `lib/quote.ts`: `QuoteRequest` gains optional
  `items?: { name: string; qty: number; option?: string; note?: string }[]`.
  `validateQuote` rules when `items` is present and non-empty: 1–50 items;
  `name` 1–120 chars; integer `qty` 1–100000; `option` ≤ 60 chars; `note` ≤ 500
  chars; `service` may be empty (server sets `"Multiple products (n)"`);
  `details` becomes optional. Without `items`, behaviour is exactly as today.
- `QuoteForm` step 1: when the basket has items, show them (editable qty /
  remove, "+ Add more products" → `/shop`) instead of the service dropdown;
  details step says "Anything else? (optional)". Empty basket → current flow
  unchanged.
- `app/api/quote/route.ts`: email body lists items
  (`• Name × qty (option) — note`) above the customer's message.
- EmailJS fallback receives the same flattened text.
- On success the basket is cleared.

---

## 7. Restyle of existing pages

URLs, metadata, canonical tags and JSON-LD unchanged.

- **`/services`, `/services/[slug]`:** bento `ServiceHero` (tinted intro card +
  image card); "What's included" becomes that category's `ProductCard` row;
  `ServiceFaq` as a light bordered accordion; `StickyQuoteCta` as a black pill;
  `ServiceGallery` with rounded images.
- **`/work`, `/work/[slug]`:** light card grid with category chips;
  `CaseStudyHero` as a bento header; rounded gallery.
- **`/about`:** story in a tinted bento card; values as pastel tiles; team as
  round photos on `surface` cards; stats as static numbers.
- **`/contact`:** two columns — `QuoteForm` on a `surface` card; contact info,
  hours, WhatsApp and map link on a `tint-butter` card.
- **`opengraph-image` / `twitter-image`:** light palette.
- `app/template.tsx` page transition kept if subtle, otherwise simplified to a
  fade.

---

## 8. Testing

Playwright (existing `tests/` conventions).

- **Update or delete** specs asserting removed behaviour (typing hero, marquee,
  counters, magnetic button, dark styling): at least `home-hero`,
  `home-marquee`, `home-stats`, `home-scroll-pin`, `magnetic-button`,
  `navbar`, `footer`, `about-stats`, plus any that break on the new markup.
- **New specs**
  - `shop.spec.ts` — grid renders all products; `?cat=` filters; `?q=` search;
    empty state.
  - `product-page.spec.ts` — renders, metadata/canonical, 404 for unknown slug,
    add to quote with qty/option/note.
  - `basket.spec.ts` — add/remove, qty increment on re-add, header badge count,
    persists across reload, survives corrupt storage, WhatsApp link text.
  - `quote-basket.spec.ts` — form shows basket items; submission posts `items`;
    basket cleared on success.
  - `quote-api.spec.ts` (extended) — accepts valid `items`; rejects bad qty,
    too many items, over-long fields; legacy payload still accepted.
  - `sitemap.spec.ts` (extended) — includes `/shop` and product URLs.
- **Gate before claiming done:** `npm run typecheck`, `npm run lint`,
  `npm run build`, `npx playwright test` all green.

---

## 9. Rollout

1. Work on `redesign-storefront`, one commit per phase:
   tokens + chrome → home → products data + `/shop` + product pages → basket +
   quote integration → remaining pages → tests + docs.
2. Push the branch → Vercel preview URL for the owner to review.
3. Owner verifies a real quote email and the WhatsApp message on the preview.
4. Merge to `master` only on the owner's explicit go-ahead. Rollback = Vercel
   "Promote" previous production deployment.
5. `MAINTENANCE.md` gains "Adding or editing products" (plain English, same
   style as existing sections); `DEPLOY.md` unchanged unless env vars change
   (none planned).

---

## 10. Risks

- **Next.js 16 API differences** (per `AGENTS.md`): `searchParams`/`params`
  handling, metadata and static params must follow
  `node_modules/next/dist/docs/` — check before implementing each page.
- **Placeholder imagery:** many products will start with placeholders or stock
  showcase photos until real job photos are added; the placeholder must look
  intentional.
- **Test churn:** large markup change breaks many existing specs; they are
  updated within the same phase that changes the markup so the suite stays
  meaningful.
