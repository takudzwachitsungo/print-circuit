import Reveal from "@/components/animation/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { SITE } from "@/lib/site";

export default function CtaBand() {
  return (
    <section aria-label="Get started" className="px-6 pb-24">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-surface px-8 py-20 text-center sm:py-28">
        {/* CMYK gradient edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan via-magenta to-yellow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[120%] -translate-x-1/2 bg-gradient-to-r from-cyan/20 via-magenta/20 to-yellow/20 blur-3xl"
        />

        <h2 className="relative font-display text-4xl font-bold text-primary sm:text-6xl">
          Let&rsquo;s print something great
        </h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg text-muted">
          Tell us about your project and we&rsquo;ll get you a quote — usually the
          same day.
        </p>

        <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton href="/contact">
            {"Let's print something great"}
          </MagneticButton>
          <MagneticButton href={SITE.whatsapp} variant="outline">
            Chat on WhatsApp
          </MagneticButton>
        </div>
      </Reveal>
    </section>
  );
}
