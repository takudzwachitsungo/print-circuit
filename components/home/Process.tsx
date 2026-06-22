"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const STEPS = [
  {
    n: "01",
    label: "Enquire",
    caption: "Tell us what you need — by phone, WhatsApp or our quote form.",
  },
  {
    n: "02",
    label: "Design",
    caption: "We craft artwork that fits your brand, or refine the files you bring.",
  },
  {
    n: "03",
    label: "Proof",
    caption: "You review a digital proof and sign off before anything goes to press.",
  },
  {
    n: "04",
    label: "Print",
    caption: "We produce your job on the right stock at the right finish.",
  },
  {
    n: "05",
    label: "Deliver",
    caption: "Collect in Avondale or get your order dropped off across Harare.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Reduced-motion or small screens: keep the plain, fully-visible layout.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - window.innerWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="How we work"
      className="overflow-hidden bg-base py-20 md:min-h-[560px] md:py-0"
    >
      <div className="mx-auto max-w-7xl px-6 md:flex md:min-h-[560px] md:flex-col md:justify-center">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-magenta">
          How it works
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold text-primary sm:text-5xl">
          Five simple steps, start to finish.
        </h2>

        <div
          ref={trackRef}
          className="mt-12 flex w-max flex-col gap-8 md:mt-16 md:flex-row md:gap-0"
        >
          {STEPS.map((step) => (
            <div
              key={step.label}
              className="md:w-screen md:max-w-md md:shrink-0 md:px-8 md:first:pl-0"
            >
              <div className="flex items-center gap-4">
                {/* registration-mark accent */}
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan/40 font-display text-sm text-cyan"
                >
                  +
                </span>
                <span className="font-display text-5xl font-bold text-white/10 sm:text-7xl">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-primary sm:text-3xl">
                {step.label}
              </h3>
              <p className="mt-3 max-w-xs text-muted">{step.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
