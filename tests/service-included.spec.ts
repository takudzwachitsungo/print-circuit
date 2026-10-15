import { test, expect } from "@playwright/test";

test("service page lists its products and sample work", async ({ page }) => {
  await page.goto("/services/printing");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: "What's included" })).toBeVisible();
  await expect(main.getByRole("article", { name: "Business Cards" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Browse Printing products" })).toHaveAttribute(
    "href",
    "/shop?cat=printing",
  );
  await expect(main.getByText("Sample work")).toBeVisible();
});
