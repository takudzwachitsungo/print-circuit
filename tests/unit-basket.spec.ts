import { test, expect } from "@playwright/test";
import {
  addItem,
  buildWhatsAppMessage,
  clampQty,
  itemKey,
  parseBasket,
  removeItem,
  toQuoteItems,
  updateItem,
  whatsappHref,
  type BasketItem,
} from "../lib/basket";
import { PRODUCT_SLUGS } from "../lib/products";

test("clampQty always yields an integer from 1 to 100000", () => {
  const cases: [unknown, number][] = [
    [5, 5], ["42", 42], [0, 1], [-3, 1], [2.9, 2], ["", 1], ["abc", 1],
    [NaN, 1], [Infinity, 1], [9_999_999, 100000], [undefined, 1],
  ];
  for (const [input, expected] of cases) expect(clampQty(input), String(input)).toBe(expected);
});

test("parseBasket tolerates garbage", () => {
  expect(parseBasket(null, PRODUCT_SLUGS)).toEqual([]);
  expect(parseBasket("{not json", PRODUCT_SLUGS)).toEqual([]);
  expect(parseBasket('{"a":1}', PRODUCT_SLUGS)).toEqual([]);
  expect(
    parseBasket(
      JSON.stringify([
        null,
        "x",
        { slug: "deleted-product", qty: 1 },
        { slug: "business-cards", qty: "abc" },
        { slug: "vinyl-banners", qty: 3, option: 7, note: "n".repeat(600) },
      ]),
      PRODUCT_SLUGS,
    ),
  ).toEqual([
    { slug: "business-cards", qty: 1 },
    { slug: "vinyl-banners", qty: 3, note: "n".repeat(500) },
  ]);
});

test("parseBasket merges duplicates and caps at 50 lines", () => {
  const dupes = JSON.stringify([
    { slug: "business-cards", qty: 2, option: "Matte" },
    { slug: "business-cards", qty: 3, option: "Matte" },
  ]);
  expect(parseBasket(dupes, PRODUCT_SLUGS)).toEqual([
    { slug: "business-cards", qty: 5, option: "Matte" },
  ]);
  const many = JSON.stringify(
    Array.from({ length: 60 }, (_, i) => ({ slug: "business-cards", qty: 1, option: `o${i}` })),
  );
  expect(parseBasket(many, PRODUCT_SLUGS)).toHaveLength(50);
});

test("addItem increments the same slug+option and splits different options", () => {
  let items: BasketItem[] = [];
  items = addItem(items, { slug: "business-cards", option: "Matte" });
  items = addItem(items, { slug: "business-cards", option: "Matte", qty: 499 });
  items = addItem(items, { slug: "business-cards", option: "Gloss", qty: 200, note: "Rush" });
  expect(items).toEqual([
    { slug: "business-cards", qty: 500, option: "Matte" },
    { slug: "business-cards", qty: 200, option: "Gloss", note: "Rush" },
  ]);
});

test("addItem returns the same array when the basket is full", () => {
  const full = Array.from({ length: 50 }, (_, i) => ({ slug: "business-cards", qty: 1, option: `o${i}` }));
  expect(addItem(full, { slug: "vinyl-banners" })).toBe(full);
  // an existing line can still be incremented
  expect(addItem(full, { slug: "business-cards", option: "o0" })[0].qty).toBe(2);
});

test("updateItem and removeItem target one line by key", () => {
  const items: BasketItem[] = [
    { slug: "business-cards", qty: 1, option: "Matte" },
    { slug: "vinyl-banners", qty: 1 },
  ];
  const key = itemKey(items[0]);
  expect(updateItem(items, key, { qty: 0, note: " Logo on back " })[0]).toEqual({
    slug: "business-cards",
    qty: 1,
    option: "Matte",
    note: " Logo on back ",
  });
  expect(updateItem(items, key, { qty: 250 })[0].qty).toBe(250);
  expect(removeItem(items, key)).toEqual([{ slug: "vinyl-banners", qty: 1 }]);
});

test("toQuoteItems uses product names and drops unknown slugs", () => {
  expect(
    toQuoteItems([
      { slug: "business-cards", qty: 500, option: "Matte", note: "Double-sided" },
      { slug: "gone", qty: 1 },
    ]),
  ).toEqual([{ name: "Business Cards", qty: 500, option: "Matte", note: "Double-sided" }]);
});

test("WhatsApp text round-trips special characters", () => {
  const items = [{ name: "Business Cards", qty: 500, note: "Logo & #1 slogan\nline two 🎉" }];
  expect(buildWhatsAppMessage(items)).toBe(
    "Hi Print Circuit, I'd like a quote for:\n• Business Cards × 500 — Logo & #1 slogan\nline two 🎉",
  );
  const href = whatsappHref("https://wa.me/263788723331", items);
  expect(href.startsWith("https://wa.me/263788723331?text=")).toBe(true);
  const text = new URL(href).searchParams.get("text");
  expect(text).toBe(buildWhatsAppMessage(items));
});
