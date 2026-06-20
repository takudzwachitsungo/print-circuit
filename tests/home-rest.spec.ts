import { test, expect } from "@playwright/test";

test("home shows process steps and closing CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Enquire")).toBeVisible();
  await expect(page.getByText("Deliver")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Let's print something great/i }),
  ).toHaveAttribute("href", "/contact");
});
