import { test, expect } from "@playwright/test";

// Regression: GSAP ScrollTrigger pins the home Process timeline, restructuring
// the DOM (pin-spacer). Framer's AnimatePresence mode="wait" deferred the
// unmount, which clashed with React removing those nodes on client navigation
// — throwing "Failed to execute 'removeChild'" and blanking every page after
// the first link tap. We now use an enter-only app/template.tsx instead.
test("client-side navigation away from home renders the target page", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  // Ensure the home page has rendered before tapping (dev compiles on demand;
  // under parallel load a too-early click can miss the link).
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  await page.getByRole("link", { name: "About", exact: true }).first().click();

  await expect(page).toHaveURL(/\/about$/, { timeout: 15000 });
  await expect(
    page.getByRole("heading", { level: 1, name: /modern brands/i }),
  ).toBeVisible();
  expect(errors.join("\n")).not.toContain("removeChild");
});
