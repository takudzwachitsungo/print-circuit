# Print Circuit — Phase 6: SEO, Performance & Deploy-Readiness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site code-complete and deploy-ready — full SEO infrastructure (metadataBase, canonical, JSON-LD `LocalBusiness`, sitemap, robots, generated OG/twitter image, favicon, manifest), env-gated SMTP delivery for the quote route, the local-SEO copy + `Reveal` accessibility backlog, and a deploy handoff doc.

**Architecture:** Build on Next 16 App Router metadata + special file conventions. Add a single new source field (`SITE.url`) and consume it everywhere (metadataBase/canonical/sitemap/robots/JSON-LD). Per-page metadata authored in Phases 1–5 stays; we only add `alternates.canonical` + per-page `openGraph`. Structured data, OG/brand assets, sitemap and robots are server-rendered/prerendered (no client JS). Email delivery is an additive change inside the existing `deliverQuote` seam; the route's public contract (200/400/500, `QuoteResponse`) is unchanged.

**Tech Stack:** Next.js 16 (App Router, `MetadataRoute.*`, `next/og` `ImageResponse`), TypeScript, Tailwind CSS v4, `nodemailer` (env-gated), Playwright.

## Global Constraints

- Framework: **Next.js (App Router) + TypeScript**. No `pages/` router. Special files live at `app/<name>.ts(x)` and export the documented shapes. (AGENTS.md: the relevant docs under `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/` — `sitemap.md`, `robots.md`, `manifest.md`, `opengraph-image.md`, `app-icons.md` — and `04-functions/generate-metadata.md` were read while writing this plan; re-read the specific one before each task.)
- Styling: **Tailwind CSS v4** only (tokens in `app/globals.css` `@theme`); literal class names only. (OG/icon use inline `style` — required by `ImageResponse`/Satori, which does not run Tailwind.)
- Colour tokens (for OG/manifest literals): base `#0A0A0C`, cyan `#00AEEF`, magenta `#EC008C`, yellow `#FFF200`. Fonts: `font-display` (Space Grotesk), `font-body` (Inter).
- Company voice only ("we"/"our"), never "I"/"my". Honest content — **no fabricated geo coordinates, ratings, or review counts** in JSON-LD.
- **Canonical production URL (verbatim):** `https://www.printcircuit.co.zw`. Single source: `SITE.url`. Never hard-code it elsewhere.
- **Correct phone numbers (verbatim):** `+263 78 872 3331` and `+263 71 776 1048` (never `+236`). Consume `SITE.phones`.
- **No committed secrets.** SMTP/EmailJS values come from env; only `.env.example` with placeholders is committed. Verify `.env*` is gitignored.
- Email delivery is **env-gated**: with SMTP vars unset (dev/CI default) `deliverQuote` logs server-side and the route returns `{ok:true}` — unchanged from Phase 5. Tests run in this log-only mode.
- All motion still respects `prefers-reduced-motion`. The `Reveal` change must not alter its reduced-motion behaviour.
- Every task must pass `npm run typecheck`, `npm run lint`, and `npm run build` with zero errors, and keep the full Playwright suite green, before it is complete.

---

## File Structure

- `lib/site.ts` — **modify.** Add `url: "https://www.printcircuit.co.zw"`.
- `app/layout.tsx` — **modify.** Add `metadataBase`, Twitter card defaults, `openGraph.siteName`/`url`; mount `<JsonLd />`.
- `app/page.tsx` — **modify.** Add `metadata` export (canonical `/`).
- `app/{services,work,about,contact}/page.tsx` — **modify.** Add `alternates.canonical` + `openGraph` to existing `metadata`.
- `app/services/[slug]/page.tsx`, `app/work/[slug]/page.tsx` — **modify.** Add canonical in `generateMetadata`.
- `components/seo/JsonLd.tsx` — **create.** Server component emitting `LocalBusiness` JSON-LD from `SITE`.
- `app/sitemap.ts`, `app/robots.ts` — **create.**
- `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/icon.tsx`, `app/manifest.ts` — **create.**
- `app/api/quote/route.ts` — **modify.** Env-gated SMTP transport in `deliverQuote`.
- `.env.example` — **create.**
- `lib/services.ts` — **modify.** Render the keyword-aware `seoTitle` as the visible service `<h1>`.
- `components/services/ServiceHero.tsx` — **modify.** Use `service.seoTitle` for the `<h1>`.
- `components/animation/Reveal.tsx` — **modify.** Add polymorphic `as` prop.
- `components/about/TeamGrid.tsx`, `components/services/ServiceIncluded.tsx` — **modify.** Use `<Reveal as="li">`.
- `DEPLOY.md` — **create.**
- Tests — **create:** `tests/canonical.spec.ts`, `tests/json-ld.spec.ts`, `tests/sitemap.spec.ts`, `tests/robots.spec.ts`, `tests/brand-assets.spec.ts`, `tests/service-seo.spec.ts`, `tests/reveal-list.spec.ts`.

