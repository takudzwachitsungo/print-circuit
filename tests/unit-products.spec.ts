import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  PRODUCTS,
  CATEGORY_SHORT,
  featuredProducts,
  getProduct,
  isCategory,
  mostRequested,
  productsByCategory,
  relatedProducts,
  searchProducts,
} from "../lib/products";
import { SITE } from "../lib/site";

test("product slugs are unique and URL-safe", () => {
  const slugs = PRODUCTS.map((p) => p.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
  for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test("every category has products and a short label", () => {
  for (const s of SITE.services) {
    expect(productsByCategory(s.slug).length).toBeGreaterThan(0);
    expect(CATEGORY_SHORT[s.slug]).toBeTruthy();
  }
});

test("every product image file exists in public/", () => {
  for (const p of PRODUCTS) {
    if (p.image) {
      expect(existsSync(join(process.cwd(), "public", p.image)), p.image).toBe(true);
    }
  }
});

test("exactly two featured products for the hero", () => {
  expect(featuredProducts()).toHaveLength(2);
});

test("mostRequested lists badged products first and respects the limit", () => {
  const list = mostRequested(8);
  expect(list).toHaveLength(8);
  expect(list.every((p) => p.badge)).toBe(true);
  expect(mostRequested(3)).toHaveLength(3);
});

test("getProduct finds by slug", () => {
  expect(getProduct("business-cards")?.name).toBe("Business Cards");
  expect(getProduct("nope")).toBeUndefined();
});

test("search is case-insensitive and needs every term", () => {
  expect(searchProducts("CARDS business").map((p) => p.slug)).toContain("business-cards");
  expect(searchProducts("banner").map((p) => p.slug)).toEqual(
    expect.arrayContaining(["vinyl-banners", "roll-up-banners"]),
  );
  expect(searchProducts("zzzz")).toEqual([]);
  expect(searchProducts("<script>")).toEqual([]);
});

test("blank search returns the whole pool", () => {
  expect(searchProducts("   ")).toHaveLength(PRODUCTS.length);
  const pool = productsByCategory("printing");
  expect(searchProducts("", pool)).toEqual(pool);
});

test("isCategory only accepts real category slugs", () => {
  expect(isCategory("printing")).toBe(true);
  expect(isCategory("nonsense")).toBe(false);
  expect(isCategory(undefined)).toBe(false);
});

test("relatedProducts stays in category and excludes itself", () => {
  const product = getProduct("business-cards")!;
  const related = relatedProducts(product);
  expect(related.length).toBeGreaterThan(0);
  expect(related.length).toBeLessThanOrEqual(4);
  expect(related.every((p) => p.category === "printing" && p.slug !== product.slug)).toBe(true);
});
