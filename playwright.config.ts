import { defineConfig } from "@playwright/test";

// Own port so tests never reuse a developer's `npm run dev` (which has the real
// SMTP credentials from .env.local loaded).
const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // The dev server compiles routes on demand; client navigations under
  // parallel load can take longer than the 5s default.
  expect: { timeout: 10_000 },
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
