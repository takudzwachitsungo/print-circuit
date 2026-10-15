import { test, expect } from "@playwright/test";

test("about shows static stats and the order band", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByText("Service lines")).toBeVisible();
  const band = page.getByRole("region", { name: "Place an order" });
  await expect(band.getByRole("link", { name: "Start a quote" })).toHaveAttribute("href", "/shop");
});
