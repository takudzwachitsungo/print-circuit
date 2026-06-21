export interface QuoteRequest {
  service: string;
  details: string;
  name: string;
  email: string;
  phone: string;
}

export interface QuoteResponse {
  ok: boolean;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuote(
  input: unknown,
):
  | { valid: true; data: QuoteRequest }
  | { valid: false; error: string } {
  if (typeof input !== "object" || input === null) {
    return { valid: false, error: "Invalid request body." };
  }
  const r = input as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const service = str(r.service);
  const details = str(r.details);
  const name = str(r.name);
  const email = str(r.email);
  const phone = str(r.phone);

  if (!service) return { valid: false, error: "Please choose a service." };
  if (!name) return { valid: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  if (!phone) return { valid: false, error: "Please enter a phone number." };
  if (details.length < 10) {
    return { valid: false, error: "Please tell us a little more about your project." };
  }

  return { valid: true, data: { service, details, name, email, phone } };
}