---

### Task 1: Metadata foundation — `SITE.url`, `metadataBase`, canonical & OG/Twitter flow

**Files:**
- Modify: `lib/site.ts`, `app/layout.tsx`, `app/page.tsx`, `app/services/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/services/[slug]/page.tsx`, `app/work/[slug]/page.tsx`
- Test: `tests/canonical.spec.ts`

**Interfaces:**
- Consumes: `SITE` from `@/lib/site`.
- Produces: `SITE.url: string`. Every route exposes `<link rel="canonical">` resolving against `metadataBase`. Root `openGraph` carries `siteName: "Print Circuit"` and `url`; Twitter card defaults to `summary_large_image`.

- [ ] **Step 1: Add the canonical URL to site constants**

In `lib/site.ts`, add `url` as the first field inside `SITE`:
```ts
export const SITE = {
  name: "Print Circuit",
  url: "https://www.printcircuit.co.zw",
  legalName: "Printcircuit Enterprises (Private) Limited",
```

- [ ] **Step 2: Write the failing canonical test**

Create `tests/canonical.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

const cases: [string, string][] = [
  ["/", "https://www.printcircuit.co.zw/"],
  ["/services", "https://www.printcircuit.co.zw/services"],
  ["/services/printing", "https://www.printcircuit.co.zw/services/printing"],
  ["/work", "https://www.printcircuit.co.zw/work"],
  ["/about", "https://www.printcircuit.co.zw/about"],
  ["/contact", "https://www.printcircuit.co.zw/contact"],
];

for (const [path, expected] of cases) {
  test(`canonical link on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expected,
    );
  });
}
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx playwright test tests/canonical.spec.ts`
Expected: FAIL (no canonical links yet).

- [ ] **Step 4: Set metadataBase + OG/Twitter defaults in the root layout**

In `app/layout.tsx`, replace the `metadata` export with:
```tsx
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Print Circuit | Printing & Branding in Zimbabwe",
    template: "%s | Print Circuit",
  },
  description:
    "Print Circuit is a Harare-based printing, branding, signage and design company serving businesses across Zimbabwe.",
  openGraph: {
    title: "Print Circuit",
    siteName: "Print Circuit",
    url: SITE.url,
    type: "website",
    locale: "en_ZW",
  },
  twitter: {
    card: "summary_large_image",
    title: "Print Circuit",
    description:
      "Harare-based printing, branding, signage and design for businesses across Zimbabwe.",
  },
};
```
(Keep the existing `import { display, body } from "./fonts";` and other imports; only the `metadata` object and the new `SITE` import change.)

- [ ] **Step 5: Add canonical to the home page**

`app/page.tsx` currently has no `metadata` export. Add these two lines at the top (after the existing imports):
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};
```

- [ ] **Step 6: Add canonical + openGraph url to the four static inner pages**

In each of `app/services/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, extend the existing `metadata` object with `alternates` and an `openGraph.url`. Use the matching path. Example for `app/services/page.tsx` (apply the analogous path to each):
```tsx
export const metadata: Metadata = {
  // ...existing title/description...
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};
```
Paths: `/services`, `/work`, `/about`, `/contact`. If a page already defines `openGraph`, merge `url` into it rather than adding a second key.

- [ ] **Step 7: Add canonical to the two dynamic routes**

In `app/services/[slug]/page.tsx` `generateMetadata`, change the returned object's `openGraph` and add `alternates`:
```tsx
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: `/services/${slug}`,
    },
  };
