import { validateQuote, type QuoteRequest, type QuoteResponse } from "@/lib/quote";

// Backend-ready seam: today we log the validated quote server-side so nothing is
// lost; wire this to email / DB / CRM when provider credentials are available.
async function deliverQuote(data: QuoteRequest): Promise<void> {
  console.info("[quote] new submission", data);
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const res: QuoteResponse = { ok: false, error: "Invalid request body." };
    return Response.json(res, { status: 400 });
  }

  const result = validateQuote(body);
  if (!result.valid) {
    const res: QuoteResponse = { ok: false, error: result.error };
    return Response.json(res, { status: 400 });
  }

  try {
    await deliverQuote(result.data);
  } catch {
    const res: QuoteResponse = {
      ok: false,
      error: "We couldn't submit your request. Please try again.",
    };
    return Response.json(res, { status: 500 });
  }

  const res: QuoteResponse = { ok: true };
  return Response.json(res, { status: 200 });
}
