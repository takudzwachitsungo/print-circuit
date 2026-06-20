import { test, expect } from "@playwright/test";

test("navbar shows brand and primary links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Print Circuit" })).toBeVisible();
  for (const name of ["Services", "Work", "About", "Contact"]) {
    await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  }
});
