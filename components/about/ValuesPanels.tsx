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

const TINTS = ["bg-tint-cyan", "bg-tint-pink", "bg-tint-butter"];

export default function ValuesPanels() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
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
