import { test, expect } from "@playwright/test";
import { PRODUCTS, productsByCategory, searchProducts } from "../lib/products";

test("shop lists every product", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { level: 1, name: "Shop all" })).toBeVisible();
  await expect(page.locator("main").getByRole("article")).toHaveCount(PRODUCTS.length);
});

test("category chips filter the grid", async ({ page }) => {
  await page.goto("/shop?cat=signage-advertising");
  await expect(page.getByRole("heading", { level: 1, name: "Signage" })).toBeVisible();
  await expect(page.locator("main").getByRole("article")).toHaveCount(
    productsByCategory("signage-advertising").length,
  );
  // Scoped: the footer also has a "Signage" link.
  await expect(
    page.getByRole("navigation", { name: "Categories" }).getByRole("link", { name: "Signage", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("search narrows results", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("searchbox", { name: "Search the catalogue" }).fill("business cards");
  await page.getByRole("searchbox", { name: "Search the catalogue" }).press("Enter");
  await expect(page).toHaveURL(/\/shop\?q=business\+cards/);
  await expect(page.getByRole("article", { name: "Business Cards" })).toBeVisible();
  await expect(page.locator("main").getByRole("article")).toHaveCount(
    searchProducts("business cards").length,
  );
});

test("no results shows a custom-quote way out", async ({ page }) => {
  await page.goto("/shop?q=zzzz");
  await expect(page.getByText(/Can.t find it\?/)).toBeVisible();
  await expect(page.getByRole("link", { name: /custom quote/i })).toHaveAttribute("href", "/contact");
});

test("odd query strings don't break the page", async ({ page }) => {
  for (const url of ["/shop?cat=nonsense", "/shop?q=%20%20%20", "/shop?q=%3Cscript%3E"]) {
    const res = await page.goto(url);
    expect(res?.status(), url).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.goto("/shop?cat=nonsense");
  await expect(page.locator("main").getByRole("article")).toHaveCount(PRODUCTS.length);
  await page.goto("/shop?cat=printing&cat=web-development");
  await expect(page.getByRole("heading", { level: 1, name: "Printing" })).toBeVisible();
});

test("add to quote persists across reloads", async ({ page }) => {
  await page.goto("/shop");
  const card = page.getByRole("article", { name: "Business Cards" });
  await card.getByRole("button", { name: "+ Add to quote" }).click();
  await expect(card.getByRole("button", { name: "✓ In your quote" })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("article", { name: "Business Cards" }).getByRole("button", { name: "✓ In your quote" }),
  ).toBeVisible();
});

test("basket still works when storage is blocked", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("storage blocked");
      },
    });
  });
  await page.goto("/shop");
  const card = page.getByRole("article", { name: "Vinyl Banners" });
  await card.getByRole("button", { name: "+ Add to quote" }).click();
  await expect(card.getByRole("button", { name: "✓ In your quote" })).toBeVisible();
});
