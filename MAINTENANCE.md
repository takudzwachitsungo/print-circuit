# Print Circuit Website — Maintenance Guide

A plain-English handbook for keeping the Print Circuit website up to date —
written for someone who is **new to programming**. You do **not** need to be a
developer to change images, swap photos, or update text. This guide shows you
exactly where things live and the safest way to change them.

> **Golden rule:** You mostly **edit text inside quotes** and **drop image
> files into folders**. You almost never need to write real code. When in
> doubt, change one small thing, preview it, and if it looks wrong, undo it.

---

## 1. What this website is (in plain words)

- It's a **Next.js** website (Next.js is a popular toolkit built on React, the
  technology behind most modern sites). The pages are written in **TypeScript**
  (JavaScript with safety checks) and styled with **Tailwind CSS** (styling done
  with short class names).
- The code lives on **GitHub**: <https://github.com/takudzwachitsungo/print-circuit>
- The live site is hosted on **Vercel**. **When code is pushed to GitHub,
  Vercel automatically rebuilds and publishes the site** (usually within a
  minute or two). You don't "upload the site" manually.

So the flow is always:

```
edit a file / add an image  →  save  →  push to GitHub  →  Vercel publishes it
```

---

## 2. Two ways to make changes

### Option A — The easy way: GitHub website (no installs, no terminal)
Best for **swapping or uploading images** and **small text edits**. You do
everything in your web browser on github.com. Vercel publishes automatically.
**Start here if you're nervous.** (See Section 5 and 6.)

### Option B — The full way: on your computer (a code editor + terminal)
Needed for bigger changes or to **preview locally** before publishing. Requires
a one-time setup (Section 3).

---

## 3. One-time setup (only for Option B)

You only do this once on your computer.

1. **Install Node.js** (version 20 or newer) from <https://nodejs.org> (pick the
   "LTS" version). This lets you run the site on your machine.
