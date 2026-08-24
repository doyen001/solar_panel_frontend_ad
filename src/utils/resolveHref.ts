const MAIN_SITE_URL = "https://easylinksolar.com.au";

/** Routes that actually exist in this ad microsite. Everything else copied
 * over from the main EasyLink Solar app (Products, Designs, Bluetti, portal
 * logins, blog, etc.) doesn't, so those links point back at the live site. */
const LOCAL_PATHS = new Set(["/", "/about-us", "/services", "/contact-us"]);

export function resolveHref(href: string): string {
  if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) {
    return href;
  }

  const pathname = href.split(/[?#]/)[0];
  if (LOCAL_PATHS.has(pathname)) {
    return href;
  }

  return `${MAIN_SITE_URL}${href}`;
}
