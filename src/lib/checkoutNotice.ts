"use client";

/**
 * This site has no toast library. Rather than model the banner as React
 * state set from inside an effect (which the `set-state-in-effect` lint
 * rule — rightly — flags as scheduling a render from an external event,
 * exactly what a toast call does but without React needing to know about
 * it), this reaches straight for the DOM, the same way a toast library
 * would under the hood.
 */

export type NoticeTone = "success" | "info" | "error";

const TONE_STYLE: Record<NoticeTone, string> = {
  success: "border-color:#a7f3d0;background:#ecfdf5;color:#065f46;",
  info: "border-color:#dbeafe;background:#eff6ff;color:#1e3a8a;",
  error: "border-color:#fecaca;background:#fef2f2;color:#991b1b;",
};

const CONTAINER_ID = "checkout-notice-container";

function getContainer(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let el = document.getElementById(CONTAINER_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = CONTAINER_ID;
    el.style.cssText =
      "position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:200;display:flex;flex-direction:column;gap:8px;width:min(92vw,480px);pointer-events:none;";
    document.body.appendChild(el);
  }
  return el;
}

export function showCheckoutNotice(tone: NoticeTone, message: string): void {
  const container = getContainer();
  if (!container) return;

  const banner = document.createElement("div");
  banner.setAttribute("role", "status");
  banner.style.cssText = `border-width:1px;border-style:solid;border-radius:12px;padding:12px 16px;font-family:var(--font-dm-sans, sans-serif);font-size:14px;line-height:1.4;box-shadow:0 10px 25px -10px rgba(0,0,0,0.25);${TONE_STYLE[tone]}`;
  banner.textContent = message;
  container.appendChild(banner);

  window.setTimeout(() => {
    banner.remove();
  }, 8000);
}