2. **Install a code editor** — [VS Code](https://code.visualstudio.com) is free
   and friendly.
3. **Install Git** from <https://git-scm.com> (lets you download and publish code).
4. **Get the code** — open a terminal (in VS Code: `Terminal → New Terminal`) and run:
   ```bash
   git clone https://github.com/takudzwachitsungo/print-circuit.git
   cd print-circuit
   npm install
   ```
   `npm install` downloads the building blocks the site needs (takes a minute).
5. **Preview the site locally:**
   ```bash
   npm run dev
   ```
   Then open **http://localhost:3000** in your browser. Edits you make show up
   live. Press `Ctrl + C` in the terminal to stop it.

> "Local" = running on your own computer only. Nobody else sees it until you
> push to GitHub.

---

## 4. How the project is organized (where to find what)

You'll spend 95% of your time in just two places: **`lib/`** (text/data) and
**`public/`** (images). Here's the map:

```
print-circuit/
├── app/            ← the pages themselves (home, about, work, services, contact)
├── components/     ← reusable pieces of the pages (cards, navbar, footer, etc.)
├── lib/            ← ★ TEXT & DATA you edit most often (see below)
├── public/         ← ★ IMAGES and the logo (see below)
├── MAINTENANCE.md  ← this guide
└── DEPLOY.md       ← hosting / email setup notes
```

### `lib/` — the text & data files (edit these for content)

| File | What it controls |
| --- | --- |
| `lib/site.ts` | Company name, **address, phone numbers, email, WhatsApp link, opening hours**, the list of services, and the website address. |
| `lib/services.ts` | The content of each **service page** (titles, descriptions, "what's included", FAQs). |
| `lib/projects.ts` | The **portfolio / "Our work" projects** (title, client, year, category, summary). |
| `lib/team.ts` | The **team members** on the About page (name, role, bio, photo file). |
| `lib/showcase.ts` | The **scrolling image strip** under the homepage hero ("what we print"). |
| `lib/stats.ts` | The big numbers on the site (e.g. projects completed, clients served). |

### `public/` — the images

| Folder / file | What it's for |
| --- | --- |
| `public/work/<project>/` | Photos for each **portfolio project**. The first image (alphabetically) is the **cover**; all images show in that project's gallery. |
| `public/team/` | **Team headshots** (e.g. `tinotenda.jpg`, `audrey.jpg`). |
| `public/showcase/` | Images for the **homepage scrolling strip**. |
| `public/logo.png` | The **logo** in the top bar and footer. |

> **What's a "slug"?** A slug is the short name in the web address, e.g.
> `value-store-branding` in `printcircuit.../work/value-store-branding`. Each
> project's image folder under `public/work/` **must be named exactly like its
> slug**. You can see the slugs in `lib/projects.ts`.

The other folders (`app/`, `components/`) are the actual code. **Avoid editing
those** unless a developer guides you.

---

## 5. Changing or adding PRODUCT / WORK images (most common task)

Each project's images live in `public/work/<slug>/`. The **first image by name**
(e.g. `01.jpg`) is the cover shown on the cards; every image in the folder shows
in that project's gallery page.

**Image tips:** use **landscape JPGs about 1280px wide**, keep each file **under
~300 KB**, and use real photos of the actual job (these are real client work).

### The easy way (GitHub website)
1. Go to <https://github.com/takudzwachitsungo/print-circuit>
2. Click the `public` folder → `work` → the project folder (e.g. `value-store-branding`).
3. To **replace** the cover: click the existing `01.jpg`, then the **trash icon**
   to delete it (it asks you to "Commit changes" — click the green button). Then
   use **Add file → Upload files** to upload your new image **named `01.jpg`**.
4. To **add more gallery photos**: **Add file → Upload files**, drag your images
   in (name them `02.jpg`, `03.jpg`, …), then **Commit changes**.
5. Done — Vercel republishes automatically in ~1–2 minutes.

### The full way (on your computer)
1. Put/replace image files in `public/work/<slug>/` (e.g. `01.jpg`, `02.jpg`).
2. Save, then publish (Section 9).

> To change which image is the **cover**, just make sure the one you want is
> first alphabetically (name it `01.jpg`).

---

## 6. Changing TEAM photos (or adding a member)

Photos live in `public/team/`. The team list is in `lib/team.ts`. Each member
has a `photo` line that is **just the filename** of their picture.

### Replace an existing person's photo
- Easiest: on GitHub, go to `public/team/`, delete the old file and upload a new
  one **with the same name** (e.g. `percival.jpg`). Square photos look best.

### Add a photo for someone who doesn't have one (e.g. Audrey)
1. Upload the photo to `public/team/` named clearly, e.g. `audrey.jpg`.
2. Open `lib/team.ts` and find that person. Add or edit their `photo` line so it
   matches the filename:
   ```ts
   {
     name: "Audrey Sithole",
     role: "Social Media Manager",
     bio: "Runs our social channels ...",
     photo: "audrey.jpg",          // ← the file you uploaded to public/team/
   },
   ```
   If the photo file isn't there yet, the site safely shows a colored circle
   instead — no broken image.

### Add a whole new team member
Copy an existing block in `lib/team.ts` and change the values. Keep the commas
and the `{ }` brackets exactly as they are:
```ts
{
  name: "New Person",
  role: "Their Role",
  bio: "One honest sentence about what they do.",
  photo: "new-person.jpg",   // upload public/team/new-person.jpg too (optional)
},
```

---

## 7. Changing the homepage scrolling strip (the "what we print" images)

Images are in `public/showcase/`; the list is in `lib/showcase.ts`. Each item:
```ts
{ label: "Business Cards", src: "/showcase/business-cards.jpg", alt: "Printed business cards" },
```
- **Swap an image:** replace the file in `public/showcase/` with the same name.
- **Change a label:** edit the text inside the `label` quotes.

---

## 8. Changing the LOGO, contact details, hours, or text

- **Logo:** replace `public/logo.png` with your new logo (a square PNG works
  best; keep the same filename).
- **Address, phone, email, WhatsApp, opening hours, services list:** open
  `lib/site.ts` and edit the text inside the quotes. For example:
  ```ts
  address: "61 Mendel, Avondale, Harare, Zimbabwe",
  email: "info@printcircuit.co.zw",
  ```
  **Only change the words inside the quotes.** Don't remove quotes, commas, or
  brackets.
- **Service page wording / FAQs:** `lib/services.ts`.
- **Project details (title, client, year):** `lib/projects.ts`.

> **Safety:** after editing a `lib/*.ts` file, the punctuation must stay intact —
> every `"text"` needs its quotes, every item ends with a comma. If the site
> breaks, you probably removed a quote, comma, or bracket. Undo and try again
> (Section 11).

---

## 9. Saving & publishing your changes (pushing)

**If you used the GitHub website (Option A):** you're already done — clicking
"Commit changes" published it. Skip the rest.

**If you edited on your computer (Option B):** publish with three commands in the
terminal (inside the `print-circuit` folder):
```bash
git add -A
git commit -m "Short note of what you changed, e.g. updated Value Store cover photo"
git push
```
- `git add -A` = gather all your changes.
- `git commit -m "..."` = save them with a note.
- `git push` = send them to GitHub → Vercel republishes automatically.

> The very first push may ask you to sign in to GitHub — follow the prompt.

**To get the latest version before you start editing** (in case changes were
made elsewhere):
```bash
git pull
```

---

## 10. Connecting email (SMTP) so the quote form sends emails

Right now the contact/quote form **works**, but until email is configured it
only **logs** submissions on the server instead of emailing them. To make it
email you, set up SMTP (your email provider's outgoing-mail settings) **in
Vercel** — no code change needed.

### What you need (from your email host, e.g. your `@printcircuit.co.zw` mailbox)
- **SMTP host** (e.g. `mail.printcircuit.co.zw` or your provider's server)
- **SMTP port** (usually `587`, or `465` for SSL)
- **Username** (usually the full email address)
- **Password** (the mailbox password or an app password)

### Steps
1. Go to <https://vercel.com> → your **print-circuit** project → **Settings →
   Environment Variables**.
2. Add these one by one (Name on the left, your value on the right):

   | Name | Example value | Meaning |
   | --- | --- | --- |
   | `SMTP_HOST` | `mail.printcircuit.co.zw` | your outgoing mail server |
   | `SMTP_PORT` | `587` | port (587, or 465 for SSL) |
   | `SMTP_USER` | `info@printcircuit.co.zw` | login username |
   | `SMTP_PASS` | `your-mailbox-password` | login password |
   | `QUOTE_TO` | `info@printcircuit.co.zw` | where quote requests are emailed |
   | `QUOTE_FROM` | `info@printcircuit.co.zw` | the "from" address (optional) |

3. Click **Save**, then **redeploy** (Vercel → Deployments → ⋯ → Redeploy) so the
   new settings take effect.
4. **Test it:** open the live site, submit a quote on the Contact page, and check
   that the email arrives at `QUOTE_TO`.

> **Never put these passwords in the code or in GitHub** — only in Vercel's
> Environment Variables. The file `.env.example` in the project just lists the
> names (no real passwords) for reference. Full notes are in `DEPLOY.md`.

---

## 11. Previewing, and undoing mistakes

- **Preview before publishing (Option B):** run `npm run dev` and open
  http://localhost:3000. If the page shows a red error or looks broken, you have
  a typo — fix it before pushing.
- **Undo unsaved edits to a file:** in VS Code press `Ctrl + Z` repeatedly, or
  right-click the file in the left sidebar → it shows changes you can revert.
- **Undo everything since your last publish (Option B):**
  ```bash
  git restore .
  ```
  (This throws away local changes you haven't committed — use carefully.)
- **On the GitHub website**, every change is saved as a "commit" you can view
  under the **Commits** tab; a developer can revert a bad one if needed.

---

## 12. Do / Don't (quick safety list)

**Do**
- Change text **inside quotes** in `lib/*.ts`.
- Replace images in `public/...` keeping sensible names.
- Make one change at a time and preview/check it.
- Write a short note in your commit ("changed banner photo").

**Don't**
- Edit files in `app/` or `components/` without a developer's help.
- Delete quotes, commas, brackets `{ } [ ]`, or semicolons in `.ts` files.
- Put passwords/keys in the code or GitHub (use Vercel env vars).
- Touch `node_modules/`, `.next/`, `package-lock.json` (auto-managed).

---

## 13. Glossary

- **Repo / repository** — the project's code on GitHub.
- **Commit** — one saved batch of changes (with a note).
- **Push** — send your commits to GitHub (which triggers publishing).
- **Pull** — fetch the latest version from GitHub to your computer.
- **Deploy / build** — Vercel turning the code into the live website.
- **Slug** — the short name in a web address (and the matching image folder name).
- **SMTP** — the settings that let the site send email.
- **Local / localhost** — the site running only on your own computer for preview.

---

## 14. When you're stuck

1. Don't panic — nothing you do on a branch/preview affects the live site until
   it's published, and bad changes can be reverted.
2. Re-read the relevant section above and check your punctuation.
3. If the live site ever looks broken after a change, tell a developer the
   approximate time and what you changed — the previous working version can be
   restored from GitHub's history.
4. Keep this file (`MAINTENANCE.md`) handy — it lives in the project and on
   GitHub.