```
In `app/work/[slug]/page.tsx` `generateMetadata`, analogously:
```tsx
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/work/${slug}`,
    },
  };
```

- [ ] **Step 8: Run to verify it passes**

Run: `npx playwright test tests/canonical.spec.ts` → Expected: PASS (6 tests).
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add metadataBase, canonical URLs and OG/Twitter metadata"
```

---

### Task 2: JSON-LD `LocalBusiness` structured data

**Files:**
- Create: `components/seo/JsonLd.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/json-ld.spec.ts`

**Interfaces:**
- Consumes: `SITE` (`name`, `url`, `email`, `phones`, `address`, `socials`).
- Produces: `<JsonLd />` default export — a server component rendering one `<script type="application/ld+json">` containing a `LocalBusiness` object (NAP + url + sameAs). No client JS.

Scope note: spec §7 requires JSON-LD `LocalBusiness` with **NAP** (name, address, phone). We deliberately keep it to NAP + url + email + `sameAs`, and do **not** emit `openingHoursSpecification` (the `SITE.hours` strings like "Monday – Friday" don't map cleanly to schema `dayOfWeek`, and hours are already in the visible `ContactInfo`). No fabricated geo/ratings.

- [ ] **Step 1: Write the failing test**

Create `tests/json-ld.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("home page emits a valid LocalBusiness JSON-LD with NAP", async ({ page }) => {
  await page.goto("/");
  const json = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@type"]).toBe("LocalBusiness");
  expect(data.name).toBe("Print Circuit");
  expect(data.url).toBe("https://www.printcircuit.co.zw");
  expect(data.telephone).toBe("+263 78 872 3331");
  expect(data.address.addressLocality).toBe("Harare");
  expect(JSON.stringify(data)).not.toContain("+236");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/json-ld.spec.ts` → Expected: FAIL (no ld+json script).

- [ ] **Step 3: Implement JsonLd**

Create `components/seo/JsonLd.tsx`:
```tsx
import { SITE } from "@/lib/site";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: "61 Mendel, Avondale",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    areaServed: "Zimbabwe",
    sameAs: Object.values(SITE.socials),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```
Note: `JSON.stringify` escapes quotes; there is no untrusted/user input here, so this is safe. `address.streetAddress` is split from `SITE.address` (which is the full one-line NAP) so the structured `addressLocality`/`addressCountry` are explicit and honest.

- [ ] **Step 4: Mount it in the root layout**

In `app/layout.tsx`, import and render `<JsonLd />` inside `<body>`, before `<SmoothScroll>`:
```tsx
import JsonLd from "@/components/seo/JsonLd";
```
```tsx
      <body className="min-h-full flex flex-col bg-base text-primary font-body antialiased">
        <JsonLd />
        <SmoothScroll>
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx playwright test tests/json-ld.spec.ts` → Expected: PASS.
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add LocalBusiness JSON-LD structured data"
```

---

### Task 3: `sitemap.ts` and `robots.ts`

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Test: `tests/sitemap.spec.ts`, `tests/robots.spec.ts`

**Interfaces:**
- Consumes: `SITE.url`, `SITE.services`, `PROJECTS` from `@/lib/projects`.
- Produces: `/sitemap.xml` (all static + service + work URLs, absolute) and `/robots.txt` (allow all, references sitemap).

- [ ] **Step 1: Write the failing tests**

Create `tests/sitemap.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("sitemap lists all routes as absolute URLs", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const path of [
    "",
    "/services",
    "/services/printing",
    "/work",
    "/work/uz-event-flyer",
    "/about",
    "/contact",
  ]) {
    expect(xml).toContain(`https://www.printcircuit.co.zw${path}</loc>`);
  }
});
```

Create `tests/robots.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("robots allows crawling and points to the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const txt = await res.text();
  expect(txt).toMatch(/Allow: \//);
  expect(txt).toContain("https://www.printcircuit.co.zw/sitemap.xml");
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test tests/sitemap.spec.ts tests/robots.spec.ts` → Expected: FAIL (404 / not generated).

- [ ] **Step 3: Implement the sitemap**

Create `app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE.url}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url(""), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/work"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = SITE.services.map((s) => ({
    url: url(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const workRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: url(`/work/${p.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...workRoutes];
}
```

- [ ] **Step 4: Implement robots**

Create `app/robots.ts`:
```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
```

- [ ] **Step 5: Run to verify they pass**

Run: `npx playwright test tests/sitemap.spec.ts tests/robots.spec.ts` → Expected: PASS.
Run: `npm run lint && npm run typecheck && npm run build` → success (`/sitemap.xml` and `/robots.txt` appear in build output).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sitemap.xml and robots.txt"
```

---

### Task 4: Generated brand assets — OG image, Twitter image, favicon, manifest

**Files:**
- Create: `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/icon.tsx`, `app/manifest.ts`
- Test: `tests/brand-assets.spec.ts`

**Interfaces:**
- Consumes: nothing (self-contained; literal brand tokens).
- Produces: a 1200×630 PNG OG image + matching Twitter image, a generated favicon, and `/manifest.webmanifest`. Home `<head>` exposes `og:image`, `twitter:image`, `icon`, and `manifest` links.

Decision (resolves spec §4.5 open item): favicon is generated in-code via `app/icon.tsx` (no committed binary). `ImageResponse` from `next/og` renders Latin text with its built-in default font, so no font files are needed.

- [ ] **Step 1: Write the failing test**

Create `tests/brand-assets.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("home references an OG image that serves as PNG", async ({ page, request }) => {
  await page.goto("/");
  const ogHref = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogHref).toBeTruthy();
  const res = await request.get(ogHref!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("manifest is served with the brand name and theme colour", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.status()).toBe(200);
  const manifest = await res.json();
  expect(manifest.name).toContain("Print Circuit");
  expect(manifest.theme_color).toBe("#0A0A0C");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/brand-assets.spec.ts` → Expected: FAIL.

- [ ] **Step 3: Implement the OG image**

Create `app/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const alt = "Print Circuit — Printing & Branding in Harare, Zimbabwe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0A0A0C",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: "#00AEEF" }} />
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: "#EC008C" }} />
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: "#FFF200" }} />
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 }}>
          Print Circuit
        </div>
        <div style={{ fontSize: 40, color: "#A1A1AA", marginTop: 24 }}>
          Printing, branding & signage in Harare, Zimbabwe
        </div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 4: Implement the Twitter image (reuse the OG renderer)**

