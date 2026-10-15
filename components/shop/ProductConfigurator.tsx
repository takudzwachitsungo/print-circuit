"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "./BasketProvider";
import QtyInput from "./QtyInput";

export default function ProductConfigurator({ product }: { product: Product }) {
  const { add, open } = useBasket();
  const [option, setOption] = useState<string | undefined>(product.options?.[0]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  return (
    <form
      aria-label={`Configure ${product.name}`}
      onSubmit={(e) => {
        e.preventDefault();
        add({ slug: product.slug, qty, option, note: note.trim() || undefined });
        setNote("");
      }}
      className="mt-8 space-y-6"
    >
      {product.options && product.options.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium text-primary">Option</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.options.map((o) => (
              <label
                key={o}
                className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-sm text-primary transition-colors has-checked:border-primary has-checked:bg-primary has-checked:text-surface has-focus-visible:outline-2 has-focus-visible:outline-cyan"
              >
                <input
                  type="radio"
                  name="option"
                  value={o}
                  checked={option === o}
                  onChange={() => setOption(o)}
                  className="sr-only"
                />
                {o}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <p className="text-sm font-medium text-primary">Quantity</p>
        <QtyInput value={qty} onCommit={setQty} label="Quantity" className="mt-3 w-28 py-2" />
      </div>

      <div>
        <label htmlFor="product-note" className="text-sm font-medium text-primary">
          Notes
        </label>
        <textarea
          id="product-note"
          rows={3}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Size, colours, deadline…"
          className="mt-3 w-full rounded-xl border border-line bg-surface p-3 text-sm text-primary placeholder:text-muted focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className={buttonClass("primary")}>
          Add to quote
        </button>
        <button type="button" onClick={open} className={buttonClass("outline")}>
          View quote
        </button>
      </div>
    </form>
  );
}
