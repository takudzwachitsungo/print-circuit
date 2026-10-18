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
          <span className="self-start rounded-full border border-magenta/40 bg-magenta/20 px-3 py-1 text-xs font-semibold tracking-wide text-pink-200">
            {product.badge}
          </span>
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

      {/* ── Dynamic Rotating Ambient Aura (inspired by onegrafix rotating light movement) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen opacity-75"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="heroRotatingGradient1" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
              <animate attributeName="fx" dur="24s" values="35%;65%;35%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#ec008c" stopOpacity="0.5" />
              <stop offset="45%" stopColor="#ec008c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ec008c" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heroRotatingGradient2" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
              <animate attributeName="fy" dur="20s" values="40%;60%;40%" repeatCount="indefinite" />
              <stop offset="0%" stopColor="#00aeef" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#00aeef" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#00aeef" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Primary Magenta Rotating Ambient Aura */}
          <rect
            x="10%"
            y="5%"
            width="90%"
            height="90%"
            fill="url(#heroRotatingGradient1)"
          >
            <animate attributeName="x" dur="18s" values="20%;-5%;20%" repeatCount="indefinite" />
            <animate attributeName="y" dur="22s" values="-5%;20%;-5%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="9s"
              repeatCount="indefinite"
            />
          </rect>
          {/* Secondary Counter-Rotating Tint Aura */}
          <rect
            x="-10%"
            y="-5%"
            width="85%"
            height="85%"
            fill="url(#heroRotatingGradient2)"
          >
            <animate attributeName="x" dur="25s" values="-10%;15%;-10%" repeatCount="indefinite" />
            <animate attributeName="y" dur="19s" values="15%;-10%;15%" repeatCount="indefinite" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="14s"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
      </div>

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
        {/* Our Services / Quick Tabs below Navbar */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-300/70 mr-1">
            Our Services ·
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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
                Harare, Zimbabwe · Serving You Online
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-6.5xl">
                Bringing Your Ideas
                <br />
                to{" "}
                <span className="bg-gradient-to-r from-pink-300 via-magenta to-pink-200 bg-clip-text text-transparent">
                  Print
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Professional printing, graphic design, branding, stationery supplies and web development
                solutions that help your business stand out.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-magenta px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-magenta/25 transition-all hover:bg-magenta/90 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/15"
                >
                  Explore Our Services
                </Link>
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