Create `app/twitter-image.tsx`:
```tsx
export { default, alt, size, contentType } from "./opengraph-image";
```

- [ ] **Step 5: Implement the favicon**

Create `app/icon.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0C",
          color: "#00AEEF",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 6: Implement the manifest**

Create `app/manifest.ts`:
```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Printing & Branding`,
    short_name: SITE.name,
    description:
      "Harare-based printing, branding, signage and design for businesses across Zimbabwe.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0C",
    theme_color: "#0A0A0C",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
```

- [ ] **Step 7: Run to verify it passes**

Run: `npx playwright test tests/brand-assets.spec.ts` → Expected: PASS (both).
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add generated OG/Twitter image, favicon and web manifest"
```

---

### Task 5: SMTP / Nodemailer quote delivery (env-gated) + `.env.example`

**Files:**
- Modify: `app/api/quote/route.ts`
- Create: `.env.example`
- Install: `nodemailer`, `@types/nodemailer` (dev)
- Test: `tests/quote-api.spec.ts` (existing — must stay green in log-only mode)

**Interfaces:**
- Consumes: `QuoteRequest` (unchanged).
- Produces: `deliverQuote(data)` — sends via SMTP when `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/`QUOTE_TO` are all set; otherwise logs (existing behaviour). Route contract (200/400/500, `QuoteResponse`) unchanged.

- [ ] **Step 1: Install Nodemailer**

Run: `npm install nodemailer` and `npm install -D @types/nodemailer`

- [ ] **Step 2: Confirm the existing API test still describes the log-only contract**

