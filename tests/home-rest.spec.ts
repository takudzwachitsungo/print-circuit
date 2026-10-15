import { test, expect } from "@playwright/test";

test("how-it-works steps and the order band", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Choose products", { exact: true })).toBeVisible();
  await expect(page.getByText("Collect or delivery", { exact: true })).toBeVisible();
  const band = page.getByRole("region", { name: "Place an order" });
  await expect(band.getByRole("heading", { name: "Ready to place an order?" })).toBeVisible();
  await expect(band.getByRole("link", { name: "Start a quote" })).toHaveAttribute("href", "/shop");
});
