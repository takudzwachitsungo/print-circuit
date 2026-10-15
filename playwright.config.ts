import { defineConfig } from "@playwright/test";

// Own port so tests never reuse a developer's `npm run dev` (which has the real
// SMTP credentials from .env.local loaded).
const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // One worker: when two tests make the dev server compile the same route at
  // once, Next dev can serve a 500 ("Unexpected end of JSON input").
  workers: 1,
  // The dev server compiles routes on demand; client navigations under
  // parallel load can take longer than the 5s default.
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  webServer: {
    // Start from a clean dev cache: a dev server killed mid-write (as at the
    // end of every test run) can leave .next/dev stale, serving 404s/500s.
    command: `node -e "require('fs').rmSync('.next/dev',{recursive:true,force:true})" && npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    // Blank SMTP so /api/quote logs submissions instead of emailing them.
    // Next's env loader won't override a variable that's already set.
    env: { SMTP_HOST: "", SMTP_USER: "", SMTP_PASS: "", QUOTE_TO: "" },
  },
});