No new test code. Re-read `tests/quote-api.spec.ts` — it posts a valid quote and expects `200 {ok:true}` and an invalid one expecting `400`. With no SMTP env set, the reworked `deliverQuote` must keep returning normally so these still pass. (This is the regression guard for this task; the SMTP send path needs a real mailbox and is verified manually per `DEPLOY.md`.)

- [ ] **Step 3: Rework `deliverQuote`**

In `app/api/quote/route.ts`, replace the `deliverQuote` function (keep the rest of the file unchanged):
```ts
import nodemailer from "nodemailer";
import { validateQuote, type QuoteRequest, type QuoteResponse } from "@/lib/quote";

// Backend-ready seam. Sends the validated quote by SMTP when the mail env vars
// are configured; otherwise logs server-side so nothing is lost (dev/CI default).
async function deliverQuote(data: QuoteRequest): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_TO, QUOTE_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !QUOTE_TO) {
    console.info("[quote] new submission (mail not configured)", data);
    return;
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transport.sendMail({
    from: QUOTE_FROM ?? SMTP_USER,
    to: QUOTE_TO,
    replyTo: data.email,
    subject: `Quote request: ${data.service} — ${data.name}`,
    text: [
      `Service: ${data.service}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      "",
      data.details,
    ].join("\n"),
  });
}
```
Note: `process.env` is read inside the function (request-time), so this route stays dynamic — which it already is. Do not change the `POST` handler body.

- [ ] **Step 4: Create `.env.example`**

Create `.env.example`:
```bash
# Canonical site URL is hard-coded in lib/site.ts (SITE.url); no env needed.

# Server-side quote delivery (app/api/quote). Unset = submissions are logged
# server-side only. Set all four (HOST/USER/PASS/QUOTE_TO) to enable SMTP email.
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
QUOTE_TO=info@printcircuit.co.zw
QUOTE_FROM=

# Client-side EmailJS fallback (components/contact/QuoteForm). Optional — the
# form posts to /api/quote first; EmailJS only fires if these are all set.
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

- [ ] **Step 5: Verify env files are gitignored, then run the suite**

