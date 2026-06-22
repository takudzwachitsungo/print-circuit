"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1 });
    // Expose the instance so floating controls (e.g. back-to-top) can drive it.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Integrate Lenis with GSAP ScrollTrigger so they share one scroll clock.
    // Without this the pinned/scrubbed triggers (e.g. the Process timeline)
    // compute positions against a scroll value ScrollTrigger never sees, which
    // desyncs the pin and makes following sections overlap it.
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000); // gsap ticker is seconds; lenis wants ms
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Pin/trigger positions can be stale if fonts or images settle after the
    // triggers were created; recompute once everything is laid out.
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}
