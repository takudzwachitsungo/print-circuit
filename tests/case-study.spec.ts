import { test, expect } from "@playwright/test";

test("case study renders title, summary and service tags", async ({ page }) => {
  await page.goto("/work/value-store-branding");
  await expect(
    page.getByRole("heading", { level: 1, name: /The Value Store Branding/ }),
  ).toBeVisible();
  await expect(page.getByText("Logo Design")).toBeVisible();
});

test("unknown project returns a 404", async ({ page }) => {
  const res = await page.goto("/work/not-a-real-project");
  expect(res?.status()).toBe(404);
});
