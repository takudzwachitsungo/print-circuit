import { test, expect } from "@playwright/test";

test("about team list has valid ul > li markup", async ({ page }) => {
  await page.goto("/about");
  const items = page.locator("section ul > li", {
    has: page.getByRole("heading", { level: 3 }),
  });
  await expect(items.first()).toBeVisible();
});

test("service included list has valid ul > li markup", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(page.locator("ul > li").first()).toBeVisible();
});
