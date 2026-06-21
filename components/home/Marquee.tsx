import Image from "next/image";
import { SHOWCASE, type ShowcaseItem } from "@/lib/showcase";

function Card({ item, duplicate }: { item: ShowcaseItem; duplicate?: boolean }) {
  return (
    <li aria-hidden={duplicate} className="w-64 shrink-0">
      <figure className="overflow-hidden rounded-xl border border-white/10 bg-surface">
        <Image
          src={item.src}
          // Duplicate track is decorative — hide it from assistive tech.
          alt={duplicate ? "" : item.alt}
          width={256}
          height={160}
          className="h-40 w-full object-cover"
        />
        <figcaption className="px-4 py-3 font-display text-sm uppercase tracking-[0.2em] text-muted">
          {item.label}
        </figcaption>
      </figure>
    </li>
  );
}

export default function Marquee({ items = SHOWCASE }: { items?: ShowcaseItem[] }) {
  return (
    <section
      aria-label="What we print"
      className="overflow-hidden border-y border-white/10 bg-base py-6"
    >
      {/* Track is duplicated so translateX(-50%) loops seamlessly; the
          prefers-reduced-motion guard in globals.css freezes it. */}
      <ul className="flex w-max animate-marquee items-stretch gap-6 px-6">
        {items.map((item) => (
          <Card key={item.label} item={item} />
        ))}
        {items.map((item) => (
          <Card key={`${item.label}-dup`} item={item} duplicate />
        ))}
      </ul>
    </section>
  );
}
