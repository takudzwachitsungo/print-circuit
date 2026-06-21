import { test, expect } from "@playwright/test";

test("visitor can complete the multi-step quote form", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Request a quote" });

  await form.getByRole("radio", { name: "Printing Services" }).check();
  await form.getByRole("button", { name: "Next" }).click();

  await form.getByLabel(/Tell us about your project/i).fill(
    "We need 500 business cards printed on matte stock.",
  );
  await form.getByRole("button", { name: "Next" }).click();

  await form.getByLabel("Name", { exact: true }).fill("Test User");
  await form.getByLabel("Email", { exact: true }).fill("test@example.com");
  await form.getByLabel("Phone", { exact: true }).fill("+263 78 000 0000");
  await form.getByRole("button", { name: /Send request/i }).click();

  await expect(page.getByText(/Thanks/i)).toBeVisible();
});
