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
