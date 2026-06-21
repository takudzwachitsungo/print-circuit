import { test, expect } from "@playwright/test";

test("home references an OG image that serves as PNG", async ({ page, request }) => {
  await page.goto("/");
  const ogHref = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogHref).toBeTruthy();
  const res = await request.get(ogHref!);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});

test("manifest is served with the brand name and theme colour", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.status()).toBe(200);
  const manifest = await res.json();
  expect(manifest.name).toContain("Print Circuit");
  expect(manifest.theme_color).toBe("#0A0A0C");
});
