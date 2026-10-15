"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addItem, removeItem, updateItem, type AddInput, type BasketItem } from "@/lib/basket";
import { getProduct } from "@/lib/products";
import { getServerSnapshot, getSnapshot, setBasket, subscribe } from "./basket-store";

export interface BasketApi {
  items: BasketItem[];
  /** Number of lines (not total quantity). */
  count: number;
  has(slug: string): boolean;
  add(input: AddInput): void;
  update(key: string, patch: { qty?: number; note?: string }): void;
  remove(key: string): void;
  clear(): void;
  isOpen: boolean;
  open(): void;
  close(): void;
  /** Short "added" message for the toast; null when hidden. */
  notice: string | null;
}

const BasketContext = createContext<BasketApi | null>(null);

export function useBasket(): BasketApi {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}

export default function BasketProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 3500);
    return () => window.clearTimeout(id);
  }, [notice]);

  const api = useMemo<BasketApi>(
    () => ({
      items,
      count: items.length,
      has: (slug) => items.some((i) => i.slug === slug),
      add: (input) => {
        const before = getSnapshot();
        const next = addItem(before, input);
        if (next === before) {
          setNotice("Your quote is full (50 items) — send it, then start another.");
          return;
        }
        setBasket(next);
        setNotice(`${getProduct(input.slug)?.name ?? "Item"} added to your quote`);
      },
      update: (key, patch) => setBasket(updateItem(getSnapshot(), key, patch)),
      remove: (key) => setBasket(removeItem(getSnapshot(), key)),
      clear: () => setBasket([]),
      isOpen,
      open: () => {
        setNotice(null);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
      notice,
    }),
    [items, isOpen, notice],
  );

  return <BasketContext.Provider value={api}>{children}</BasketContext.Provider>;
}
