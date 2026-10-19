import Reveal from "@/components/animation/Reveal";

const PANELS: { title: string; body: string }[] = [
  {
    title: "Mission",
    body: "To empower businesses and individuals with high-quality and innovative printing, branding, and marketing solutions that enhance their visibility and success.",
  },
  {
    title: "Vision",
    body: "To become a leading provider of innovative printing, branding, and marketing solutions in Zimbabwe and beyond, renowned for excellence, creativity, and exceptional customer service.",
  },
  {
    title: "Values",
    body: "Quality, innovation, integrity, customer focus, reliability, and teamwork.",
  },
];

const TINTS = ["bg-tint-cyan", "bg-tint-pink", "bg-tint-butter"];

export default function ValuesPanels() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
      <Reveal>
        <h2 className="font-display text-3xl font-medium tracking-tight text-primary sm:text-4xl">
          What we stand for
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {PANELS.map((panel, i) => (
          <Reveal key={panel.title} delay={i * 0.05}>
            <div className={`h-full rounded-3xl p-8 ${TINTS[i]}`}>
              <h3 className="font-display text-xl font-medium text-primary">
                {panel.title}
              </h3>
              <p className="mt-4 text-primary/75">{panel.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
