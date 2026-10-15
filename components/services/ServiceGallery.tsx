import Image from "next/image";
import Reveal from "@/components/animation/Reveal";
import { type Service } from "@/lib/services";
import { getServiceSamples } from "@/lib/gallery";

export default function ServiceGallery({ service }: { service: Service }) {
  const samples = getServiceSamples(service.slug);
  // Fall back to three styled placeholders when no images are present.
  const items = samples.length > 0 ? samples : [null, null, null];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <h2 className="font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl">
          Sample work
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          A taste of {service.label.toLowerCase()}{" "}
          we&rsquo;ve produced.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((src, i) => (
          <Reveal key={src ?? i} delay={i * 0.05}>
            {src ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
                <Image
                  src={src}
                  alt={`${service.label} sample ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="dot-pattern aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-tint-butter" />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
