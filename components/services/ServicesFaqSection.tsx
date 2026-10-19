"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/services";

export default function ServicesFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Collect key FAQs across all services
  const allFaqs = SERVICES.flatMap((s) =>
    s.faqs.slice(0, 2).map((faq) => ({
      ...faq,
      serviceLabel: s.label,
    }))
  );

  return (
    <section aria-labelledby="services-faq-heading" className="border-t border-line bg-surface py-16 sm:py-24">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-magenta">
            Common Questions
          </p>
          <h2
            id="services-faq-heading"
            className="mt-2 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
            Everything you need to know about working with Print Circuit, turnaround times, file formats, and delivery across Harare.
          </p>
        </div>

        <div className="mt-10 divide-y divide-line rounded-3xl border border-line bg-base/50 px-6 sm:px-8">
          {allFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.q} className="py-4">
                <button
                  type="button"
                  id={`faq-btn-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-2 text-left focus:outline-none"
                >
                  <span className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-display text-base font-semibold text-primary sm:text-lg">
                      {faq.q}
                    </span>
                    <span className="text-[11px] font-medium text-muted">
                      ({faq.serviceLabel})
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-base font-bold text-magenta transition-transform duration-200 ${
                      isOpen ? "rotate-45 bg-magenta/10" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] pt-2 pb-3 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-muted sm:text-base">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
