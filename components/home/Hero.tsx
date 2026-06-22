"use client";

import { useReducedMotion } from "framer-motion";
import InkBlend from "./InkBlend";
import Reveal from "@/components/animation/Reveal";
import TextType from "@/components/animation/TextType";
import MagneticButton from "@/components/ui/MagneticButton";

const HEADLINE = "We bring ideas to print.";

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <InkBlend />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <h1 className="font-display text-5xl font-bold leading-[1.05] text-primary sm:text-7xl lg:text-8xl">
          {reduce ? (
            HEADLINE
          ) : (
            <>
              {/* Real text stays in the DOM for SEO + screen readers; the
                  typing effect is purely decorative. */}
              <span className="sr-only">{HEADLINE}</span>
              <span aria-hidden>
                <TextType
                  as="span"
                  text={[HEADLINE]}
                  typingSpeed={70}
                  initialDelay={250}
                  loop={false}
                  cursorCharacter="|"
                  cursorClassName="text-cyan font-normal"
                />
              </span>
            </>
          )}
        </h1>

        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted" data-testid="reveal-probe">
            Graphic design, large-format printing, branding, signage and
            stationery — crafted to make your business stand out across
            Zimbabwe.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton href="/contact">Get a Quote</MagneticButton>
          <MagneticButton href="/work" variant="outline">
            See our work
          </MagneticButton>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted">
        Scroll
      </div>
    </section>
  );
}
