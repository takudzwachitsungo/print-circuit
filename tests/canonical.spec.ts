import { test, expect } from "@playwright/test";

const cases: [string, string][] = [
  // Next normalizes the root canonical to the bare domain (no trailing
  // slash) — the correct homepage canonical.
  ["/", "https://www.printcircuit.co.zw"],
  ["/services", "https://www.printcircuit.co.zw/services"],
  ["/services/printing", "https://www.printcircuit.co.zw/services/printing"],
  ["/work", "https://www.printcircuit.co.zw/work"],
  ["/about", "https://www.printcircuit.co.zw/about"],
  ["/contact", "https://www.printcircuit.co.zw/contact"],
];

for (const [path, expected] of cases) {
  test(`canonical link on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      expected,
    );
  });
}
