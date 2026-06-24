import Reveal from "@/components/animation/Reveal";

const PANELS: { title: string; body: string }[] = [
  {
    title: "Mission",
    body: "To help businesses and individuals improve performance and productivity through high-quality, reliable, and creative printing and branding solutions.",
  },
  {
    title: "Vision",
    body: "To become a trusted leading printing and branding company in Zimbabwe, known for quality, innovation, and excellent customer service.",
  },
  {
    title: "Values",
    body: "Quality, innovation, integrity, reliability, and customer focus.",
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
