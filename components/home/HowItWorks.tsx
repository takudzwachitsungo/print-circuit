const STEPS = [
  { title: "Choose products", body: "Browse the shop and add what you need to your quote." },
  { title: "Send your request", body: "Submit the quote form, or send the list on WhatsApp." },
  { title: "Approve the proof", body: "We send pricing and a digital proof — nothing prints until you sign off." },
  { title: "Collect or delivery", body: "Pick up in Avondale or get it delivered across Harare." },
];

export default function HowItWorks() {
  return (
    <section aria-label="How it works" className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
      <div className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">How it works</p>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-tint-butter font-display font-medium text-primary">
                {i + 1}
              </span>
              <p className="mt-4 font-display text-lg font-medium text-primary">{step.title}</p>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
