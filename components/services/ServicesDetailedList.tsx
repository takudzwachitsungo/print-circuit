import Link from "next/link";
import { SERVICES, ACCENT } from "@/lib/services";

export default function ServicesDetailedList() {
  return (
    <section aria-labelledby="detailed-services-heading" className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-magenta">
            Comprehensive Overview
          </p>
          <h2
            id="detailed-services-heading"
            className="mt-2 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl"
          >
            Explore each of our five specialised service lines.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            From initial concept through to finished physical print or digital deployment, we handle every stage under one roof in Harare.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {SERVICES.map((service, index) => {
            const num = String(index + 1).padStart(2, "0");
            const accentStyle = ACCENT[service.accent];

            return (
              <article
                key={service.slug}
                id={service.slug}
                className={`relative overflow-hidden rounded-3xl border border-line ${accentStyle.tint} p-6 sm:p-10 transition-all duration-300 hover:shadow-xl`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Column: Number, Title, Intro & Tagline */}
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl font-black tracking-tight text-primary/40 sm:text-3xl">
                        {num}
                      </span>
                      <span className="rounded-full border border-primary/10 bg-white/60 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary/80 backdrop-blur-sm">
                        {service.slug.replace(/-/g, " ")}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-2xl font-bold text-primary sm:text-3xl">
                      {service.label}
                    </h3>

                    <p className="mt-2 font-medium text-primary/90">
                      {service.tagline}
                    </p>

                    <p className="mt-4 text-sm font-medium leading-relaxed text-magenta sm:text-base">
                      {service.intro}
                    </p>

                    {/* Action Links */}
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-surface shadow-sm transition hover:bg-magenta hover:shadow-md"
                      >
                        Explore Service Page
                        <span aria-hidden>→</span>
                      </Link>
                      <Link
                        href={`/shop?cat=${service.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary/80 underline underline-offset-4 transition hover:text-magenta"
                      >
                        Shop related products
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Included Deliverables Grid */}
                  <div className="w-full lg:max-w-md">
                    <div className="rounded-2xl border border-primary/10 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-primary/70">
                        What We Deliver
                      </h4>
                      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {service.included.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2 text-xs font-medium text-primary/85"
                          >
                            <span
                              aria-hidden
                              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-magenta/15 text-[10px] font-bold text-magenta"
                            >
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 border-t border-line/60 pt-4">
                        <Link
                          href={`/contact?service=${service.slug}`}
                          className="flex items-center justify-between text-xs font-bold text-magenta transition hover:underline"
                        >
                          <span>Request a custom quote</span>
                          <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
