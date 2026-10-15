export interface QuoteItem {
  name: string;
  qty: number;
  option?: string;
  note?: string;
}

export interface QuoteRequest {
  service: string;
  details: string;
  name: string;
  email: string;
  phone: string;
  /** Products from the quote basket. When present (non-empty), service and
      details become optional. */
  items?: QuoteItem[];
}

export interface QuoteResponse {
  ok: boolean;
  error?: string;
}

export const QUOTE_LIMITS = {
  maxItems: 50,
  maxQty: 100000,
  name: 120,
  option: 60,
  note: 500,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** "• Business Cards × 500 (Matte) — Double-sided", one line per item. */
export function formatQuoteItems(items: QuoteItem[]): string {
  return items
    .map(
      (i) =>
        `• ${i.name} × ${i.qty}${i.option ? ` (${i.option})` : ""}${i.note ? ` — ${i.note}` : ""}`,
    )
    .join("\n");
}

function parseItems(
  input: unknown,
): { ok: true; items: QuoteItem[] } | { ok: false; error: string } {
  if (input === undefined || input === null) return { ok: true, items: [] };
  if (!Array.isArray(input)) return { ok: false, error: "Invalid product list." };
  if (input.length > QUOTE_LIMITS.maxItems) {
    return {
      ok: false,
      error: `Please send at most ${QUOTE_LIMITS.maxItems} products per request.`,
    };
  }
  const items: QuoteItem[] = [];
  for (const raw of input) {
    if (typeof raw !== "object" || raw === null) {
      return { ok: false, error: "Invalid product list." };
    }
    const r = raw as Record<string, unknown>;
    const name = str(r.name);
    const option = str(r.option);
    const note = str(r.note);
    if (!name || name.length > QUOTE_LIMITS.name) {
      return { ok: false, error: "Invalid product name." };
    }
    if (
      typeof r.qty !== "number" ||
      !Number.isInteger(r.qty) ||
      r.qty < 1 ||
      r.qty > QUOTE_LIMITS.maxQty
    ) {
      return {
        ok: false,
        error: `Quantities must be whole numbers from 1 to ${QUOTE_LIMITS.maxQty}.`,
      };
    }
    if (option.length > QUOTE_LIMITS.option) {
      return { ok: false, error: "Product option is too long." };
    }
    if (note.length > QUOTE_LIMITS.note) {
      return { ok: false, error: "Product note is too long." };
    }
    items.push({
      name,
      qty: r.qty,
      ...(option ? { option } : {}),
      ...(note ? { note } : {}),
    });
  }
  return { ok: true, items };
}

export function validateQuote(
  input: unknown,
):
  | { valid: true; data: QuoteRequest }
  | { valid: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { valid: false, error: "Invalid request body." };
  }
  const r = input as Record<string, unknown>;
  const service = str(r.service);
  const details = str(r.details);
  const name = str(r.name);
  const email = str(r.email);
  const phone = str(r.phone);

  const parsed = parseItems(r.items);
  if (!parsed.ok) return { valid: false, error: parsed.error };
  const { items } = parsed;
  const hasItems = items.length > 0;

  if (!service && !hasItems) return { valid: false, error: "Please choose a service." };
  if (!name) return { valid: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  if (!phone) return { valid: false, error: "Please enter a phone number." };
  if (!hasItems && details.length < 10) {
    return { valid: false, error: "Please tell us a little more about your project." };
  }

  return {
    valid: true,
    data: {
      service: service || `Multiple products (${items.length})`,
      details,
      name,
      email,
      phone,
      ...(hasItems ? { items } : {}),
    },
  };
}
