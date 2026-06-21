import { test, expect } from "@playwright/test";

test("sitemap lists all routes as absolute URLs", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const path of [
    "",
    "/services",
    "/services/printing",
    "/work",
    "/work/uz-event-flyer",
    "/about",
    "/contact",
  ]) {
    expect(xml).toContain(`https://www.printcircuit.co.zw${path}</loc>`);
  }
});
