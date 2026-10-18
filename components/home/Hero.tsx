import Link from "next/link";
import ProductImage from "@/components/shop/ProductImage";
import AddToQuoteButton from "@/components/shop/AddToQuoteButton";
import { PRODUCTS, featuredProducts, CATEGORY_SHORT, type Product } from "@/lib/products";
import { SITE } from "@/lib/site";

function FeatureCard({ product }: { product: Product }) {
  const titleId = `feature-${product.slug}`;
  return (
    <article
      aria-labelledby={titleId}
      className="group relative flex gap-5 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-6 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-magenta/40 hover:bg-white/[0.11] sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-magenta/20 blur-2xl transition group-hover:bg-magenta/35"
      />
      <div className="relative flex min-w-0 flex-1 flex-col">
        {product.badge && (
          <div className="flex items-center gap-2">
            <span className="self-start rounded-full border border-magenta/40 bg-magenta/20 px-3 py-1 text-xs font-semibold tracking-wide text-pink-200">
              {product.badge}
            </span>
            <span className="font-script text-sm text-pink-300/85">
              popular choice
            </span>
          </div>
        )}
        <h2 id={titleId} className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
          {product.name}
        </h2>
        <p className="mt-2 text-sm text-white/75 leading-relaxed">{product.blurb}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <AddToQuoteButton slug={product.slug} tone="light" />
          <Link
            href={`/shop/${product.slug}`}
            className="text-sm font-semibold text-white/80 underline underline-offset-4 transition hover:text-white"
          >
            View product
          </Link>
        </div>
      </div>
      <div className="relative shrink-0 self-center hidden sm:block">
        <ProductImage
          product={product}
          sizes="160px"
          className="w-36 rounded-2xl border border-white/10 shadow-2xl"
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
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#1c0316] via-[#12020e] to-[#0a0208] text-white shadow-2xl"
    >
      {/* ── Ambient Radial Glows matching Dominant Logo Magenta (#ec008c) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[950px] -translate-x-1/2 rounded-full bg-magenta/30 blur-[135px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-cyan/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -right-20 h-96 w-96 rounded-full bg-yellow/10 blur-[120px]"
      />

      {/* ── Tactile Halftone Print Mesh Overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1.5px,transparent_1.5px)] bg-[size:22px_22px] opacity-70"
      />

      {/* ── Subtle Background Watermark ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
      >
        <span className="whitespace-nowrap font-display text-3xl font-extrabold uppercase tracking-[0.2em] text-white/[0.025] sm:text-5xl sm:tracking-[0.25em] lg:text-6xl">
          PRINT CIRCUIT
        </span>
      </div>

      {/* ── Expanded Responsive Content Container (Balanced padding across breakpoints) ── */}
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:px-10">
        {/* Studio Categories / Quick Tabs below Navbar */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300/70 mr-1">
            Studio Categories ·
          </span>
          {SITE.services.map((s) => (
            <Link
              key={s.slug}
              href={`/shop?cat=${s.slug}`}
              className="rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md transition-all hover:border-magenta/50 hover:bg-magenta/25 hover:text-white"
            >
              {CATEGORY_SHORT[s.slug]}
            </Link>
          ))}
        </div>

        {/* ── Hero Grid ── */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Heading, Pitch & CTAs */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300/70">
                  Harare Studio · Avondale
                </p>
                <span className="font-script text-base text-pink-300 sm:text-lg -rotate-2">
                  ✦ custom print &amp; brand studio
                </span>
              </div>
              <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-6.5xl">
                Print that makes your brand{" "}
                <span className="bg-gradient-to-r from-pink-300 via-magenta to-pink-200 bg-clip-text text-transparent">
                  look established
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Business cards, banners, signage, stationery and websites — pick what you need and get
                a quote the same day.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-xl bg-magenta px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-magenta/25 transition-all hover:bg-magenta/90 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Browse products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/15"
                >
                  Get a quote
                </Link>
                <span className="font-script text-sm sm:text-base text-pink-200/80 -rotate-1 pl-1">
                  Same-day quote response ⚡
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-magenta animate-pulse" />
                {PRODUCTS.length} products
              </li>
              <li>{SITE.services.length} categories</li>
              <li>
                <a href={`tel:${SITE.phones[0].replace(/\s+/g, "")}`} className="hover:text-white underline">
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
