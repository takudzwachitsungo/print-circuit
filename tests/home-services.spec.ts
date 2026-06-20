import { test, expect } from "@playwright/test";

test("services grid shows all five services linking to detail pages", async ({
  page,
}) => {
  await page.goto("/");
  // Scope to the services region so footer service links don't collide.
  const services = page.getByRole("region", { name: "Our services" });
  await expect(
    services.getByRole("link", { name: /Graphic Design & Branding/ }),
  ).toHaveAttribute("href", "/services/graphic-design-branding");
  await expect(
    services.getByRole("link", { name: /Web Development/ }),
  ).toHaveAttribute("href", "/services/web-development");
});
