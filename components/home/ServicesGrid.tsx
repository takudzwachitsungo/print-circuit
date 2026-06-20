import Reveal from "@/components/animation/Reveal";
import ServiceCard, { type Accent } from "./ServiceCard";
import { SITE } from "@/lib/site";

const DESCRIPTIONS: Record<string, string> = {
  printing: "Digital & large-format printing, stickers, labels and packaging.",
  "graphic-design-branding":
    "Logos, flyers, brochures, business cards and corporate identity.",
  "signage-advertising":
    "Roll-up banners, event boards and retail graphics that get noticed.",
  "stationery-supplies":
    "Office stationery, printing consumables and bulk supplies.",
  "web-development":
    "Modern, responsive websites and a strong online presence.",
};

const ACCENTS: Accent[] = ["cyan", "magenta", "yellow"];

export default function ServicesGrid() {
  return (
    <section
      aria-label="Our services"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <Reveal>
        <p className="font-display text-sm uppercase tracking-[0.2em] text-magenta">
          Services
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-5xl">
          What we do
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SITE.services.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.05}>
            <ServiceCard
              slug={s.slug}
              label={s.label}
              description={DESCRIPTIONS[s.slug]}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
