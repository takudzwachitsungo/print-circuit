"use client";

import { useState } from "react";
import { clampQty } from "@/lib/basket";

/** Quantity box that lets people clear and retype, but only ever commits an
    integer 1–100000. Syncs when the value changes from outside (− / + buttons). */
export default function QtyInput({
  value,
  onCommit,
  label,
  className = "",
}: {
  value: number;
  onCommit: (qty: number) => void;
  label: string;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setDraft(String(value));
  }

  return (
    <input
      aria-label={label}
      inputMode="numeric"
      value={draft}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 7);
        setDraft(digits);
        if (digits !== "") {
          const qty = clampQty(digits);
          onCommit(qty);
          if (String(qty) !== digits) setDraft(String(qty));
        }
      }}
      onBlur={() => setDraft(String(value))}
      className={`w-20 rounded-lg border border-line bg-surface px-2 py-1.5 text-center text-sm text-primary focus:border-primary focus:outline-none ${className}`}
    />
  );
}
