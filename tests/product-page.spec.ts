import { test, expect } from "@playwright/test";

test("product page renders with its own metadata", async ({ page }) => {
  await page.goto("/shop/business-cards");
  await expect(page.getByRole("heading", { level: 1, name: "Business Cards" })).toBeVisible();
  await expect(page).toHaveTitle(/Business Cards \| Print Circuit/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.printcircuit.co.zw/shop/business-cards",
  );
  await expect(page.getByRole("heading", { name: "You might also need" })).toBeVisible();
});

test("unknown product returns 404", async ({ page }) => {
  const res = await page.goto("/shop/not-a-real-product");
  expect(res?.status()).toBe(404);
});

test("adds the configured item to the quote", async ({ page }) => {
  await page.goto("/shop/business-cards");
  const form = page.getByRole("form", { name: "Configure Business Cards" });
  await form.locator("label", { hasText: "Gloss" }).click();
  await form.getByLabel("Quantity", { exact: true }).fill("250");
  await form.getByLabel("Notes").fill("Logo on the back");
  await form.getByRole("button", { name: "Add to quote", exact: true }).click();
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();

  await form.getByRole("button", { name: "View quote" }).click();
  const drawer = page.getByRole("dialog", { name: "Your quote" });
  await expect(drawer.getByText("Gloss")).toBeVisible();
  await expect(drawer.getByLabel("Business Cards quantity", { exact: true })).toHaveValue("250");
  await expect(drawer.getByLabel("Business Cards note")).toHaveValue("Logo on the back");
});
