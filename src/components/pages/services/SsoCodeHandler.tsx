"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import Icon from "@/components/ui/Icons";
import { exchangeSsoCode, storeSsoIdentity } from "@/lib/ssoHandoff";

type Result =
  | { kind: "success"; name: string }
  | { kind: "error"; message: string };

/**
 * Picks up the one-time `?code=` the main site's login redirects back with
 * (see PricingCheckoutModal's "Sign in instead" link), exchanges it for a
 * short-lived identity, and stores it for the checkout modal to pick up —
 * so re-opening "Get Free Quote" skips straight past Google sign-in. This
 * site has no toast/notification system, so the outcome is a small inline
 * banner rather than a dependency pulled in just for this.
 */
export function SsoCodeHandler() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const code = params.get("code");

  const onCode = useEffectEvent(async () => {
    if (!code || handled.current === code) return;
    handled.current = code;

    const clearParam = () => {
      const next = new URLSearchParams(params.toString());
      next.delete("code");
      const qs = next.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}#pricing`, {
        scroll: false,
      });
    };

    try {
      const identity = await exchangeSsoCode(code);
      storeSsoIdentity(identity);
      setResult({ kind: "success", name: identity.name });
    } catch (err) {
      setResult({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Could not complete sign-in — please try again.",
      });
    } finally {
      clearParam();
    }
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onCode();
  }, [code]);

  if (!result) return null;

  return (
    <div
      role="status"
      className={`mx-auto mb-6 flex w-full max-w-[1226px] items-center gap-2.5 rounded-xl border px-4 py-3 font-dm-sans text-sm ${
        result.kind === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
    >
      <Icon
        name={result.kind === "success" ? "Check" : "X"}
        className="size-4 shrink-0"
      />
      {result.kind === "success" ? (
        <span>
          Signed in as <strong>{result.name}</strong> — click &quot;Get Free
          Quote&quot; below to continue.
        </span>
      ) : (
        <span>{result.message}</span>
      )}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setResult(null)}
        className="ml-auto shrink-0 opacity-70 hover:opacity-100"
      >
        <Icon name="X" className="size-4" />
      </button>
    </div>
  );
}
