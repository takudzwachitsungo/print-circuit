"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "solid" | "outline";
  className?: string;
};

export default function MagneticButton({
  children,
  href = "#",
  variant = "solid",
  className,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 font-display text-sm font-medium transition-colors";
  const styles =
    variant === "solid"
      ? "bg-cyan text-base hover:bg-magenta hover:text-primary"
      : "border border-muted/40 text-primary hover:border-cyan";

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`${base} ${styles} ${className ?? ""}`}
    >
      <motion.span style={{ x: sx, y: sy }} className="inline-block">
        {children}
      </motion.span>
    </Link>
  );
}
