import type { Metadata } from "next";
import Link from "next/link";
import Form from "next/form";
import { SITE } from "@/lib/site";
import {
  CATEGORY_SHORT,
  PRODUCTS,
  isCategory,
  productsByCategory,
  searchProducts,
} from "@/lib/products";
import ProductGrid from "@/components/shop/ProductGrid";
import { SearchIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Shop printing & branding products",
  description:
    "Browse business cards, flyers, banners, signage, stationery and websites from Print Circuit in Harare — add what you need to a quote.",
  alternates: { canonical: "/shop" },
  openGraph: { url: "/shop" },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** Repeated params (?cat=a&cat=b) arrive as arrays — use the first. */
function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function shopHref(cat: string | null, q: string): string {
  const params = new URLSearchParams();
  if (cat) params.set("cat", cat);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawCat = first(params.cat);
  const category = isCategory(rawCat) ? rawCat : null;
  const q = first(params.q).trim().slice(0, 100);
  const results = searchProducts(q, category ? productsByCategory(category) : PRODUCTS);
  const chips: { slug: string | null; label: string }[] = [
    { slug: null, label: "All" },
    ...SITE.services.map((s) => ({ slug: s.slug, label: CATEGORY_SHORT[s.slug] })),
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-10 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Shop</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
        {category ? CATEGORY_SHORT[category] : "Shop all"}
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Add what you need to your quote — we&rsquo;ll reply with prices, usually the same day.
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Categories" className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const active = chip.slug === category;
            return (
              <Link
                key={chip.label}
                href={shopHref(chip.slug, q)}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-surface"
                    : "border-line bg-surface text-primary hover:border-primary"
                }`}
              >
                {chip.label}
              </Link>
            );
          })}
        </nav>
        <Form action="/shop" role="search" className="relative w-full lg:max-w-sm">
          {category && <input type="hidden" name="cat" value={category} />}
          <label htmlFor="shop-search" className="sr-only">
            Search the catalogue
          </label>
          <input
            key={q}
            id="shop-search"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search products…"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </Form>
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "product" : "products"}
        {q && <> for &ldquo;{q}&rdquo;</>}
      </p>

      {results.length > 0 ? (
        <div className="mt-6">
          <ProductGrid products={results} label="Products" />
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-line bg-surface p-10 text-center">
          <p className="font-display text-2xl text-primary">Can&rsquo;t find it?</p>
          <p className="mt-2 text-muted">We print and design far more than what&rsquo;s listed.</p>
          <Link
            href="/contact"
            className="mt-6 inline-block font-medium text-primary underline underline-offset-4 hover:text-magenta"
          >
            Describe it in a custom quote →
          </Link>
        </div>
      )}
    </main>
  );
}
