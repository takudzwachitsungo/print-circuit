"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";
import { getProduct } from "@/lib/products";
import { itemKey, toQuoteItems, whatsappHref } from "@/lib/basket";
import { buttonClass } from "@/components/ui/ButtonLink";
import { useBasket } from "./BasketProvider";
import ProductImage from "./ProductImage";
import QtyInput from "./QtyInput";

/** Right-hand quote panel. Native <dialog> gives focus trapping, Esc and a backdrop. */
export default function BasketDrawer() {
  const { items, isOpen, close, update, remove } = useBasket();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-label="Your quote"
      onClose={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close(); // backdrop click
      }}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-base p-0 text-primary backdrop:bg-primary/40 sm:border-l sm:border-line"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-medium">Your quote</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close quote"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-line"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Your quote is empty.</p>
            <Link href="/shop" onClick={close} className={buttonClass("primary")}>
              Browse products
            </Link>
          </div>
        ) : (
          <ul data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
            {items.map((item) => {
              const product = getProduct(item.slug);
              if (!product) return null;
              const key = itemKey(item);
              return (
                <li key={key} className="flex gap-4 rounded-2xl border border-line bg-surface p-3">
                  <ProductImage product={product} sizes="64px" className="w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{product.name}</p>
                    {item.option && <p className="text-xs text-muted">{item.option}</p>}
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name} quantity`}
                        disabled={item.qty <= 1}
                        onClick={() => update(key, { qty: item.qty - 1 })}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
                      >
                        −
                      </button>
                      <QtyInput
                        value={item.qty}
                        label={`${product.name} quantity`}
                        onCommit={(qty) => update(key, { qty })}
                      />
                      <button
                        type="button"
                        aria-label={`Increase ${product.name} quantity`}
                        onClick={() => update(key, { qty: item.qty + 1 })}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => remove(key)}
                        className="ml-auto text-xs text-muted underline hover:text-primary"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      aria-label={`${product.name} note`}
                      placeholder="Size, colours, deadline…"
                      maxLength={500}
                      value={item.note ?? ""}
                      onChange={(e) => update(key, { note: e.target.value })}
                      className="mt-2 w-full rounded-lg border border-line bg-base px-3 py-1.5 text-sm placeholder:text-muted focus:border-primary focus:outline-none"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {items.length > 0 && (
          <div className="space-y-3 border-t border-line px-6 py-4">
            <Link href="/contact" onClick={close} className={buttonClass("primary", "w-full")}>
              Request quote
            </Link>
            <a
              href={whatsappHref(SITE.whatsapp, toQuoteItems(items))}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("whatsapp", "w-full")}
            >
              Send on WhatsApp
            </a>
          </div>
        )}
      </div>
    </dialog>
  );
}
