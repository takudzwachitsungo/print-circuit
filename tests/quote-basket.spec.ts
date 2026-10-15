import { test, expect, type Page } from "@playwright/test";

async function addBusinessCards(page: Page) {
  await page.goto("/shop/business-cards");
  const form = page.getByRole("form", { name: "Configure Business Cards" });
  await form.locator("label", { hasText: "Gloss" }).click();
  await form.getByLabel("Quantity", { exact: true }).fill("250");
  await form.getByRole("button", { name: "Add to quote", exact: true }).click();
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
}

async function fillContactAndSend(page: Page) {
  const form = page.getByRole("form", { name: "Request a quote" });
  await form.getByRole("button", { name: "Next" }).click();
  await form.getByRole("button", { name: "Next" }).click(); // details optional with items
  await form.getByLabel("Name", { exact: true }).fill("Test User");
  await form.getByLabel("Email", { exact: true }).fill("test@example.com");
  await form.getByLabel("Phone", { exact: true }).fill("+263 78 000 0000");
  await form.getByRole("button", { name: /Send request/i }).click();
}

test("drawer → form lists basket items, posts them and clears the basket", async ({ page }) => {
  await addBusinessCards(page);
  let posted: unknown = null;
  await page.route("**/api/quote", async (route) => {
    posted = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });

  await page.getByRole("button", { name: "Quote basket, 1 item" }).click();
  await page.getByRole("dialog", { name: "Your quote" }).getByRole("link", { name: "Request quote" }).click();
  await expect(page).toHaveURL(/\/contact$/);

  const form = page.getByRole("form", { name: "Request a quote" });
  await expect(form.getByText("Your products")).toBeVisible();
  await expect(form.getByText("Business Cards")).toBeVisible();
  await expect(form.getByLabel("Business Cards quantity", { exact: true })).toHaveValue("250");

  await fillContactAndSend(page);
  await expect(page.getByText(/Thanks/i)).toBeVisible();
  expect(posted).toMatchObject({
    name: "Test User",
    items: [{ name: "Business Cards", qty: 250, option: "Gloss" }],
  });
  await expect(page.getByRole("button", { name: "Quote basket, 0 items" })).toBeVisible();
});

test("a failed submission keeps the basket", async ({ page }) => {
  await addBusinessCards(page);
  await page.route("**/api/quote", (route) =>
    route.fulfill({ status: 500, json: { ok: false, error: "Server down." } }),
  );
  await page.goto("/contact");
  await fillContactAndSend(page);
  await expect(
    page.getByRole("form", { name: "Request a quote" }).getByRole("alert"),
  ).toContainText("Server down.");
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
});

test("Enter in a step-1 field moves on instead of submitting early", async ({ page }) => {
  await addBusinessCards(page);
  let posts = 0;
  await page.route("**/api/quote", async (route) => {
    posts++;
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Request a quote" });
  await form.getByLabel("Business Cards quantity", { exact: true }).fill("300");
  await form.getByLabel("Business Cards quantity", { exact: true }).press("Enter");
  await expect(form.getByText(/Step 2 of 3/)).toBeVisible();
  expect(posts).toBe(0);
  await expect(page.getByRole("button", { name: "Quote basket, 1 item" })).toBeVisible();
});
