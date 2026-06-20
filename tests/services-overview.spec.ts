import { test, expect } from "@playwright/test";

test("services overview lists all services linking to detail pages", async ({ page }) => {
  await page.goto("/services");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    main.getByRole("link", { name: /Graphic Design & Branding/ }),
  ).toHaveAttribute("href", "/services/graphic-design-branding");
  await expect(
    main.getByRole("link", { name: /Web Development/ }),
  ).toHaveAttribute("href", "/services/web-development");
});
