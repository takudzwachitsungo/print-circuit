import { test, expect } from "@playwright/test";

test("marquee lists service keywords", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Large Format Printing").first()).toBeVisible();
});
