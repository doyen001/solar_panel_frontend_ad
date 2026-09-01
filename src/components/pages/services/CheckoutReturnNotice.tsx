"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { refreshAdQuotePayment } from "@/lib/adQuoteCheckout";
import { showCheckoutNotice } from "@/lib/checkoutNotice";

function formatAmount(payment: { amount: number; currency: string }): string {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: payment.currency,
    }).format(payment.amount);
  } catch {
    return `${payment.amount.toFixed(2)} ${payment.currency}`;
  }
}

/**
 * Stripe sends the visitor back to /services with `?payment=...`. We surface
 * the outcome as a small floating banner, then strip the params so a refresh
 * does not re-show it.
 */
export function CheckoutReturnNotice() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);

  const outcome = params.get("payment");
  const paymentId = params.get("paymentId");

  useEffect(() => {
    if (!outcome) return;

    const key = `${outcome}:${paymentId ?? ""}`;
    if (handled.current === key) return;
    handled.current = key;

    const clearParams = () => {
      const next = new URLSearchParams(params.toString());
      next.delete("payment");
      next.delete("paymentId");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    if (outcome === "cancelled") {
      showCheckoutNotice("info", "Checkout was cancelled — nothing was charged.");
      clearParams();
      return;
    }

    if (outcome !== "success") {
      clearParams();
      return;
    }

    if (!paymentId) {
      showCheckoutNotice("success", "Order completed.");
      clearParams();
      return;
    }

    void refreshAdQuotePayment(paymentId)
      .then((payment) => {
        if (payment.status === "PAID") {
          showCheckoutNotice(
            "success",
            `Payment confirmed — ${formatAmount(payment)} received. We'll be in touch shortly.`,
          );
        } else if (payment.status === "PENDING") {
          showCheckoutNotice(
            "info",
            "Checkout finished — Stripe is still confirming this payment.",
          );
        } else {
          showCheckoutNotice(
            "error",
            payment.failureMessage ?? `Payment ${payment.status.toLowerCase()}.`,
          );
        }
      })
      .catch(() => {
        showCheckoutNotice(
          "info",
          "Checkout finished — could not confirm the payment status.",
        );
      })
      .finally(clearParams);
  }, [outcome, params, pathname, paymentId, router]);

  return null;
}
