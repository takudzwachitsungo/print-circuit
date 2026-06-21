# Print Circuit — Phase 5: Contact & Get-a-Quote — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/contact` page — a multi-step "Get a quote" form backed by a typed `/api/quote` route, alongside a contact panel with NAP, WhatsApp click-to-chat, opening hours, and an embedded map.

**Architecture:** A typed quote data layer (`lib/quote.ts`) holds the request/response types and a single `validateQuote` function shared by the API route and (implicitly) the form. The API Route Handler (`app/api/quote/route.ts`) validates and accepts submissions through a `deliverQuote` seam (logs server-side today; wired to email/DB/CRM later — backend-ready per spec §8). A client multi-step form posts to that route, with an env-gated EmailJS fallback and a WhatsApp/phone fallback on error. The page is a split layout: form left, contact info (from `lib/site.ts`) right.

**Tech Stack:** Next.js 16 (App Router Route Handlers, async), TypeScript, Tailwind CSS v4, `@emailjs/browser` (env-gated fallback), Playwright.

## Global Constraints

- Framework: **Next.js (App Router) + TypeScript**. No `pages/` router. **Route Handlers** live in `app/api/<name>/route.ts` and export async HTTP-method functions: `export async function POST(request: Request)`. Return `Response.json(body, { status })`. POST is **not** cached. (AGENTS.md: read `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` and `.../03-api-reference/03-file-conventions/route.md` before writing the route.)
- Styling: **Tailwind CSS v4** only (tokens in `app/globals.css` `@theme`); no inline style objects except dynamic animation values; literal class names only.
- Colour tokens: `bg-base`, `bg-surface`, `text-primary`, `text-muted`, `text-cyan`, `text-magenta`, `text-yellow`. Fonts: `font-display` (headings), `font-body` (body).
- All motion respects `prefers-reduced-motion`. This phase adds NO scroll/Framer animation (a form and an info panel); no new guards needed. Do not add raw Framer `whileInView`/`animate`.
- Company voice only ("we"/"our"), never "I"/"my". Honest content.
- **Correct phone numbers (verbatim):** `+263 78 872 3331` and `+263 71 776 1048` (never `+236`). These already live in `SITE.phones` — consume them; never hard-code a number.
- **Address (verbatim):** `61 Mendel, Avondale, Harare, Zimbabwe` (already `SITE.address`).
- **WhatsApp (verbatim):** `https://wa.me/263788723331` (already `SITE.whatsapp`).
- EmailJS fallback is **env-gated** behind `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`. With these unset (default in dev/CI) the fallback is inert and the primary `/api/quote` path is used. Do not commit any keys.
- Reuse `SITE` from `@/lib/site` for all NAP/WhatsApp/socials/services data.
- Every task must pass `npm run typecheck`, `npm run lint`, and `npm run build` with zero errors, and keep the full Playwright suite green, before it is complete.

---

## File Structure

- `lib/quote.ts` — **create.** `QuoteRequest`/`QuoteResponse` types + `validateQuote(input: unknown)`. Single source of the request contract.
- `app/api/quote/route.ts` — **create.** POST Route Handler: parse → validate → `deliverQuote` → JSON response.
- `components/contact/QuoteForm.tsx` — **create.** Client multi-step form (Service → Details → Contact) posting to `/api/quote`.
- `lib/site.ts` — **modify.** Add `hours` (opening hours).
- `components/contact/ContactInfo.tsx` — **create.** NAP, WhatsApp, hours, socials, embedded map.
- `app/contact/page.tsx` — **modify** (replace the Phase 1 stub) — split layout + metadata.
- `tests/quote-api.spec.ts`, `tests/quote-form.spec.ts`, `tests/contact-info.spec.ts` — **create.**

---

### Task 1: Quote types, validation & `/api/quote` Route Handler

**Files:**
- Create: `lib/quote.ts`, `app/api/quote/route.ts`
- Test: `tests/quote-api.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `interface QuoteRequest { service: string; details: string; name: string; email: string; phone: string }`
  - `interface QuoteResponse { ok: boolean; error?: string }`
  - `function validateQuote(input: unknown): { valid: true; data: QuoteRequest } | { valid: false; error: string }`
  - `POST /api/quote` → `200 {ok:true}` on valid, `400 {ok:false,error}` on invalid, `500 {ok:false,error}` on delivery failure.

- [ ] **Step 1: Read the Next docs**

Read `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`. No code yet.

- [ ] **Step 2: Create the quote data layer**

Create `lib/quote.ts`:
```ts
export interface QuoteRequest {
  service: string;
  details: string;
  name: string;
  email: string;
  phone: string;
}

