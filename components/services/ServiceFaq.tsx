"use client";

import { useState } from "react";
import { type Service } from "@/lib/services";

export default function ServiceFaq({ service }: { service: Service }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        Frequently asked questions
      </h2>
      <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
        {service.faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.q}>
              <button
                type="button"
                id={`faq-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-display text-lg text-primary">
                  {faq.q}
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 text-cyan transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {/* grid-rows trick keeps the answer in the DOM (SEO) while collapsing it.
                  The inner div also gets visibility:hidden when collapsed so Playwright
                  toBeVisible() correctly reports false (bounding-box alone is not enough
                  because overflow-hidden doesn't affect getBoundingClientRect). */}
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                }`}
              >
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
                  <p className="text-muted">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
