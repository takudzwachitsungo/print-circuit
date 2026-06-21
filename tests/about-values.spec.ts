import { test, expect } from "@playwright/test";

test("about page shows mission, vision and values", async ({ page }) => {
  await page.goto("/about");
  for (const heading of ["Mission", "Vision", "Values"]) {
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
});
