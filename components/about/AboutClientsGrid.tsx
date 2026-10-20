import Image from "next/image";
import Reveal from "@/components/animation/Reveal";

interface Client {
  name: string;
  src: string;
  width: number;
  height: number;
  scaleClass?: string;
}

const CLIENTS: Client[] = [
  {
    name: "First Mutual Holdings Limited",
    src: "/clients/first-mutual.png",
    width: 1024,
    height: 328,
  },
  {
    name: "Rotaract Club of University of Zimbabwe",
    src: "/clients/rotaract-uz.png",
    width: 788,
    height: 336,
    scaleClass: "scale-[1.25] sm:scale-[1.35]",
  },
  {
    name: "Stream Exponential",
    src: "/clients/stream-exponential.png",
    width: 670,
    height: 372,
  },
  {
    name: "Pandhari Hotel",
    src: "/clients/pandhari-hotel.jpg",
    width: 905,
    height: 904,
  },
  {
    name: "empower.her",
    src: "/clients/empower-her.png",
    width: 983,
    height: 1024,
  },
  {
    name: "The Value Store",
    src: "/clients/the-value-store.jpg",
    width: 549,
    height: 248,
  },
  {
    name: "ZOC - Peculiar Seed On Campus",
    src: "/clients/zoc-campus.png",
    width: 1024,
    height: 1020,
  },
  {
    name: "Future First Financial Literacy",
    src: "/clients/future-first.png",
    width: 419,
    height: 329,
  },
  {
    name: "Maxitiles",
    src: "/clients/maxitiles.jpg",
    width: 401,
    height: 146,
    scaleClass: "scale-[1.35] sm:scale-[1.5]",
  },
  {
    name: "Bacon Palace",
    src: "/clients/bacon-palace.png",
    width: 577,
    height: 263,
  },
];

export default function AboutClientsGrid() {
  return (
    <section
      aria-labelledby="clients-heading"
      className="mx-auto w-full max-w-screen-2xl bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-10"
    >
      {/* Section Heading */}
      <Reveal className="text-center">
        <h2
          id="clients-heading"
          className="font-display text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl"
        >
          Some of our <span className="text-magenta">Clients.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Trusted by leading corporations, institutions, and growing brands across Zimbabwe.
        </p>
      </Reveal>

      {/* 10 Client Logo Cards in 2 rows of 5 on desktop */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 sm:gap-6 lg:gap-8">
        {CLIENTS.map((client, index) => (
          <Reveal
            key={client.name}
            delay={index * 0.04}
            className="flex items-center justify-center"
          >
            <div
              title={client.name}
              className="group relative flex h-32 w-full sm:h-36 lg:h-40 items-center justify-center rounded-3xl border border-line/80 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-magenta/40 hover:shadow-[0_12px_28px_rgba(236,0,140,0.15)]"
            >
              {/* Subtle Ambient Hover Rim */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2 rounded-2xl border border-black/[0.02] transition-colors group-hover:border-magenta/15"
              />

              <div
                className={`relative h-16 sm:h-20 w-full transition-transform duration-300 ${
                  client.scaleClass
                    ? `${client.scaleClass} group-hover:brightness-105`
                    : "group-hover:scale-105"
                }`}
              >
                <Image
                  src={client.src}
                  alt={client.name}
                  fill
                  sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 240px"
                  className="object-contain"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
