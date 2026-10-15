"use client";

import { motion } from "framer-motion";

/**
 * App Router template: re-mounts (fresh key) on every navigation, so this
 * enter-only transition plays per route without AnimatePresence. We avoid an
 * exit animation on purpose — AnimatePresence's deferred unmount clashed with
 * DOM that GSAP had restructured, throwing a React "removeChild" error that
 * blanked pages on navigation. `flex-1` lets the page area grow so the footer
 * stays anchored.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
}
