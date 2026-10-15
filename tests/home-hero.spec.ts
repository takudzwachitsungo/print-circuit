import { test, expect } from "@playwright/test";

test("bento hero shows headline, CTAs and featured products", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("look established");
  await expect(page.getByRole("link", { name: "Browse products" })).toHaveAttribute("href", "/shop");
  const hero = page.getByRole("region", { name: "Introduction" });
  await expect(hero.getByRole("link", { name: "Get a quote", exact: true })).toHaveAttribute("href", "/contact");
  await expect(hero.getByRole("article", { name: "Business Cards" })).toBeVisible();
  await expect(hero.getByRole("article", { name: "Vinyl Banners" })).toBeVisible();
});
