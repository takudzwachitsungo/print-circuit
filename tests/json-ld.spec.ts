import { test, expect } from "@playwright/test";

test("home page emits a valid LocalBusiness JSON-LD with NAP", async ({ page }) => {
  await page.goto("/");
  const json = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  expect(json).toBeTruthy();
  const data = JSON.parse(json!);
  expect(data["@type"]).toBe("LocalBusiness");
  expect(data.name).toBe("Print Circuit");
  expect(data.url).toBe("https://www.printcircuit.co.zw");
  expect(data.telephone).toBe("+263 78 872 3331");
  expect(data.address.addressLocality).toBe("Harare");
  expect(JSON.stringify(data)).not.toContain("+236");
});
