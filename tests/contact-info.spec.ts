import { test, expect } from "@playwright/test";

test("contact page shows NAP, WhatsApp and an embedded map", async ({ page }) => {
  await page.goto("/contact");
  const main = page.locator("main");
  await expect(
    main.getByText("61 Mendel, Avondale, Harare, Zimbabwe"),
  ).toBeVisible();
  await expect(main.getByText("+263 78 872 3331")).toBeVisible();
  await expect(main).not.toContainText("+236");
  await expect(
    main.getByRole("link", { name: /Chat on WhatsApp/i }),
  ).toHaveAttribute("href", "https://wa.me/263788723331");
  await expect(page.getByTitle("Print Circuit location map")).toBeVisible();
});

test("contact page lists the domain sales and careers emails", async ({ page }) => {
  await page.goto("/contact");
  const main = page.locator("main");
  await expect(main.getByRole("link", { name: "sales@printcircuit.co.zw" })).toHaveAttribute(
    "href",
    "mailto:sales@printcircuit.co.zw",
  );
  await expect(main.getByRole("link", { name: "careers@printcircuit.co.zw" })).toHaveAttribute(
    "href",
    "mailto:careers@printcircuit.co.zw",
  );
  await expect(main).not.toContainText("gmail.com");
});
