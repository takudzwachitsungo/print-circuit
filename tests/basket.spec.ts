import { test, expect } from "@playwright/test";

test("badge counts lines; drawer edits quantity and removes", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("article", { name: "Business Cards" }).getByRole("button", { name: "+ Add to quote" }).click();
  await expect(page.getByRole("status")).toContainText("Business Cards added to your quote");
  await page.getByRole("article", { name: "Vinyl Banners" }).getByRole("button", { name: "+ Add to quote" }).click();
  await page.getByRole("button", { name: "Quote basket, 2 items" }).click();

  const drawer = page.getByRole("dialog", { name: "Your quote" });
  await expect(drawer).toBeVisible();
  await drawer.getByRole("button", { name: "Increase Business Cards quantity" }).click();
  await expect(drawer.getByLabel("Business Cards quantity", { exact: true })).toHaveValue("2");
  await drawer.getByLabel("Business Cards quantity", { exact: true }).fill("500");
  await expect(drawer.getByLabel("Business Cards quantity", { exact: true })).toHaveValue("500");
  await drawer.getByLabel("Business Cards quantity", { exact: true }).fill("9999999");
  await expect(drawer.getByLabel("Business Cards quantity", { exact: true })).toHaveValue("100000");
  await drawer.getByRole("button", { name: "Remove Vinyl Banners" }).click();
  await expect(drawer.getByText("Vinyl Banners")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  // (header is inert while the modal is open, so check the badge after closing)
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
});

test("WhatsApp link carries the basket", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("article", { name: "Business Cards" }).getByRole("button", { name: "+ Add to quote" }).click();
  await page.getByRole("button", { name: "Quote basket, 1 item" }).click();
  const href = await page
    .getByRole("dialog", { name: "Your quote" })
    .getByRole("link", { name: "Send on WhatsApp" })
    .getAttribute("href");
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe("https://wa.me/263788723331");
  expect(url.searchParams.get("text")).toContain("• Business Cards × 1");
});

test("corrupt saved basket is ignored", async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("pc-quote-basket", "{not json");
      sessionStorage.setItem("seeded", "1");
    }
  });
  await page.goto("/shop");
  await expect(page.getByRole("button", { name: "Quote basket, 0 items" })).toBeVisible();
  await page.getByRole("article", { name: "Envelopes" }).getByRole("button", { name: "+ Add to quote" }).click();
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
});

test("header search goes to shop results", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("banner").getByRole("searchbox", { name: "Search products" });
  await search.fill("banner");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/shop\?q=banner/);
  await expect(page.getByRole("article", { name: "Vinyl Banners" })).toBeVisible();
});
