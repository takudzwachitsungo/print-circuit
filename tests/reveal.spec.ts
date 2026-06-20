import { test, expect } from "@playwright/test";

test("revealed content is present and visible in the DOM", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("reveal-probe")).toBeVisible();
});
