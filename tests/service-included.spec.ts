import { test, expect } from "@playwright/test";

test("service detail shows what's included and a sample gallery", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(page.getByText("What's included")).toBeVisible();
  await expect(page.getByText("Business cards")).toBeVisible();
  await expect(page.getByText("Sample work")).toBeVisible();
});
