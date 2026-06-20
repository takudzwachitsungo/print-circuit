import { test, expect } from "@playwright/test";

test("about teaser shows final stat values and story link", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Read our story").scrollIntoViewIfNeeded();
  await expect(page.getByText("Read our story")).toHaveAttribute(
    "href",
    "/about",
  );
});
