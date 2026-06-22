"use client";

import { motion, useReducedMotion } from "framer-motion";

const BLOBS = [
  { color: "var(--accent-cyan)", pos: "left-[8%] top-[18%]" },
  { color: "var(--accent-magenta)", pos: "right-[12%] top-[28%]" },
  { color: "var(--accent-yellow)", pos: "left-[38%] bottom-[6%]" },
];

export default function InkBlend() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute h-[46vmax] w-[46vmax] rounded-full opacity-45 blur-[80px] ${b.pos}`}
          style={{ background: b.color }}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 110, -80, 0],
                  y: [0, -90, 100, 0],
                  scale: [1, 1.3, 0.85, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 11 + i * 3, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