Run: `git check-ignore .env .env.local` → Expected: both printed (ignored). If `.env*` is NOT ignored, add `.env` and `.env*.local` to `.gitignore` before continuing.
Run: `npx playwright test tests/quote-api.spec.ts` → Expected: PASS (2, log-only mode).
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: wire env-gated SMTP delivery for /api/quote"
```

---

### Task 6: Local-SEO copy — keyword-aware service `<h1>`

**Files:**
- Modify: `components/services/ServiceHero.tsx`
- Test: `tests/service-seo.spec.ts`

**Interfaces:**
- Consumes: `service.seoTitle` (already on every `Service`, e.g. "Printing Services in Harare").
- Produces: the visible service-detail `<h1>` is the keyword+location `seoTitle`.

Rationale: spec §9 wants per-service pages "keyword-targeted" with the local phrase in visible copy. `seoTitle` is already honest and Harare-aware; surfacing it as the `<h1>` (instead of the bare `label`) satisfies this with no new content. The existing `service-detail.spec.ts` asserts the H1 matches `/Printing Services/`, which is a substring of "Printing Services in Harare", so it stays green.

- [ ] **Step 1: Write the failing test**

Create `tests/service-seo.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("service H1 surfaces the local-SEO phrase", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(
    page.getByRole("heading", { level: 1, name: "Printing Services in Harare" }),
  ).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/service-seo.spec.ts` → Expected: FAIL (H1 is currently "Printing Services").

- [ ] **Step 3: Use `seoTitle` for the H1**

In `components/services/ServiceHero.tsx`, change the `<h1>` content from `{service.label}` to `{service.seoTitle}`:
```tsx
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold text-primary sm:text-6xl">
          {service.seoTitle}
        </h1>
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx playwright test tests/service-seo.spec.ts tests/service-detail.spec.ts` → Expected: PASS (new test + the existing service-detail tests still green).
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: surface local-SEO phrase in service page H1"
```

---

### Task 7: `Reveal` polymorphic `as` prop + valid list markup

**Files:**
- Modify: `components/animation/Reveal.tsx`, `components/about/TeamGrid.tsx`, `components/services/ServiceIncluded.tsx`
- Test: `tests/reveal-list.spec.ts` (and existing `tests/reveal.spec.ts` stays green)

**Interfaces:**
- Consumes: nothing new.
- Produces: `Reveal` accepts `as?: ElementType` (default `"div"`); renders that element with the GSAP ref, `className`, and `children`. `TeamGrid` and `ServiceIncluded` render their animated items as `<Reveal as="li">`, giving valid `<ul> > <li>` markup.

- [ ] **Step 1: Write the failing test**

Create `tests/reveal-list.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("about team list has valid ul > li markup", async ({ page }) => {
  await page.goto("/about");
  const items = page.locator("section ul > li", {
    has: page.getByRole("heading", { level: 3 }),
  });
  await expect(items.first()).toBeVisible();
});

test("service included list has valid ul > li markup", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(page.locator("ul > li").first()).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test tests/reveal-list.spec.ts` → Expected: FAIL (current markup is `<ul> > <div> > <li>`, so `ul > li` direct-child selector matches nothing).

- [ ] **Step 3: Make `Reveal` polymorphic**

Replace `components/animation/Reveal.tsx`:
```tsx
"use client";

import { useEffect, useRef, type ElementType } from "react";
import { gsap } from "@/lib/gsap";

export default function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
```
Note: `ref` is typed `HTMLElement` (was `HTMLDivElement`) since the element type is now dynamic; GSAP accepts any element.

- [ ] **Step 4: Use `as="li"` in TeamGrid**

In `components/about/TeamGrid.tsx`, change the mapped `Reveal` so it *is* the `<li>` (move the `<li>`'s classes onto `Reveal`, drop the inner `<li>`):
```tsx
        {TEAM.map((member, i) => (
          <Reveal
            as="li"
            key={member.name}
            delay={i * 0.05}
            className="h-full rounded-2xl border border-white/10 bg-surface p-6"
          >
            <div
              aria-hidden
              className="aspect-square w-20 overflow-hidden rounded-full bg-gradient-to-br from-cyan/30 via-magenta/30 to-yellow/30"
            />
            <h3 className="mt-5 font-display text-lg font-bold text-primary">
              {member.name}
            </h3>
            <p className="mt-1 text-sm text-cyan">{member.role}</p>
            <p className="mt-3 text-sm text-muted">{member.bio}</p>
          </Reveal>
        ))}
```

- [ ] **Step 5: Use `as="li"` in ServiceIncluded**

In `components/services/ServiceIncluded.tsx`, change the mapped `Reveal` so it *is* the `<li>`:
```tsx
        {service.included.map((item, i) => (
          <Reveal
            as="li"
            key={item}
            delay={i * 0.05}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface px-5 py-4"
          >
            <span
              aria-hidden
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${accent.bgSoft} ${accent.text} font-display text-sm`}
            >
              +
            </span>
            <span className="text-primary">{item}</span>
          </Reveal>
        ))}
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/reveal-list.spec.ts tests/reveal.spec.ts tests/about-team.spec.ts tests/service-included.spec.ts` → Expected: ALL PASS (new markup + existing reveal/team/included specs).
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Reveal as-prop and fix invalid list markup"
```

---

### Task 8: Deploy handoff doc + full Phase 6 verification

**Files:**
- Create: `DEPLOY.md`

**Interfaces:**
- Consumes: everything above.
- Produces: `DEPLOY.md` (env vars, build/run, DNS/canonical, post-deploy checklist). No live deploy.

- [ ] **Step 1: Write `DEPLOY.md`**

Create `DEPLOY.md`:
```markdown
# Deploying Print Circuit

## Build & run

Node 20+. Production build:

```bash
npm ci
npm run build
npm run start   # serves the production build
```

## Environment variables

Copy `.env.example` to `.env` (or set these in your host's dashboard). All are
optional — unset values degrade gracefully.

| Variable | Purpose | If unset |
| --- | --- | --- |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `QUOTE_TO` | Email quote submissions via your mailbox | `/api/quote` logs submissions server-side instead of emailing |
| `SMTP_PORT` | SMTP port (default 587; 465 ⇒ TLS) | 587 |
| `QUOTE_FROM` | From address | falls back to `SMTP_USER` |
| `NEXT_PUBLIC_EMAILJS_*` | Client-side send fallback | form relies on `/api/quote` only |

After setting SMTP vars, submit the contact form once and confirm the email
arrives at `QUOTE_TO`; check `replyTo` is the submitter's address.

## Canonical domain

Canonical URL is `https://www.printcircuit.co.zw` (set in `lib/site.ts`,
`SITE.url`). Point the `www` DNS record at your host and redirect the apex
(`printcircuit.co.zw`) to `www`. If the production host changes, update
`SITE.url` — it feeds metadataBase, canonical tags, the sitemap, robots, and
JSON-LD.

