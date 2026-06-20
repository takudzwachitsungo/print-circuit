import { test, expect } from "@playwright/test";

test("featured work shows projects and a view-all link", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /View all work/ }),
  ).toHaveAttribute("href", "/work");
});
