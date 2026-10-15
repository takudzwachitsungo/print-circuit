import { test, expect } from "@playwright/test";
import { formatQuoteItems, validateQuote } from "../lib/quote";

const contact = { name: "Test User", email: "test@example.com", phone: "+263 78 000 0000" };

test("legacy request without items still validates as before", () => {
  const r = validateQuote({ ...contact, service: "Printing Services", details: "500 business cards please" });
  expect(r).toEqual({
    valid: true,
    data: { ...contact, service: "Printing Services", details: "500 business cards please" },
  });
  expect(validateQuote({ ...contact, service: "", details: "500 business cards please" }).valid).toBe(false);
  expect(validateQuote({ ...contact, service: "Printing Services", details: "short" }).valid).toBe(false);
});

test("items make service and details optional", () => {
  const r = validateQuote({
    ...contact,
    service: "",
    details: "",
    items: [{ name: "  Business Cards ", qty: 500, option: "Matte", note: "" }],
  });
  expect(r).toEqual({
    valid: true,
    data: {
      ...contact,
      service: "Multiple products (1)",
      details: "",
      items: [{ name: "Business Cards", qty: 500, option: "Matte" }],
    },
  });
});

test("an empty items array falls back to the legacy rules", () => {
  expect(validateQuote({ ...contact, service: "", details: "", items: [] }).valid).toBe(false);
});

test("item rules", () => {
  const base = { ...contact, service: "", details: "" };
  const bad = [
    "nope",
    [{ name: "", qty: 1 }],
    [{ name: "x".repeat(121), qty: 1 }],
    [{ name: "Cards", qty: 0 }],
    [{ name: "Cards", qty: -1 }],
    [{ name: "Cards", qty: 2.5 }],
    [{ name: "Cards", qty: 100001 }],
    [{ name: "Cards", qty: "5" }],
    [{ name: "Cards", qty: 1, option: "o".repeat(61) }],
    [{ name: "Cards", qty: 1, note: "n".repeat(501) }],
    [null],
    Array.from({ length: 51 }, () => ({ name: "Cards", qty: 1 })),
  ];
  for (const items of bad) {
    expect(validateQuote({ ...base, items }).valid, JSON.stringify(items).slice(0, 80)).toBe(false);
  }
  expect(validateQuote({ ...base, items: [{ name: "Cards", qty: 100000 }] }).valid).toBe(true);
});

test("formatQuoteItems renders one line per item", () => {
  expect(
    formatQuoteItems([
      { name: "Business Cards", qty: 500, option: "Matte", note: "Double-sided" },
      { name: "Vinyl Banners", qty: 2 },
    ]),
  ).toBe("• Business Cards × 500 (Matte) — Double-sided\n• Vinyl Banners × 2");
});
