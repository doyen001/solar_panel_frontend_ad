import NextLink from "next/link";
import type { ComponentProps } from "react";

import { resolveHref } from "@/utils/resolveHref";

type SafeLinkProps = ComponentProps<typeof NextLink>;

/**
 * Drop-in replacement for `next/link` used throughout this microsite. Content
 * and data (nav items, CTAs, breadcrumbs) were copied from the main EasyLink
 * Solar app, which links to many routes — Products, Designs, portal logins,
 * etc. — that don't exist here, so every href is routed through
 * `resolveHref` to send those out to the live site instead of 404ing.
 */
export default function SafeLink({ href, ...props }: SafeLinkProps) {
  const resolvedHref = typeof href === "string" ? resolveHref(href) : href;
  return <NextLink href={resolvedHref} {...props} />;
}
