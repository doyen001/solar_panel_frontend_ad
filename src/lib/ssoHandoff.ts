/**
 * "Get Free Quote" identity handoff from the main Easylink site's login.
 *
 * This site has no server/session of its own (see adQuoteCheckout.ts), so an
 * existing customer's identity arrives as a one-time code in the URL after
 * they sign in at easylinksolar.com.au/customers/auth — exchanged here,
 * client-side, straight against the backend for a short-lived access token
 * that substitutes for the Google ID token in `createAdQuoteCheckout`.
 */

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type SsoIdentity = {
  accessToken: string;
  email: string;
  name: string;
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

/** Where "Get Free Quote" sends a signed-out visitor to log in, with a return handoff back here. */
export function mainSiteAuthUrl(returnTo: string): string {
  const base =
    process.env.NEXT_PUBLIC_MAIN_SITE_AUTH_URL ||
    "https://easylinksolar.com.au/customers/auth";
  const url = new URL(base);
  url.searchParams.set("from", returnTo);
  return url.toString();
}

/** Exchanges a one-time `?code=` for a short-lived access token + identity. */
export async function exchangeSsoCode(code: string): Promise<SsoIdentity> {
  const res = await fetch(`${backendBaseUrl()}/auth/sso/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<{
    accessToken: string;
    user: { email: string; firstName: string; lastName: string };
  }>;

  if (!res.ok || !json.data) {
    throw new Error(json.message || "Could not complete sign-in");
  }

  const { accessToken, user } = json.data;
  return {
    accessToken,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`.trim() || user.email,
  };
}

const SESSION_KEY = "easylinkplus.ssoIdentity";

/** Session-only — this is a ~15min access token, not worth persisting across tabs/visits. */
export function storeSsoIdentity(identity: SsoIdentity) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(identity));
  } catch {
    // Storage can throw in private-browsing contexts; the identity still
    // works for the current in-memory checkout attempt either way.
  }
}

export function readStoredSsoIdentity(): SsoIdentity | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SsoIdentity) : null;
  } catch {
    return null;
  }
}
