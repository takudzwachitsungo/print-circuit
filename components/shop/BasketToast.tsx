"use client";

import { useBasket } from "./BasketProvider";

export default function BasketToast() {
  const { notice, open } = useBasket();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4"
    >
      {notice && (
        <div className="pointer-events-auto flex items-center gap-4 rounded-full bg-ink px-5 py-3 text-sm text-surface shadow-lg">
          <span>{notice}</span>
          <button type="button" onClick={open} className="font-medium underline underline-offset-2">
            View quote
          </button>
        </div>
      )}
    </div>
  );
}
