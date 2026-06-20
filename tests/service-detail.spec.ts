import { test, expect } from "@playwright/test";

test("service detail renders an accent hero and quote CTA", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(
    page.getByRole("heading", { level: 1, name: /Printing Services/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Request a quote/i }).first(),
  ).toHaveAttribute("href", "/contact");
});

test("unknown service returns a 404", async ({ page }) => {
  const res = await page.goto("/services/not-a-real-service");
  expect(res?.status()).toBe(404);
});
