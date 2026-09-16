/**
 * "Send us a message" contact form. This site has no server of its own (see
 * adQuoteCheckout.ts), so this goes straight from the browser to the shared
 * backend's public, rate-limited /leads/contact endpoint.
 */

type ApiEnvelope = {
  success?: boolean;
  message?: string;
};

export type ContactFormInput = {
  firstName: string;
  lastName: string;
  mobile?: string;
  email: string;
  address?: string;
  message: string;
};

function backendBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_BACKEND_API_BASE_URL is not configured for this site.",
    );
  }
  return url.replace(/\/$/, "");
}

export async function submitContactForm(input: ContactFormInput): Promise<string> {
  const res = await fetch(`${backendBaseUrl()}/leads/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, site: "easylinkplus.com" }),
  });
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope;

  if (!res.ok) {
    throw new Error(json.message || "Could not send your message. Please try again.");
  }

  return json.message || "Thanks — we've received your message and will be in touch shortly.";
}
