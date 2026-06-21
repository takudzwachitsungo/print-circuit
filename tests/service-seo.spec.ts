import { test, expect } from "@playwright/test";

test("service H1 surfaces the local-SEO phrase", async ({ page }) => {
  await page.goto("/services/printing");
  await expect(
    page.getByRole("heading", { level: 1, name: "Printing Services in Harare" }),
  ).toBeVisible();
});
