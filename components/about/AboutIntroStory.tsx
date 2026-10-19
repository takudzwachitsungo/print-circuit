import Reveal from "@/components/animation/Reveal";

export default function AboutIntroStory() {
  return (
    <section
      aria-label="About Print Circuit"
      className="mx-auto w-full max-w-screen-2xl bg-white px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8 xl:px-10"
    >
      <div className="mx-auto max-w-5xl">
        {/* Top Eyebrow / Breadcrumb */}
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-10 bg-magenta" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-magenta">
              Who We Are
            </p>
          </div>

          {/* Heading matching reference layout: About Print Circuit. */}
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            About <span className="text-magenta">Print Circuit.</span>
          </h1>
        </Reveal>

        {/* Narrative Copy matching reference screenshot 3 structure */}
        <Reveal delay={0.08} className="mt-8 space-y-6 text-base leading-relaxed text-muted sm:text-lg sm:leading-8">
          <p>
            <strong className="font-semibold text-primary">Printcircuit Enterprises (Private) Limited</strong> is a Zimbabwean printing and branding company committed to quality, innovation, integrity, and reliability. Since our incorporation on <span className="font-semibold text-primary">20 May 2026</span>, our primary objective has been to provide one-stop, world-class printing, branding, and digital solutions that help brands communicate clearly and stand out professionally.
          </p>

          <p>
            Some of the services offered at Print Circuit include a full range of commercial digital and large-format printing, graphic design and brand identity systems, corporate stationery supplies, indoor and outdoor signage, vehicle branding, and high-performance modern web development. Powered by modern equipment and rigorous quality control, we ensure every piece that leaves our Harare studio communicates with sharpness and credibility.
          </p>

          <p>
            We are powered by a qualified, creative, and passionate team with the necessary skills and experience to respond to today&rsquo;s technologically evolving print industry. Exceeding client expectations motivates the team at Print Circuit. We are committed to providing world-class print solutions and being excellent in all we do.
          </p>
        </Reveal>

        {/* Studio Highlights Bar */}
        <Reveal delay={0.15} className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-line bg-surface p-4 text-center sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Location</p>
            <p className="mt-1 font-display text-base font-bold text-primary sm:text-lg">Harare, Zimbabwe</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4 text-center sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Service Lines</p>
            <p className="mt-1 font-display text-base font-bold text-primary sm:text-lg">5 Specialised</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4 text-center sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Production</p>
            <p className="mt-1 font-display text-base font-bold text-primary sm:text-lg">In-House Studio</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4 text-center sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Delivery</p>
            <p className="mt-1 font-display text-base font-bold text-primary sm:text-lg">Nationwide</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
