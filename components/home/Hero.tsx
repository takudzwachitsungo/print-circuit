import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import ProductImage from "@/components/shop/ProductImage";
import AddToQuoteButton from "@/components/shop/AddToQuoteButton";
import { PRODUCTS, featuredProducts, CATEGORY_SHORT, type Product } from "@/lib/products";
import { SITE } from "@/lib/site";

function FeatureCard({ product }: { product: Product }) {
  const titleId = `feature-${product.slug}`;
  return (
    <article
      aria-labelledby={titleId}
      className="group relative flex gap-5 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-6 text-white backdrop-blur-md transition-all duration-300 hover:border-magenta/50 hover:bg-white/[0.11] sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-magenta/20 blur-2xl transition group-hover:bg-magenta/35"
      />
      <div className="relative flex min-w-0 flex-1 flex-col">
        {product.badge && (
          <span className="self-start rounded-full border border-magenta/40 bg-magenta/20 px-2.5 py-1 text-xs font-semibold tracking-wide text-pink-200">
            {product.badge}
          </span>
        )}
        <h2 id={titleId} className="mt-3 font-display text-2xl font-medium leading-tight text-white sm:text-3xl">
          {product.name}
        </h2>
        <p className="mt-2 text-sm text-white/70">{product.blurb}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <AddToQuoteButton slug={product.slug} tone="light" />
          <Link
            href={`/shop/${product.slug}`}
            className="text-sm font-medium text-white/80 underline underline-offset-4 transition hover:text-white"
          >
            View product
          </Link>
        </div>
      </div>
      <div className="relative shrink-0 self-center hidden sm:block">
        <ProductImage
          product={product}
          sizes="160px"
          className="w-36 rounded-2xl border border-white/10 shadow-lg"
        />
      </div>
    </article>
  );
}

export default function Hero() {
  const [first, second] = featuredProducts();

  return (
    <section
      aria-label="Introduction"
      className="relative mx-auto mt-2 w-full max-w-7xl px-4 pt-2 sm:px-6"
    >
      {/* ── Main Hero Frame with Logo Pink (#ec008c) Atmosphere ── */}
      <div className="relative overflow-hidden rounded-3xl border border-magenta/20 bg-gradient-to-b from-[#24031c] via-[#1a0414] to-[#12030e] p-6 shadow-2xl sm:p-10 lg:p-14">
        {/* Ambient Glows matching Print Circuit Logo Pink */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-magenta/30 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-cyan/15 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-magenta/20 blur-[130px]"
        />

        {/* Tactile Halftone Pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1.5px,transparent_1.5px)] bg-[size:22px_22px] opacity-70"
        />

        {/* ── Prominent "PRINT CIRCUIT" Watermark in the Background ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        >
          <div className="flex flex-col items-center justify-center">
            <span
              className="font-display text-[15vw] font-black uppercase leading-none tracking-[-0.04em] text-white/[0.04] sm:text-[12vw] lg:text-[11vw]"
              style={{
                WebkitTextStroke: "1px rgba(236, 0, 140, 0.15)",
                textShadow: "0 0 60px rgba(236, 0, 140, 0.1)",
              }}
            >
              PRINT CIRCUIT
            </span>
            <span className="mt-2 hidden text-xs font-semibold uppercase tracking-[0.5em] text-magenta/20 sm:block">
              Harare · Premium Print &amp; Brand Studio
            </span>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Pitch & CTAs */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              {/* Home Quick Tabs / Categories Row */}
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-300/60 mr-1">
                  Harare Studio ·
                </span>
                {SITE.services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/shop?cat=${s.slug}`}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-magenta/50 hover:bg-magenta/25 hover:text-white"
                  >
                    {CATEGORY_SHORT[s.slug]}
                  </Link>
                ))}
              </div>

              <h1 className="max-w-2xl font-display text-4xl font-medium leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-6xl">
                Print that makes your brand{" "}
                <span className="bg-gradient-to-r from-pink-100 via-pink-200 to-magenta bg-clip-text text-transparent">
                  look established
                </span>
                .
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Business cards, banners, signage, stationery and websites — pick what you need and get
                a quote the same day.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink
                  href="/shop"
                  variant="light"
                  className="bg-white font-medium text-primary shadow-lg shadow-black/20 hover:bg-pink-50"
                >
                  Browse products
                </ButtonLink>
                <ButtonLink
                  href="/contact"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white hover:border-white hover:bg-white/15"
                >
                  Get a quote
                </ButtonLink>
              </div>
            </div>

            {/* Studio quick meta */}
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-magenta animate-pulse" />
                {PRODUCTS.length} products
              </li>
              <li>{SITE.services.length} categories</li>
              <li>
                <a href={`tel:${SITE.phones[0].replace(/\s+/g, "")}`} className="hover:text-white">
                  {SITE.phones[0]}
                </a>
              </li>
              <li>
                {SITE.hours[0].days} {SITE.hours[0].time}
              </li>
            </ul>
          </div>

          {/* Right Column: Featured Cards */}
          <div className="grid gap-4 lg:col-span-5">
            {first && <FeatureCard product={first} />}
            {second && <FeatureCard product={second} />}
          </div>
        </div>
      </div>
    </section>
  );
}
