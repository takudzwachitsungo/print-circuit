import { test, expect } from "@playwright/test";

test("header shows brand, search and quote basket", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header.getByRole("link", { name: /print circuit/i })).toBeVisible();
  await expect(header.getByRole("searchbox", { name: "Search products" })).toBeVisible();
  await expect(header.getByRole("button", { name: "Quote basket, 0 items" })).toBeVisible();
});

test("primary nav links and categories menu", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const name of ["Home", "Shop", "Services", "Our work", "About", "Contact"]) {
    await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  }
  await nav.getByRole("button", { name: /Categories/ }).hover();
  await expect(nav.getByRole("link", { name: "Printing", exact: true })).toHaveAttribute(
    "href",
    "/shop?cat=printing",
  );
  await expect(nav.getByRole("link", { name: /Call/ })).toHaveAttribute("href", "tel:+263788723331");
});
