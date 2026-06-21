import { test, expect } from "@playwright/test";

test("case study shows a gallery and links back to work and to contact", async ({ page }) => {
  await page.goto("/work/value-store-branding");
  await expect(page.getByRole("heading", { name: /Gallery/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Start a project/i }).first(),
  ).toHaveAttribute("href", "/contact");
  await expect(
    page.getByRole("link", { name: /All work/i }),
  ).toHaveAttribute("href", "/work");
});
