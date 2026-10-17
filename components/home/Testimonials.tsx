const QUOTES = [
  {
    quote:
      "Print Circuit turned our event around on short notice — the banners and flyers looked sharp and arrived on time. We keep coming back.",
    name: "Rotaract Club",
    role: "Community partner",
  },
  {
    quote:
      "They handled our full branding rollout with care, from logo to signage. The result made our store feel established overnight.",
    name: "Value Store",
    role: "Retail client",
  },
  {
    quote: "Clear proofs, honest advice and clean printing. Working with the team is genuinely easy.",
    name: "University of Zimbabwe",
    role: "Faculty department",
  },
];

export default function Testimonials() {
  return (
    <section aria-label="What our clients say" className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Client words</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {QUOTES.map((q) => (
          <li key={q.name}>
            <figure className="flex h-full flex-col rounded-3xl bg-tint-pink p-8">
              <blockquote className="flex-1 font-display text-lg leading-snug text-primary">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm text-primary/70">
                <span className="font-medium text-primary">{q.name}</span> — {q.role}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
