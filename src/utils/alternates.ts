import type { Metadata } from "next";
import { locales } from "@/i18n/config";

/**
 * BCP 47 tags emitted as `hreflang` / `<html lang>` values.
 * Route segments stay `en` / `zh` — only the advertised tag is more specific.
 *
 * Deliberately region-free: a region subtag narrows hreflang matching, and a
 * family researching Vancouver services from Hong Kong should match just as
 * well as one already in Canada. `zh-Hant` still matters — the audience reads
 * Traditional Chinese, which bare `zh` does not express.
 */
export const bcp47ByLocale: Record<string, string> = {
  en: "en",
  zh: "zh-Hant",
};

export function bcp47For(locale: string) {
  return bcp47ByLocale[locale] ?? locale;
}

/**
 * Open Graph locales use ISO 639-1 + `_` + ISO 3166-1 and cannot carry a
 * script subtag, so these are declared separately rather than derived from
 * the BCP 47 tags above.
 */
const openGraphLocaleByLocale: Record<string, string> = {
  en: "en_CA",
  zh: "zh_HK",
};

export function openGraphLocale(locale: string) {
  return openGraphLocaleByLocale[locale] ?? locale;
}

/**
 * Locale-prefixed canonical plus a full hreflang cluster.
 *
 * `pathname` is the locale-less route (`/our-services`, or `/` for home).
 * Without the locale prefix both `/en/x` and `/zh/x` canonicalise to the same
 * unprefixed URL, which additionally redirects — de-indexing one locale.
 *
 * `x-default` points at the unprefixed path, which performs real per-path
 * Accept-Language negotiation (`/our-services` -> `/en/our-services` or
 * `/zh/our-services`), rather than at the default locale's own page.
 */
export function buildAlternates(locale: string, pathname: string): Metadata["alternates"] {
  const path = pathname === "/" ? "" : pathname;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[bcp47For(l)] = `/${l}${path}`;
  }
  languages["x-default"] = path === "" ? "/" : path;
  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}

/** Locale-prefixed absolute-path URL for a locale-less route. */
export function localePath(locale: string, pathname: string) {
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}
