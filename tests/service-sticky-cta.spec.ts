import { test, expect } from "@playwright/test";

test("service detail has a sticky request-a-quote CTA for this service", async ({ page }) => {
  await page.goto("/services/printing");
  const cta = page.getByRole("link", { name: /Request a quote for this/i });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/contact");
});
