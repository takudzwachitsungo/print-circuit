import { test, expect } from "@playwright/test";

test("marquee shows print items as labelled images", async ({ page }) => {
  await page.goto("/");
  // Label still rendered as text (SEO + clarity).
  await expect(page.getByText("Large Format Printing").first()).toBeVisible();
  // Each item now has an image with descriptive alt text.
  await expect(
    page.getByRole("img", { name: /business cards/i }).first(),
  ).toBeVisible();
});
