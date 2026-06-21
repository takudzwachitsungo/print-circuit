# Print Circuit — Home Image Marquee — Design

**Status:** Approved (brainstorming) — ready for implementation plan.
**Context:** Standalone follow-up after Phase 6 (merged to `master`). Not part of the 6-phase plan.

## 1. Goal

Turn the text-only marquee below the home hero (`components/home/Marquee.tsx`, currently a scrolling band of service keywords separated by `/`) into an **auto-scrolling band of image cards** — one per print item — so visitors immediately *see* what Print Circuit produces. Use free, commercially-licensed stock images now, structured so real job photos can replace them later with no code change.

## 2. Locked Decisions

| Decision | Choice |
|----------|--------|
| Image source | Free, commercial-use stock (Unsplash / Pexels — no attribution required), committed now; swap for real work later. |
| Slider behaviour | Auto-scrolling image marquee — keep the existing continuous left-scroll; each item becomes an image card with a visible label. |
| Sourcing | Claude fetches + sizes + commits one image per item now; founder reviews the live result and flags any to swap. |
| File location | Images in `public/showcase/`; consumed via `next/image` (local files, no `next.config` remote-pattern change). |
| Honesty | Stock is a representative stopgap; alt text and labels describe the item category honestly (not "our work" claims). Real photos preferred when available. |

## 3. Architecture

A small typed data module is the single source of truth for the marquee items; the component renders them; images are static assets under `public/`. The existing duplicated-track CSS scroll and the global `prefers-reduced-motion` guard (in `app/globals.css`, which freezes all animations) are reused unchanged — no new motion code.

**Units (each one responsibility, independently understandable):**
- `lib/showcase.ts` — exports `SHOWCASE`, the ordered list of items (`label`, `src`, `alt`). Swapping an image = replace a file or edit one line here.
- `components/home/Marquee.tsx` — presentation only: maps `SHOWCASE` into a duplicated, auto-scrolling track of image cards. Keeps `default items` injectable via prop for testability.
- `public/showcase/*.jpg` + `public/showcase/CREDITS.md` — the assets and their provenance record.

## 4. Components & Data

### 4.1 Data layer — `lib/showcase.ts`
```ts
export interface ShowcaseItem {
  label: string;   // visible caption, also the accessible text
  src: string;     // /showcase/<slug>.jpg
  alt: string;     // honest description of the item category
}
export const SHOWCASE: ShowcaseItem[] = [ /* 8 items */ ];
```
Items (preserving the current set): Business Cards, Flyers, Large Format Printing, Banners, Signage, Branding, Stationery, Stickers. Each `src` = `/showcase/<kebab-slug>.jpg`; `alt` e.g. "Printed business cards".

### 4.2 Images — `public/showcase/`
- Eight `.jpg` files, each cropped to a **uniform landscape ratio** (target ~640×400, 16:10) so the row is even and cards are crisp on retina at the rendered size (~256–320px wide).
- Free-licensed (Unsplash/Pexels). `public/showcase/CREDITS.md` records, per image: item, source URL, photographer, license — record-keeping even though attribution isn't required.
- Optimised: reasonable file size (≤ ~150 KB each) so the eight-image band stays light.

### 4.3 Component — `components/home/Marquee.tsx`
- Signature stays `Marquee({ items = SHOWCASE })` (prop injectable for tests); items are `ShowcaseItem[]`.
- Duplicate the track (`[...items, ...items]`) for the seamless `-50%` loop, as today.
- Each card: a fixed-size container (`next/image` with explicit `width`/`height`, `rounded-xl`, `object-cover`) plus the **label rendered as visible text** beneath/over the image (so the label remains in the DOM — preserves SEO and the existing test's text assertion).
- Keep `aria-label="What we print"` on the `<section>`. Each image carries descriptive `alt`. Decorative separators (the `/`) are dropped or kept as the visual rhythm — cards already separate visually; drop the slash.
- No new animation/motion code: the global reduced-motion media query already neutralises `.animate-marquee`.

## 5. Data Flow

`SHOWCASE` (lib) → `Marquee` maps to duplicated track → `next/image` serves optimised local assets from `public/showcase/`. One source, one consumer. To change an item, edit `SHOWCASE` or replace the file at its `src`.

## 6. Error Handling / Edge Cases

- A missing image file surfaces as a broken `next/image` (build does not fail for `/public` string srcs). Mitigation: commit all eight before merging; the new test asserts at least one item image renders.
- `next/image` requires `width`/`height` (or `fill`) — provided explicitly to avoid layout shift (CLS).
- Reduced-motion: inherited global guard; verified by the existing reveal/reduced-motion conventions (no per-component work).

## 7. Testing

- Update `tests/home-marquee.spec.ts`:
  - Keep: the "Large Format Printing" **label** is visible (still rendered as text).
  - Add: an item image renders with its alt text, e.g. `page.getByRole("img", { name: /business cards/i }).first()` is visible.
- Full Playwright suite stays green; `npm run typecheck`, `npm run lint`, `npm run build` clean.
- Manual: founder views `/` and confirms the images are appropriate; flags any to swap (swap = replace file / edit one `src`).

## 8. Out of Scope (YAGNI)

- Manual carousel/arrows/drag, lightbox, per-image links to service pages (the marquee is a glanceable "what we do" band; service links live in the ServicesGrid section).
- Real photography (founder handoff — the structure supports dropping it in later).
- `next.config` remote image patterns (assets are local).

## 9. Success Criteria

- The home band below the hero scrolls image cards (one per print item) with visible labels, sourced from `lib/showcase.ts`.
- Eight committed, uniform, license-recorded images in `public/showcase/`.
- Reduced-motion safe; no CLS (explicit image dimensions).
- Updated marquee test + full suite green; typecheck/lint/build clean.
- Any image is swappable by replacing one file or editing one `SHOWCASE` entry.
