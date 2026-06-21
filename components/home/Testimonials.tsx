"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    quote:
      "Clear proofs, honest advice and clean printing. Working with the team is genuinely easy.",
    name: "University of Zimbabwe",
    role: "Faculty department",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused]);

  const active = QUOTES[index];

  return (
    <section
      aria-label="What our clients say"
      className="mx-auto max-w-4xl px-6 py-16 text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="font-display text-sm uppercase tracking-[0.2em] text-cyan">
        Client words
      </p>

      <div className="relative mt-10 min-h-[14rem] sm:min-h-[12rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <p className="font-display text-2xl font-medium leading-snug text-primary sm:text-3xl">
              “{active.quote}”
            </p>
            <footer className="mt-6 text-sm text-muted">
              <span className="text-primary">{active.name}</span> — {active.role}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        {QUOTES.map((q, i) => (
          <button
            key={q.name}
            type="button"
            aria-label={`Show testimonial from ${q.name}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-cyan" : "w-2 bg-muted/40 hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
