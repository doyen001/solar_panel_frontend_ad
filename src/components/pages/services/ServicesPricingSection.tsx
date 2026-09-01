"use client";

import { Suspense, useState } from "react";
import { ServicesReveal } from "@/components/pages/services/ServicesReveal";
import { ServicesRippleLink } from "@/components/pages/services/ServicesRippleLink";
import { ServicesSectionHeading } from "@/components/pages/services/ServicesSectionHeading";
import { CheckoutReturnNotice } from "@/components/pages/services/CheckoutReturnNotice";
import { PricingCheckoutModal } from "@/components/pages/services/PricingCheckoutModal";
import Icon from "@/components/ui/Icons";
import type { AdQuoteTierId } from "@/lib/adQuoteCheckout";
import { SERVICES_PAGE } from "@/utils/constant";

const { pricing } = SERVICES_PAGE;

/** Only these two tiers have a fixed price a Stripe Checkout can charge — the
 * enterprise tier is "Let's scope it" and keeps going to the contact form. */
const CHECKOUT_TIER_IDS = new Set<AdQuoteTierId>(["starter", "business"]);

function isCheckoutTierId(id: string): id is AdQuoteTierId {
  return CHECKOUT_TIER_IDS.has(id as AdQuoteTierId);
}

export function ServicesPricingSection() {
  const [checkoutTier, setCheckoutTier] = useState<{
    id: AdQuoteTierId;
    name: string;
    priceLabel: string;
  } | null>(null);

  return (
    <section
      id="pricing"
      aria-labelledby="services-pricing-title"
      className="svc-anchor border-y border-svc-border-soft bg-white py-16 sm:py-20 lg:py-28"
    >
      <Suspense fallback={null}>
        <CheckoutReturnNotice />
      </Suspense>
      <div className="mx-auto w-full max-w-[1226px] px-4 sm:px-6 lg:px-8">
        <ServicesSectionHeading
          eyebrow={pricing.eyebrow}
          title={pricing.title}
          subtitle={pricing.subtitle}
          headingId="services-pricing-title"
        />

        <ul className="mt-12 grid items-stretch gap-6 lg:mt-16 lg:grid-cols-3">
          {pricing.tiers.map((tier, index) => {
            // Only the featured tier carries a badge, so the union needs a guard.
            const badge = "badge" in tier ? tier.badge : null;
            const isFeatured = tier.featured;
            const tierId = tier.id;

            return (
              <li key={tier.id} className="flex h-full">
                <ServicesReveal
                  delayMs={index * 80}
                  className="flex h-full w-full flex-col"
                >
                  <article
                    className={`svc-card svc-lift relative flex h-full w-full flex-col gap-6 rounded-3xl p-7 sm:p-8 ${
                      isFeatured ? "border-svc-gold bg-svc-ink" : ""
                    }`}
                  >
                    {badge ? (
                      <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-linear-to-b from-yellow-lemon to-orange-amber px-3 py-1 font-inter text-[11px] font-bold uppercase tracking-[0.1em] text-warm-black">
                        {badge}
                      </span>
                    ) : null}

                    <div className="flex flex-col gap-2">
                      <h3
                        className={`font-outfit text-xl font-bold leading-7 ${
                          isFeatured ? "text-white" : "text-svc-ink"
                        }`}
                      >
                        {tier.name}
                      </h3>
                      <p
                        className={`font-dm-sans text-[14px] leading-6 ${
                          isFeatured ? "text-svc-dark-body" : "text-svc-body"
                        }`}
                      >
                        {tier.summary}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p
                        className={`font-outfit text-[32px] font-bold leading-10 ${
                          isFeatured ? "text-white" : "text-svc-ink"
                        }`}
                      >
                        {tier.priceLabel}
                      </p>
                      <p
                        className={`font-inter text-[13px] leading-5 ${
                          isFeatured ? "text-svc-dark-muted" : "text-svc-muted"
                        }`}
                      >
                        {tier.cadence}
                      </p>
                    </div>

                    <ul className="flex flex-1 flex-col gap-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${
                              isFeatured
                                ? "bg-yellow-lemon/20 text-yellow-lemon"
                                : "bg-svc-accent-soft text-svc-accent-text"
                            }`}
                          >
                            <Icon name="Check" className="size-3 text-current" />
                          </span>
                          <span
                            className={`font-dm-sans text-[14px] leading-6 ${
                              isFeatured ? "text-svc-dark-body" : "text-svc-body"
                            }`}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {isCheckoutTierId(tierId) ? (
                      <button
                        type="button"
                        aria-label={`${tier.ctaLabel} for the ${tier.name} package`}
                        onClick={() =>
                          setCheckoutTier({
                            id: tierId,
                            name: tier.name,
                            priceLabel: tier.priceLabel,
                          })
                        }
                        className={
                          isFeatured
                            ? "svc-cta-primary mt-auto inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 font-outfit text-base font-semibold text-warm-black"
                            : "mt-auto inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-svc-accent bg-white px-6 font-outfit text-base font-semibold text-svc-accent-text transition hover:bg-svc-accent-soft"
                        }
                      >
                        {tier.ctaLabel}
                        <Icon name="ArrowRight" className="size-[18px] text-current" />
                      </button>
                    ) : (
                      <ServicesRippleLink
                        href={tier.ctaHref}
                        onDark={isFeatured}
                        ariaLabel={`${tier.ctaLabel} for the ${tier.name} package`}
                        className={
                          isFeatured
                            ? "svc-cta-primary mt-auto inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl px-6 font-outfit text-base font-semibold text-warm-black"
                            : "mt-auto inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-svc-accent bg-white px-6 font-outfit text-base font-semibold text-svc-accent-text transition hover:bg-svc-accent-soft"
                        }
                      >
                        {tier.ctaLabel}
                        <Icon name="ArrowRight" className="size-[18px] text-current" />
                      </ServicesRippleLink>
                    )}
                  </article>
                </ServicesReveal>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center font-inter text-[13px] leading-6 text-svc-muted">
          {pricing.footnote}
        </p>
      </div>

      {checkoutTier ? (
        <PricingCheckoutModal
          tierId={checkoutTier.id}
          tierName={checkoutTier.name}
          priceLabel={checkoutTier.priceLabel}
          onClose={() => setCheckoutTier(null)}
        />
      ) : null}
    </section>
  );
}
