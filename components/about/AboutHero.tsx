import InkBlend from "@/components/home/InkBlend";

export default function AboutHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden px-6 pt-32 pb-16">
      <InkBlend />
      <div className="relative mx-auto w-full max-w-5xl">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-yellow">
          About Print Circuit
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] text-primary sm:text-7xl">
          New, hungry, and built for modern brands.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          We&rsquo;re a Harare print and design studio on a simple mission: make
          every business we work with look professional, in print and online.
        </p>
      </div>
    </section>
  );
}
