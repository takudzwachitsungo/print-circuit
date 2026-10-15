"use client";

import { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "./BasketProvider";

export default function AddToQuoteButton({
  slug,
  className = "",
  tone = "outline",
}: {
  slug: string;
  className?: string;
  /** "light" for use on the dark ink card. */
  tone?: "outline" | "light";
}) {
  const { has, add, open } = useBasket();

  if (has(slug)) {
    return (
      <button
        type="button"
        onClick={open}
        className={`${buttonClass("outline", className)} border-magenta/30 bg-tint-pink`}
      >
        ✓ In your quote
      </button>
    );
  }
  return (
    <button type="button" onClick={() => add({ slug })} className={buttonClass(tone, className)}>
      + Add to quote
    </button>
  );
}
