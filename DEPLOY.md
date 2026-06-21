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
