import { test, expect } from "@playwright/test";

test("about page shows stats and a closing CTA", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Service lines")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Let's print something great/i }),
  ).toHaveAttribute("href", "/contact");
});
