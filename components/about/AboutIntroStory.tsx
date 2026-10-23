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
        <Reveal delay={0.08} className="mt-8 space-y-6 text-justify text-base leading-relaxed text-muted sm:text-lg sm:leading-8">
          <p>
            <strong className="font-semibold text-primary">Print Circuit Enterprises (Private) Limited</strong> is a Zimbabwean printing and branding company committed to quality, creativity, and reliability. Since our incorporation on <span className="font-semibold text-primary">20 May 2026</span>, we have been helping businesses and individuals bring their ideas to life through professional printing, branding, and design solutions.
          </p>

          <p>
            Our services include graphic design, digital and large-format printing, branding, indoor and outdoor signage, vehicle branding, web development, and stationery supplies. We are dedicated to delivering quality work that helps our clients communicate clearly and present their brands professionally.
          </p>

          <p>
            At Print Circuit, we believe every brand has a story worth telling. Our goal is to provide creative and reliable solutions that meet our clients&rsquo; needs and exceed their expectations.
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
