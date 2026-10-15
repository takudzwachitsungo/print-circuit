import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import ProductImage from "@/components/shop/ProductImage";
import AddToQuoteButton from "@/components/shop/AddToQuoteButton";
import { PRODUCTS, featuredProducts, type Product } from "@/lib/products";
import { SITE } from "@/lib/site";

function FeatureCard({ product, dark }: { product: Product; dark: boolean }) {
  const titleId = `feature-${product.slug}`;
  return (
    <article
      aria-labelledby={titleId}
      className={`flex gap-5 rounded-3xl p-6 sm:p-8 ${dark ? "bg-ink text-surface" : "bg-tint-butter text-primary"}`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {product.badge && (
          <span
            className={`self-start rounded-full px-2.5 py-1 text-xs font-medium ${dark ? "bg-surface/15" : "bg-surface"}`}
          >
            {product.badge}
          </span>
        )}
        <h2 id={titleId} className="mt-3 font-display text-2xl font-medium leading-tight sm:text-3xl">
          {product.name}
        </h2>
        <p className={`mt-2 text-sm ${dark ? "text-surface/70" : "text-primary/70"}`}>{product.blurb}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <AddToQuoteButton slug={product.slug} tone={dark ? "light" : "outline"} />
          <Link href={`/shop/${product.slug}`} className="text-sm font-medium underline underline-offset-4">
            View product
          </Link>
        </div>
      </div>
      <ProductImage product={product} sizes="160px" className="hidden w-36 shrink-0 self-center sm:block" />
    </article>
  );
}

export default function Hero() {
  const [first, second] = featuredProducts();
  return (
    <section aria-label="Introduction" className="mx-auto grid w-full max-w-7xl gap-4 px-4 pt-6 sm:px-6 lg:grid-cols-12">
      <div className="relative overflow-hidden rounded-3xl bg-tint-cyan p-8 sm:p-12 lg:col-span-7">
        <div aria-hidden className="absolute right-8 top-8 hidden h-32 w-32 rounded-full bg-magenta/25 sm:block" />
        <div aria-hidden className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-cyan/15" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">
            Harare · Printing &amp; branding
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl">
            Print that makes your brand look established.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-primary/75">
            Business cards, banners, signage, stationery and websites — pick what you need and get
            a quote the same day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop">Browse products</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Get a quote
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary/70">
            <li>{PRODUCTS.length} products</li>
            <li>{SITE.services.length} categories</li>
            <li>
              <a href={`tel:${SITE.phones[0].replace(/\s+/g, "")}`} className="hover:text-primary">
                {SITE.phones[0]}
              </a>
            </li>
            <li>
              {SITE.hours[0].days} {SITE.hours[0].time}
            </li>
          </ul>
        </div>
      </div>
      <div className="grid gap-4 lg:col-span-5">
        {first && <FeatureCard product={first} dark={false} />}
        {second && <FeatureCard product={second} dark />}
      </div>
    </section>
  );
}
