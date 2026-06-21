import { test, expect } from "@playwright/test";

// Regression: the Process timeline pins via GSAP ScrollTrigger. When the pinned
// section was a direct flex child, ScrollTrigger's pin-spacing reserved no extra
// height, so Testimonials/CtaBand scrolled up over the pinned section. Assert the
// pin reserves its scrub distance so following sections sit well below it.
test("pinned process timeline reserves scroll space (no section overlap)", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForSelector(".pin-spacer"); // ScrollTrigger has pinned the section

  const gap = await page.evaluate(() => {
    const docTop = (el: Element | null) => {
      let y = 0;
      let n = el as HTMLElement | null;
      while (n) {
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return y;
    };
    const proc = document.querySelector('section[aria-label="How we work"]');
    const testimonials = document.querySelector(
      'section[aria-label="What our clients say"]',
    );
    return docTop(testimonials) - docTop(proc);
  });

  // Process is ~100vh tall and the pin reserves ~1 extra screen of horizontal
  // scrub distance, so the next section must start well below it (was ~800 when
  // broken; ~1760 when correct).
  expect(gap).toBeGreaterThan(1200);
});
