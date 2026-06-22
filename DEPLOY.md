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

### Custom domain — `printcircuit.co.zw` (DNS managed by Cloudflare)

The domain is registered via Webzim but its **DNS is on Cloudflare**
(nameservers `ligia.ns.cloudflare.com` / `mike.ns.cloudflare.com`), and the old
site's records are currently **proxied** (Cloudflare IPs `104.21.x` / `172.67.x`).
We make **`www` the primary** (matches `SITE.url`) and redirect the apex to it.

1. **Vercel** → project → **Settings → Domains** → add both
   `www.printcircuit.co.zw` and `printcircuit.co.zw`. Set **`www` as primary**
   (Vercel then auto-redirects the apex → `www`). Vercel shows the exact records
   to create — prefer those values if they differ from below.
2. **Cloudflare** → your domain → **DNS → Records**. Remove the old `@` and `www`
   A/AAAA records, then add:

   | Type | Name | Value | Proxy status |
   | --- | --- | --- | --- |
   | `A` | `@` | `76.76.21.21` | **DNS only (grey cloud)** |
   | `CNAME` | `www` | `cname.vercel-dns.com` | **DNS only (grey cloud)** |

3. Wait for Vercel to verify and auto-issue the SSL certificate (a few minutes,
   up to ~1 hour for DNS propagation). Then test **https://www.printcircuit.co.zw**
   and that `printcircuit.co.zw` redirects to it.

> **Cloudflare gotchas**
> - Set the records to **DNS only (grey cloud)**, *not* Proxied (orange).
>   Double-proxying (Cloudflare in front of Vercel) commonly causes redirect
>   loops or SSL errors. Grey cloud lets Vercel handle SSL + CDN directly (its
>   recommended setup). If you must keep the orange cloud, set Cloudflare
>   **SSL/TLS → Overview → Full (strict)** and disable any conflicting page
>   rules first.
> - Make sure **Settings → Deployment Protection** on the Vercel project is
>   **off for Production**, or the public can't reach the site (that's what
>   caused the earlier `401` on the preview URL).

`SITE.url` is already `https://www.printcircuit.co.zw`, so canonical tags,
sitemap, robots and JSON-LD are correct the moment the domain goes live. Until
then the site is reachable at the generated `*.vercel.app` URL.

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
