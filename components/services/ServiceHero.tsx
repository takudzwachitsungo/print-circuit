import Image from "next/image";
import ButtonLink from "@/components/ui/ButtonLink";
import { ACCENT, type Service } from "@/lib/services";
import { CATEGORY_SHORT, isCategory } from "@/lib/products";
import { getServiceSamples } from "@/lib/gallery";

export default function ServiceHero({ service }: { service: Service }) {
  const accent = ACCENT[service.accent];
  const cover = getServiceSamples(service.slug)[0];
  const short = isCategory(service.slug) ? CATEGORY_SHORT[service.slug] : service.label;
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pt-6 sm:px-6 lg:grid-cols-12">
      <div className={`rounded-3xl p-8 sm:p-12 lg:col-span-7 ${accent.tint}`}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/60">Service</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
          {service.seoTitle}
        </h1>
        <p className="mt-4 font-display text-xl text-primary/80">{service.tagline}</p>
        <p className="mt-4 max-w-2xl text-primary/70">{service.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Request a quote</ButtonLink>
          <ButtonLink href={`/shop?cat=${service.slug}`} variant="outline">
            Browse {short} products
          </ButtonLink>
        </div>
      </div>
      <div className="relative min-h-64 overflow-hidden rounded-3xl bg-ink lg:col-span-5">
        {cover ? (
          <Image
            src={cover}
            alt={`${service.label} sample`}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="dot-pattern absolute inset-0 bg-tint-butter" />
        )}
      </div>
    </section>
  );
}
