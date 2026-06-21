import nodemailer from "nodemailer";
import { validateQuote, type QuoteRequest, type QuoteResponse } from "@/lib/quote";

// Backend-ready seam. Sends the validated quote by SMTP when the mail env vars
// are configured; otherwise logs server-side so nothing is lost (dev/CI default).
async function deliverQuote(data: QuoteRequest): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_TO, QUOTE_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !QUOTE_TO) {
    console.info("[quote] new submission (mail not configured)", data);
    return;
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT ?? 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transport.sendMail({
    from: QUOTE_FROM ?? SMTP_USER,
    to: QUOTE_TO,
    replyTo: data.email,
    subject: `Quote request: ${data.service} — ${data.name}`,
    text: [
      `Service: ${data.service}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      "",
      data.details,
    ].join("\n"),
  });
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
