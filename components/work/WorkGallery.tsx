"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PROJECTS, CATEGORIES, type ProjectCategory } from "@/lib/projects";
import WorkCard from "./WorkCard";

type Filter = "All" | ProjectCategory;

export default function WorkGallery({
  covers = {},
}: {
  covers?: Record<string, string | null>;
}) {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", ...CATEGORIES];
  const visible =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-3" role="group" aria-label="Filter projects">
        {filters.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? "border-cyan bg-cyan/10 text-cyan"
                  : "border-white/15 text-muted hover:border-white/40 hover:text-primary"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <motion.ul layout={!reduce} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => (
            <motion.li
              key={project.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={reduce ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
            >
              <WorkCard project={project} cover={covers[project.slug]} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
