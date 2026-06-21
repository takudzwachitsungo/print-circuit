import { test, expect } from "@playwright/test";

test("quote API accepts a valid submission", async ({ request }) => {
  const res = await request.post("/api/quote", {
    data: {
      service: "Printing Services",
      details: "We need 500 business cards printed on matte stock.",
      name: "Test User",
      email: "test@example.com",
      phone: "+263 78 000 0000",
    },
  });
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
});

test("quote API rejects an invalid submission", async ({ request }) => {
  const res = await request.post("/api/quote", {
    data: { service: "", details: "", name: "", email: "bad", phone: "" },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(typeof body.error).toBe("string");
});
