import { test, expect } from "@playwright/test";

test("robots allows crawling and points to the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const txt = await res.text();
  expect(txt).toMatch(/Allow: \//);
  expect(txt).toContain("https://www.printcircuit.co.zw/sitemap.xml");
});
