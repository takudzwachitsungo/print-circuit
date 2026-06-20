import { test, expect } from "@playwright/test";

test("hero shows headline and both CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "See our work" }),
  ).toHaveAttribute("href", "/work");
});
