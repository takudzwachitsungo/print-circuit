import { test, expect } from "@playwright/test";

test("magnetic CTA renders as a link with its label and href", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Get a Quote" }).first();
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/contact");
});