## Post-deploy checklist

- [ ] `https://www.printcircuit.co.zw/sitemap.xml` and `/robots.txt` resolve.
- [ ] Submit `/sitemap.xml` in Google Search Console.
- [ ] Set SMTP env vars and confirm a test quote email is received.
- [ ] Run Lighthouse (mobile) against the production URL; target SEO 100,
      Accessibility ≥ 95, Performance ≥ 90. Image-weight optimisation (via
      `next/image`) is deferred until real project photography replaces the
      current placeholder gallery blocks.
```

- [ ] **Step 2: Full Phase 6 verification**

Run: `npm run typecheck` → Expected: clean.
Run: `npm run lint` → Expected: clean.
Run: `npm run build` → Expected: success; build output lists `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/opengraph-image`, `/twitter-image`, `/icon`, and the existing routes.
Run: `npx playwright test` → Expected: ALL pass (Phases 1–5 specs + the new canonical, json-ld, sitemap, robots, brand-assets, service-seo, reveal-list specs).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: add deploy handoff guide and finalise Phase 6"
```

---

## Self-Review

**Spec coverage (design §3–§9):**
- §4.1 site constants + `.env.example` → Task 1 (url), Task 5 (`.env.example`). ✓
- §4.2 metadataBase + canonical + OG/Twitter flow → Task 1. ✓
- §4.3 JSON-LD LocalBusiness (NAP) → Task 2. ✓ (hours intentionally omitted — documented deviation, spec §7 requires NAP only)
- §4.4 sitemap + robots → Task 3. ✓
- §4.5 OG image + twitter + icon + manifest → Task 4. ✓ (icon = generated, open item resolved)
- §4.6 SMTP/Nodemailer env-gated delivery → Task 5. ✓
- §4.7 local-SEO copy in visible H1 → Task 6. ✓
- §4.8 Reveal `as` prop + TeamGrid/ServiceIncluded → Task 7. ✓
- §4.9 DEPLOY.md → Task 8. ✓
- §7 testing — each unit has a Playwright spec; full suite green gate in Task 8. ✓

**Deviations flagged:**
- JSON-LD omits `openingHoursSpecification` (SITE.hours strings don't map cleanly to schema `dayOfWeek`; hours remain visible in `ContactInfo`). Spec §7 only mandates NAP, so this is in-scope.
- SMTP send path is not e2e-tested (needs a live mailbox); the env-gated log path is the regression guard, and manual verification is in `DEPLOY.md`. Honest given no unit-test runner (Playwright-only).
- Performance is a structural pass + manual Lighthouse (no real images exist yet); image optimisation deferred with the real assets. Matches design §7.

**Placeholder scan:** every code step contains complete code. No TBD/TODO. No fabricated secrets, geo, or ratings. OG/icon use `next/og`'s built-in font (no font files).

**Type consistency:** `SITE.url` (string) added Task 1, consumed by Tasks 2/3/4. `JsonLd` default export (Task 2) mounted in layout (Task 2). `MetadataRoute.Sitemap`/`.Robots`/`.Manifest` per Next docs. `deliverQuote(data: QuoteRequest): Promise<void>` signature unchanged (Task 5). `Reveal`'s new `as?: ElementType` (Task 7) is optional, so all existing `<Reveal>` call sites stay valid; `service.seoTitle` (Task 6) is an existing field.

## Execution Handoff

You chose **subagent-driven** execution. Next: invoke superpowers:subagent-driven-development — fresh subagent per task, two-stage review between tasks, working from this plan top to bottom.
