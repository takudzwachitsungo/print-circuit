import { test, expect } from "@playwright/test";

test("home shows most requested products and recent work", async ({ page }) => {
  await page.goto("/");
  const products = page.getByRole("region", { name: "Most requested" });
  await expect(products.getByRole("article")).toHaveCount(8);
  await expect(page.getByRole("link", { name: /See all work/ })).toHaveAttribute("href", "/work");
});
