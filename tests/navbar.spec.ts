import { test, expect } from "@playwright/test";

test("navbar shows brand and primary links", async ({ page }) => {
  await page.goto("/");
  // Scope to the header/banner so footer links (brand, About, etc.) don't collide.
  const nav = page.getByRole("banner");
  await expect(nav.getByRole("link", { name: "Print Circuit" })).toBeVisible();
  for (const name of ["Services", "Work", "About", "Contact"]) {
    await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  }
});
