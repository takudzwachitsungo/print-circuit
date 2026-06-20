"use client";

import { motion, useReducedMotion } from "framer-motion";
import InkBlend from "./InkBlend";
import Reveal from "@/components/animation/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

const HEADLINE = ["We", "bring", "ideas", "to", "print."];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <InkBlend />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <h1 className="font-display text-5xl font-bold leading-[1.05] text-primary sm:text-7xl lg:text-8xl">
          {HEADLINE.map((word, i) => (
            <motion.span
              key={i}
              className="mr-[0.25em] inline-block"
              initial={reduce ? false : { opacity: 0, y: "0.4em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
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
