# Deploying Print Circuit

## Build & run

Node 20+. Production build:

```bash
npm ci
npm run build
npm run start   # serves the production build
```

## Deploy to Vercel (recommended)

This is a standard Next.js app — Vercel auto-detects the framework, build
command (`next build`) and output. No `vercel.json` is needed. Connect the
GitHub repo once and every push to `master` deploys automatically (PRs get
preview URLs).

1. Go to <https://vercel.com/new> and sign in (use the **GitHub** account that
   owns the repo).
2. **Import** `takudzwachitsungo/print-circuit`. If prompted, install the
   Vercel GitHub App and grant access to this repo.
3. Framework preset: **Next.js** (auto-detected). Leave build & output settings
   at their defaults.
4. **Environment Variables** (all optional — the app builds and runs without
   them; see the table below). Add the SMTP ones when you want the quote form
   to email instead of log. Do **not** paste real secrets into the repo.
5. Click **Deploy**. First build is the canonical one; subsequent pushes to
   `master` redeploy.

### Custom domain
- In the Vercel project → **Settings → Domains**, add `www.printcircuit.co.zw`
  (and `printcircuit.co.zw` redirecting to `www`).
- Update DNS at your registrar as Vercel instructs (usually a `CNAME` for `www`
  → `cname.vercel-dns.com`, and the apex per Vercel's guidance).
- `SITE.url` is already `https://www.printcircuit.co.zw`, so canonical tags,
  sitemap, robots and JSON-LD are correct once the domain is live. Until then
  the site is reachable at the generated `*.vercel.app` URL (canonical/OG still
  point at the real domain — expected).

### CLI alternative
`npm i -g vercel` → `vercel login` → `vercel link` → `vercel --prod`. The
dashboard Git integration above is preferred because it gives push-to-deploy
and preview builds.

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
