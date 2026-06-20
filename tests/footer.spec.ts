import { test, expect } from "@playwright/test";

test("footer shows correct address and phone numbers", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("61 Mendel, Avondale, Harare, Zimbabwe");
  await expect(footer).toContainText("+263 78 872 3331");
  await expect(footer).not.toContainText("+236");
});
