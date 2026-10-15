import { BASKET_KEY, parseBasket, type BasketItem } from "@/lib/basket";
import { PRODUCT_SLUGS } from "@/lib/products";

// External store for useSyncExternalStore: one cached array per change so
// snapshots are referentially stable; storage failures fall back to memory.
const EMPTY: BasketItem[] = [];
const listeners = new Set<() => void>();
let current: BasketItem[] | null = null;

function load(): BasketItem[] {
  try {
    return parseBasket(window.localStorage.getItem(BASKET_KEY), PRODUCT_SLUGS);
  } catch {
    return EMPTY;
  }
}

export function getSnapshot(): BasketItem[] {
  if (current === null) current = load();
  return current;
}

export function getServerSnapshot(): BasketItem[] {
  return EMPTY;
}

export function setBasket(next: BasketItem[]): void {
  current = next;
  try {
    window.localStorage.setItem(BASKET_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode etc.) — keep the basket in memory for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Keep tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === BASKET_KEY) {
      current = load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
