import Reveal from "@/components/animation/Reveal";

const PANELS: { title: string; body: string }[] = [
  {
    title: "Mission",
    body: "To make professional design and printing accessible to every business in Zimbabwe — fast, reliable, and done right the first time.",
  },
  {
    title: "Vision",
    body: "To become Harare's most trusted name in print and brand, known for quality work and genuine care for our clients.",
  },
  {
    title: "Values",
    body: "Craftsmanship in every detail, reliability you can plan around, honest advice and pricing, and pride in serving our local community.",
  },
];

export default function ValuesPanels() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
          What we stand for
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PANELS.map((panel, i) => (
          <Reveal key={panel.title} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-white/10 bg-surface p-8">
              <h3 className="font-display text-xl font-bold text-cyan">
                {panel.title}
              </h3>
              <p className="mt-4 text-muted">{panel.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
