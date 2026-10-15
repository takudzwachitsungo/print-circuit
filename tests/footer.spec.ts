import { test, expect } from "@playwright/test";

test("footer shows correct address and phone numbers", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("61 Mendel, Avondale, Harare, Zimbabwe");
  await expect(footer).toContainText("+263 78 872 3331");
  await expect(footer).not.toContainText("+236");
});

test("footer links into the shop and categories", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  for (const heading of ["Shop", "Categories", "Company", "Get in touch"]) {
    await expect(footer.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(footer.getByRole("link", { name: "Business Cards" })).toHaveAttribute(
    "href",
    "/shop/business-cards",
  );
  await expect(footer.getByRole("link", { name: "Signage", exact: true })).toHaveAttribute(
    "href",
    "/shop?cat=signage-advertising",
  );
  await expect(footer).toContainText("Printcircuit Enterprises (Private) Limited");
});
