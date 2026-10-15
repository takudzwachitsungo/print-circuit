export default function AboutHero() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pt-6 sm:px-6 lg:grid-cols-12">
      <div className="relative overflow-hidden rounded-3xl bg-tint-butter p-8 sm:p-12 lg:col-span-8">
        <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-magenta/15" />
        <p className="relative text-xs font-medium uppercase tracking-[0.2em] text-primary/60">
          About Print Circuit
        </p>
        <h1 className="relative mt-4 font-display text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl">
          New, hungry, and built for modern brands.
        </h1>
        <p className="relative mt-6 max-w-2xl text-lg text-primary/75">
          We&rsquo;re a Harare print and design studio on a simple mission: to help businesses and
          individuals improve performance and productivity through high-quality, reliable, and
          creative printing and branding solutions.
        </p>
      </div>
      <div className="flex flex-col justify-end rounded-3xl bg-ink p-8 text-surface sm:p-12 lg:col-span-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-surface/50">Based in</p>
        <p className="mt-2 font-display text-2xl font-medium">Avondale, Harare</p>
        <p className="mt-4 text-sm text-surface/70">
          Printing, branding, signage, stationery and web — under one roof.
        </p>
      </div>
    </section>
  );
}
