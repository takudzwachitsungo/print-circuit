import { test, expect } from "@playwright/test";

test("service FAQ reveals an answer when its question is opened", async ({ page }) => {
  await page.goto("/services/printing");
  const question = page.getByRole("button", { name: /How long does printing take/i });
  await expect(question).toBeVisible();
  await expect(page.getByText(/Most standard jobs/i)).not.toBeVisible();
  await question.click();
  await expect(page.getByText(/Most standard jobs/i)).toBeVisible();
});
