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
          className={`absolute h-[42vmax] w-[42vmax] rounded-full opacity-25 blur-[110px] ${b.pos}`}
          style={{ background: b.color }}
          animate={
            reduce
              ? undefined
              : {
                  x: [0, 40, -30, 0],
                  y: [0, -30, 40, 0],
                  scale: [1, 1.15, 0.95, 1],
                }
          }
          transition={
            reduce
              ? undefined
              : { duration: 18 + i * 4, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
