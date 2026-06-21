import { test, expect } from "@playwright/test";

test("about page shows the hero and founding story", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("20 May 2026")).toBeVisible();
});
