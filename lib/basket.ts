import { getProduct } from "./products";
import { QUOTE_LIMITS, formatQuoteItems, type QuoteItem } from "./quote";

/** localStorage key for the visitor's quote basket. */
export const BASKET_KEY = "pc-quote-basket";

export interface BasketItem {
  slug: string;
  qty: number;
  option?: string;
  note?: string;
}

export interface AddInput {
  slug: string;
  qty?: number;
  option?: string;
  note?: string;
}

/** A basket line is one product + one option. */
export function itemKey(item: { slug: string; option?: string }): string {
  return `${item.slug}|${item.option ?? ""}`;
}

/** Any input → an integer between 1 and the max quantity. */
export function clampQty(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(QUOTE_LIMITS.maxQty, Math.max(1, Math.floor(n)));
}

/** Cut to `max` characters without splitting an emoji (a lone surrogate
    makes encodeURIComponent throw when the WhatsApp link is built). */
function truncate(text: string, max: number): string {
  return Array.from(text).slice(0, max).join("");
}

function cleanText(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value !== "" ? truncate(value, max) : undefined;
}

function line(slug: string, qty: number, option?: string, note?: string): BasketItem {
  return { slug, qty, ...(option ? { option } : {}), ...(note ? { note } : {}) };
}

/** Read whatever is in storage; anything unexpected is dropped, never thrown. */
export function parseBasket(raw: string | null, known: ReadonlySet<string>): BasketItem[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  let items: BasketItem[] = [];
  for (const entry of data) {
    if (typeof entry !== "object" || entry === null) continue;
    const r = entry as Record<string, unknown>;
    if (typeof r.slug !== "string" || !known.has(r.slug)) continue;
    items = addItem(items, {
      slug: r.slug,
      qty: clampQty(r.qty),
      option: cleanText(r.option, QUOTE_LIMITS.option),
      note: cleanText(r.note, QUOTE_LIMITS.note),
    });
  }
  return items;
}

/** Adds a line, or increases the quantity of the matching slug+option line.
    Returns the same array when a new line would exceed the 50-line limit. */
export function addItem(items: BasketItem[], input: AddInput): BasketItem[] {
  const key = itemKey(input);
  const qty = clampQty(input.qty ?? 1);
  const existing = items.find((i) => itemKey(i) === key);
  if (existing) {
    return items.map((i) =>
      i === existing
        ? line(i.slug, clampQty(i.qty + qty), i.option, cleanText(input.note, QUOTE_LIMITS.note) ?? i.note)
        : i,
    );
  }
  if (items.length >= QUOTE_LIMITS.maxItems) return items;
  return [...items, line(input.slug, qty, input.option, cleanText(input.note, QUOTE_LIMITS.note))];
}

export function updateItem(
  items: BasketItem[],
  key: string,
  patch: { qty?: number; note?: string },
): BasketItem[] {
  return items.map((i) =>
    itemKey(i) === key
      ? line(
          i.slug,
          patch.qty === undefined ? i.qty : clampQty(patch.qty),
          i.option,
          patch.note === undefined ? i.note : truncate(patch.note, QUOTE_LIMITS.note),
        )
      : i,
  );
}

export function removeItem(items: BasketItem[], key: string): BasketItem[] {
  return items.filter((i) => itemKey(i) !== key);
}

/** Basket lines → the API/WhatsApp shape, with product names. */
export function toQuoteItems(items: BasketItem[]): QuoteItem[] {
  return items.flatMap((i) => {
    const product = getProduct(i.slug);
    if (!product) return [];
    const note = i.note?.trim();
    return [
      {
        name: product.name,
        qty: i.qty,
        ...(i.option ? { option: i.option } : {}),
        ...(note ? { note } : {}),
      },
    ];
  });
}

export function buildWhatsAppMessage(items: QuoteItem[]): string {
  return `Hi Print Circuit, I'd like a quote for:\n${formatQuoteItems(items)}`;
}

export function whatsappHref(base: string, items: QuoteItem[]): string {
  return `${base}?text=${encodeURIComponent(buildWhatsAppMessage(items))}`;
}
