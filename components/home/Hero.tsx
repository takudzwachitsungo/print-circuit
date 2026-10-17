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
      className="group relative flex gap-5 overflow-hidden rounded-3xl border border-white/25 bg-white/[0.13] p-6 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/45 hover:bg-white/[0.18] sm:p-8"
    >
      <div className="relative flex min-w-0 flex-1 flex-col">
        {product.badge && (
          <span className="self-start rounded-full bg-white px-3 py-1 text-xs font-bold tracking-wide text-[#b8005e] shadow-sm">
            {product.badge}
          </span>
        )}
        <h2 id={titleId} className="mt-3 font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
          {product.name}
        </h2>
        <p className="mt-2 text-sm text-white/85 leading-relaxed">{product.blurb}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
          <AddToQuoteButton slug={product.slug} tone="light" />
          <Link
            href={`/shop/${product.slug}`}
            className="text-sm font-semibold text-white underline underline-offset-4 transition hover:text-white/80"
          >
            View product
          </Link>
        </div>
      </div>
      <div className="relative shrink-0 self-center hidden sm:block">
        <ProductImage
          product={product}
          sizes="160px"
          className="w-36 rounded-2xl border border-white/20 shadow-2xl"
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
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#c80068] via-[#e6007e] to-[#b00058] text-white shadow-xl"
    >
      {/* ── Ambient Radial Lighting matching Print Circuit Logo Pink ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-white/20 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-yellow/20 blur-[120px]"
      />

      {/* ── Tactile Halftone Print Mesh Overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1.5px,transparent_1.5px)] bg-[size:24px_24px] opacity-60"
      />

      {/* ── Prominent Edge-to-Edge "PRINT CIRCUIT" Typography Watermark ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center">
          <span
            className="whitespace-nowrap font-display text-[17vw] font-black uppercase leading-none tracking-[-0.04em] text-white/[0.08]"
            style={{
              WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.18)",
              textShadow: "0 0 90px rgba(0, 0, 0, 0.15)",
            }}
          >
            PRINT CIRCUIT
          </span>
          <span className="mt-2 hidden text-xs font-bold uppercase tracking-[0.6em] text-white/30 sm:block">
            Harare · Commercial Print &amp; Brand Studio
          </span>
        </div>
      </div>

      {/* ── Inner Constrained Content Container ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Studio Categories / Quick Tabs below Navbar */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mr-1">
            Studio Categories ·
          </span>
          {SITE.services.map((s) => (
            <Link
              key={s.slug}
              href={`/shop?cat=${s.slug}`}
              className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-[#b8005e] hover:shadow-lg"
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
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
                Harare Studio · Avondale
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-6.5xl">
                Print that makes your brand{" "}
                <span className="text-white underline decoration-white/40 decoration-wavy underline-offset-8">
                  look established
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
                Business cards, banners, signage, stationery and websites — pick what you need and get
                a quote the same day.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#b8005e] shadow-xl shadow-black/15 transition-all hover:bg-white/95 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Browse products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-white/70 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white hover:bg-white/20"
                >
                  Get a quote
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-6 text-sm text-white/85">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
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
