"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICES, ACCENT } from "@/lib/services";

export default function ServicesList() {
  return (
    <ul className="mt-16 border-t border-white/10">
      {SERVICES.map((s, i) => {
        const accent = ACCENT[s.accent];
        return (
          <motion.li
            key={s.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            className="border-b border-white/10"
          >
            <Link
              href={`/services/${s.slug}`}
              className="group flex items-center justify-between gap-6 py-8"
            >
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-bold text-primary transition-colors group-hover:text-cyan sm:text-4xl">
                  {s.label}
                </h2>
                <p className="mt-2 max-h-0 overflow-hidden text-muted opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
                  {s.tagline}
                </p>
              </div>
              <span
                aria-hidden
                className={`shrink-0 text-2xl text-muted transition-colors ${accent.groupHoverText}`}
              >
                →
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