export interface QuoteResponse {
  ok: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuote(
  input: unknown,
):
  | { valid: true; data: QuoteRequest }
  | { valid: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { valid: false, error: "Invalid request body." };
  }
  const r = input as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const service = str(r.service);
  const details = str(r.details);
  const name = str(r.name);
  const email = str(r.email);
  const phone = str(r.phone);

  if (!service) return { valid: false, error: "Please choose a service." };
  if (!name) return { valid: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  if (!phone) return { valid: false, error: "Please enter a phone number." };
  if (details.length < 10) {
    return { valid: false, error: "Please tell us a little more about your project." };
  }

  return { valid: true, data: { service, details, name, email, phone } };
}
```

- [ ] **Step 3: Write the failing API test**

Create `tests/quote-api.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("quote API accepts a valid submission", async ({ request }) => {
  const res = await request.post("/api/quote", {
    data: {
      service: "Printing Services",
      details: "We need 500 business cards printed on matte stock.",
      name: "Test User",
      email: "test@example.com",
      phone: "+263 78 000 0000",
    },
  });
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});

test("quote API rejects an invalid submission", async ({ request }) => {
  const res = await request.post("/api/quote", {
    data: { service: "", details: "", name: "", email: "bad", phone: "" },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(typeof body.error).toBe("string");
});
```

- [ ] **Step 4: Run to verify it fails**

Run: `npx playwright test tests/quote-api.spec.ts` → Expected: FAIL (route does not exist → 404).

- [ ] **Step 5: Implement the Route Handler**

Create `app/api/quote/route.ts`:
```ts
import { validateQuote, type QuoteRequest, type QuoteResponse } from "@/lib/quote";

// Backend-ready seam: today we log the validated quote server-side so nothing is
// lost; wire this to email / DB / CRM when provider credentials are available.
async function deliverQuote(data: QuoteRequest): Promise<void> {
  console.info("[quote] new submission", data);
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const res: QuoteResponse = { ok: false, error: "Invalid request body." };
    return Response.json(res, { status: 400 });
  }

  const result = validateQuote(body);
  if (!result.valid) {
    const res: QuoteResponse = { ok: false, error: result.error };
    return Response.json(res, { status: 400 });
  }

  try {
    await deliverQuote(result.data);
  } catch {
    const res: QuoteResponse = {
      ok: false,
      error: "We couldn't submit your request. Please try again.",
    };
    return Response.json(res, { status: 500 });
  }

  const res: QuoteResponse = { ok: true };
  return Response.json(res, { status: 200 });
}
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/quote-api.spec.ts` → Expected: PASS (both).
Run: `npm run lint && npm run typecheck && npm run build` → success (`/api/quote` appears as a route in the build output).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add typed quote validation and /api/quote route handler"
```

---

### Task 2: Multi-step quote form

**Files:**
- Create: `components/contact/QuoteForm.tsx`
- Modify: `app/contact/page.tsx`
- Test: `tests/quote-form.spec.ts`
- Install: `@emailjs/browser`

**Interfaces:**
- Consumes: `QuoteRequest` from `@/lib/quote`; `SITE` from `@/lib/site`; `POST /api/quote`.
- Produces: `<QuoteForm />` — a 3-step form (Service → Details → Contact) that POSTs to `/api/quote`, shows a success panel on `{ok:true}`, and an inline error (with WhatsApp fallback) otherwise. EmailJS fallback fires only when the `NEXT_PUBLIC_EMAILJS_*` env vars are set.

- [ ] **Step 1: Install the EmailJS fallback dependency**

Run: `npm install @emailjs/browser`

- [ ] **Step 2: Write the failing test**

Create `tests/quote-form.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("visitor can complete the multi-step quote form", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Request a quote" });

  await form.getByRole("radio", { name: "Printing Services" }).check();
  await form.getByRole("button", { name: "Next" }).click();

  await form.getByLabel(/Tell us about your project/i).fill(
    "We need 500 business cards printed on matte stock.",
  );
  await form.getByRole("button", { name: "Next" }).click();

  await form.getByLabel("Name", { exact: true }).fill("Test User");
  await form.getByLabel("Email", { exact: true }).fill("test@example.com");
  await form.getByLabel("Phone", { exact: true }).fill("+263 78 000 0000");
  await form.getByRole("button", { name: /Send request/i }).click();

  await expect(page.getByText(/Thanks/i)).toBeVisible();
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx playwright test tests/quote-form.spec.ts` → Expected: FAIL (no form on `/contact` yet).

- [ ] **Step 4: Implement QuoteForm**

Create `components/contact/QuoteForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import type { QuoteRequest } from "@/lib/quote";

const STEPS = ["Service", "Details", "Contact"] as const;

const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

// Env-gated reliability fallback. Inert (returns false) unless all three keys
// are configured, so dev/CI use the /api/quote path only.
async function sendViaEmailJs(data: QuoteRequest): Promise<boolean> {
  if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) return false;
  const emailjs = (await import("@emailjs/browser")).default;
  await emailjs.send(
    EMAILJS.serviceId,
    EMAILJS.templateId,
    { ...data },
    { publicKey: EMAILJS.publicKey },
  );
  return true;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState<QuoteRequest>({
    service: "",
    details: "",
    name: "",
    email: "",
    phone: "",
  });

  const set = (k: keyof QuoteRequest, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canAdvance =
    (step === 0 && form.service !== "") ||
    (step === 1 && form.details.trim().length >= 10) ||
    step === 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (await sendViaEmailJs(form).catch(() => false)) {
        setStatus("success");
        return;
      }
      const body = await res.json().catch(() => ({}));
      setStatus("error");
      setError(typeof body.error === "string" ? body.error : "Something went wrong.");
    } catch {
      if (await sendViaEmailJs(form).catch(() => false)) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setError("We couldn't reach the server.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface p-8">
        <h2 className="font-display text-2xl font-bold text-primary">
          Thanks — we&rsquo;ve got it.
        </h2>
        <p className="mt-3 text-muted">
          We&rsquo;ll get back to you with a quote, usually the same day. Need us
          sooner?
        </p>
        <a
          href={SITE.whatsapp}
          className="mt-4 inline-block font-medium text-cyan hover:text-magenta"
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
      className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8"
    >
      <ol className="flex gap-2" aria-hidden>
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-cyan" : "bg-white/10"}`}
          />
        ))}
      </ol>
      <p className="mt-4 font-display text-sm uppercase tracking-[0.2em] text-muted">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>

      {step === 0 && (
        <fieldset className="mt-6">
          <legend className="font-display text-xl text-primary">
            Which service do you need?
          </legend>
          <div className="mt-4 space-y-3">
            {SITE.services.map((s) => (
              <label
                key={s.slug}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 p-3 hover:border-cyan/50"
              >
                <input
                  type="radio"
                  name="service"
                  value={s.label}
                  checked={form.service === s.label}
                  onChange={() => set("service", s.label)}
                  className="accent-cyan"
                />
                <span className="text-primary">{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <div className="mt-6">
          <label htmlFor="details" className="font-display text-xl text-primary">
            Tell us about your project
          </label>
          <textarea
            id="details"
            name="details"
            rows={6}
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder="What do you need, how many, and by when?"
            className="mt-4 w-full rounded-xl border border-white/10 bg-base p-4 text-primary placeholder:text-muted focus:border-cyan focus:outline-none"
          />
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-muted">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-base p-3 text-primary focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-base p-3 text-primary focus:border-cyan focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-muted">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-base p-3 text-primary focus:border-cyan focus:outline-none"
            />
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
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => canAdvance && setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="rounded-full bg-cyan px-6 py-2 font-display text-sm text-base hover:bg-magenta hover:text-primary disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-cyan px-6 py-2 font-display text-sm text-base hover:bg-magenta hover:text-primary disabled:opacity-40"
          >
            {status === "submitting" ? "Sending…" : "Send request"}
          </button>
        )}
      </div>
    </form>
  );
}
```
Note: client gating only blocks advancing past empty Service/short Details; the contact fields are authoritatively validated server-side by `validateQuote` (a 400 surfaces the inline error + WhatsApp). The `text-base` utility on buttons is the base background colour token used as text colour against the cyan fill — consistent with `MagneticButton`.

- [ ] **Step 5: Mount the form on the contact page**

Replace `app/contact/page.tsx` entirely:
```tsx
import type { Metadata } from "next";
import QuoteForm from "@/components/contact/QuoteForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get a quote from Print Circuit — Harare printing, branding, signage and web. Call, WhatsApp, or send us your project details.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
        Contact
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold text-primary sm:text-6xl">
        Get a quote
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Tell us about your project and we&rsquo;ll get you a quote — usually the
        same day.
      </p>
      <div className="mt-12 max-w-2xl">
        <QuoteForm />
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/quote-form.spec.ts` → Expected: PASS.
Run: `npm run lint && npm run typecheck && npm run build` → success.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add multi-step quote form posting to /api/quote"
```

---

### Task 3: Contact info panel (NAP, WhatsApp, hours, map) + split layout + full verification

**Files:**
- Modify: `lib/site.ts`, `app/contact/page.tsx`
- Create: `components/contact/ContactInfo.tsx`
- Test: `tests/contact-info.spec.ts`

**Interfaces:**
- Consumes: `SITE` (incl. new `hours`) from `@/lib/site`.
- Produces: `<ContactInfo />` — address, both phones (`tel:` links), email (`mailto:`), WhatsApp link, opening hours, embedded map (`<iframe title="Print Circuit location map">`). Final `/contact` is a two-column split (form + info).

- [ ] **Step 1: Add opening hours to the site constants**

In `lib/site.ts`, add a `hours` array inside the `SITE` object (before the closing `}`), after `socials`:
```ts
  hours: [
    { days: "Monday – Friday", time: "8:00 – 17:00" },
    { days: "Saturday", time: "9:00 – 13:00" },
    { days: "Sunday", time: "Closed" },
  ],
```
Note: these are a sensible default Harare-SME schedule — the founder should confirm/adjust the real hours (content, not code). Centralised here so there's one source.

- [ ] **Step 2: Write the failing test**

Create `tests/contact-info.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("contact page shows NAP, WhatsApp and an embedded map", async ({ page }) => {
  await page.goto("/contact");
  const main = page.locator("main");
  await expect(
    main.getByText("61 Mendel, Avondale, Harare, Zimbabwe"),
  ).toBeVisible();
  await expect(main.getByText("+263 78 872 3331")).toBeVisible();
  await expect(main).not.toContainText("+236");
  await expect(
    main.getByRole("link", { name: /Chat on WhatsApp/i }),
  ).toHaveAttribute("href", "https://wa.me/263788723331");
  await expect(page.getByTitle("Print Circuit location map")).toBeVisible();
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `npx playwright test tests/contact-info.spec.ts` → Expected: FAIL (no contact info / map in `main` yet).

- [ ] **Step 4: Implement ContactInfo**

Create `components/contact/ContactInfo.tsx`:
```tsx
import { SITE } from "@/lib/site";

const MAP_SRC =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(SITE.address) +
  "&output=embed";

export default function ContactInfo() {
  return (
    <aside aria-label="Our contact details" className="space-y-8">
      <div>
        <h2 className="font-display text-xl font-bold text-primary">
          Visit or call us
        </h2>
        <address className="mt-4 space-y-2 not-italic text-muted">
          <p>{SITE.address}</p>
          {SITE.phones.map((phone) => (
            <p key={phone}>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="hover:text-primary"
              >
                {phone}
              </a>
            </p>
          ))}
          <p>
            <a href={`mailto:${SITE.email}`} className="hover:text-primary">
              {SITE.email}
            </a>
          </p>
        </address>
        <a
          href={SITE.whatsapp}
          className="mt-4 inline-block rounded-full border border-cyan/40 px-5 py-2 text-sm text-cyan hover:border-cyan"
        >
          Chat on WhatsApp
        </a>
      </div>

      <div>
        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-muted">
          Opening hours
        </h3>
        <dl className="mt-3 space-y-1 text-sm">
          {SITE.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-6">
              <dt className="text-muted">{h.days}</dt>
              <dd className="text-primary">{h.time}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <iframe
          title="Print Circuit location map"
          src={MAP_SRC}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full"
        />
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Finalise the split-layout page**

Replace the `<div className="mt-12 max-w-2xl">...</div>` block in `app/contact/page.tsx` with a two-column grid, and import `ContactInfo`:
```tsx
import ContactInfo from "@/components/contact/ContactInfo";
```
```tsx
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <QuoteForm />
        <ContactInfo />
      </div>
```

- [ ] **Step 6: Run to verify it passes**

Run: `npx playwright test tests/contact-info.spec.ts` → Expected: PASS.

- [ ] **Step 7: Full Phase 5 verification**

Run: `npm run typecheck` → Expected: clean.
Run: `npm run lint` → Expected: clean.
Run: `npm run build` → Expected: success; `/contact` (static) and `/api/quote` (dynamic route handler) both listed.
Run: `npx playwright test` → Expected: ALL tests pass (Phases 1–5), including the new `quote-api`, `quote-form`, and `contact-info` specs.
Manual: from the navbar/footer/hero "Get a Quote" CTAs, click through to `/contact`; submit the form and confirm the success panel; confirm the footer still shows the correct phones (no `+236`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add contact info panel, opening hours and split contact layout"
```

---

## Self-Review

**Spec coverage (Phase 5 scope — spec §5.5, §8):**
- Split layout, form left / details right → Task 2 + Task 3. ✓
- Multi-step quote form (service → details → contact) → Task 2. ✓
- `/api/quote` route with typed request/response → Task 1. ✓
- EmailJS fallback → Task 2 (env-gated). ✓ (see deviation note)
- WhatsApp click-to-chat → Task 3 (and form success/error). ✓
- Embedded map (61 Mendel, Avondale, Harare) → Task 3 (`<iframe>`, no API key via `output=embed`). ✓
- Opening hours + socials + NAP → Task 3 (`SITE`). ✓
- Phone typo fixed / correct +263 → `SITE.phones` consumed everywhere; test asserts `main` does not contain `+236`. ✓
- Per-page metadata → Task 2. ✓
- Backend-ready (typed data layer + API seam) → Task 1 (`deliverQuote`). ✓

**Deviation / open items flagged for the human:**
- **EmailJS:** included as an env-gated client fallback (spec names it). It is inert until the founder supplies `NEXT_PUBLIC_EMAILJS_*` keys; the primary, reliable path is the server `/api/quote` route. This directly addresses the "unreliable form" problem without committing credentials.
- **Email/DB delivery:** the API route validates and accepts submissions and logs them server-side via the `deliverQuote` seam. **Actual email/DB delivery requires the founder's provider credentials and belongs to the Phase 6 deploy/wiring task** — not buildable honestly now. Submissions are not lost (server logs) but are not yet emailed.
- **Opening hours:** a sensible default in `SITE.hours`, to be confirmed by the founder (content, not code).

**Placeholder scan:** All code steps contain complete code. No TBD/TODO. The map uses a keyless `output=embed` URL (no fabricated API key). EmailJS keys come from env, never hard-coded.

**Type consistency:** `QuoteRequest`/`QuoteResponse` defined in Task 1 (`lib/quote.ts`), consumed by the route (Task 1) and the form (Task 2) unchanged. `validateQuote`'s discriminated-union return is used identically in the route. `SITE.hours` shape (`{ days, time }[]`) defined in Task 3 and consumed by `ContactInfo` in the same task. `SITE.phones`/`.whatsapp`/`.address`/`.email`/`.services` are existing Phase 1 fields.

**Test-fragility notes:** form/info tests scope to the quote `<form>` (by accessible name "Request a quote") and to `main` respectively, because the footer also renders phones and a WhatsApp link; the WhatsApp href is asserted as the literal `https://wa.me/263788723331` (tests don't import `@/lib/site`); the map is found by its unique `<iframe>` title.

## Execution Handoff

Phase 5 plan complete. Phase 6 (SEO/JSON-LD/sitemap/robots, performance pass, content finalisation incl. the logged OG-title + local-SEO-copy + `Reveal` `as`-prop backlog, real email/DB wiring for `/api/quote`, and deploy) gets its own plan once this ships.
