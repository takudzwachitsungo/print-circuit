import { test, expect } from "@playwright/test";

test("about page shows the team", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Takudzwa Chitsungo")).toBeVisible();
  await expect(page.getByText("Founder & Lead Designer")).toBeVisible();
});
