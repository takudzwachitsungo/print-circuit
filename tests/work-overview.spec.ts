import { test, expect } from "@playwright/test";

test("work overview lists projects linking to case studies", async ({ page }) => {
  await page.goto("/work");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    main.getByRole("link", { name: /The Value Store Branding/ }),
  ).toHaveAttribute("href", "/work/value-store-branding");
});

test("work gallery filters projects by category", async ({ page }) => {
  await page.goto("/work");
  const main = page.locator("main");
  await expect(main.getByRole("link", { name: /UZ Event Flyer/ })).toBeVisible();
  await main.getByRole("button", { name: "Web", exact: true }).click();
  await expect(main.getByRole("link", { name: /Portfolio Website/ })).toBeVisible();
  await expect(main.getByRole("link", { name: /UZ Event Flyer/ })).not.toBeVisible();
});
