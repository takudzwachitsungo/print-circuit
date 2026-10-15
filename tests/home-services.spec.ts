import { test, expect } from "@playwright/test";

test("shop-by-category cards link to filtered shop", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Shop by category" });
  await expect(section.getByRole("link", { name: /Graphic Design & Branding/ })).toHaveAttribute(
    "href",
    "/shop?cat=graphic-design-branding",
  );
  await expect(section.getByRole("link", { name: /Web Development/ })).toHaveAttribute(
    "href",
    "/shop?cat=web-development",
  );
});
