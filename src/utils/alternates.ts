import type { Metadata } from "next";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * BCP 47 tags emitted as `hreflang` / `<html lang>` values.
 * Route segments stay `en` / `zh` — only the advertised tag is more specific.
 * `zh-Hant-CA` matters here: the audience reads Traditional Chinese.
 */
export const bcp47ByLocale: Record<string, string> = {
  en: "en-CA",
  zh: "zh-Hant-CA",
};

export function bcp47For(locale: string) {
  return bcp47ByLocale[locale] ?? locale;
}

/** Open Graph locale format (underscore separated). */
export function openGraphLocale(locale: string) {
  return bcp47For(locale).replace(/-/g, "_");
}

/**
 * Locale-prefixed canonical plus a full hreflang cluster including `x-default`.
 *
 * `pathname` is the locale-less route (`/our-services`, or `/` for home).
 * Without the locale prefix both `/en/x` and `/zh/x` canonicalise to the same
 * unprefixed URL, which additionally redirects — de-indexing one locale.
 */
export function buildAlternates(locale: string, pathname: string): Metadata["alternates"] {
  const path = pathname === "/" ? "" : pathname;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[bcp47For(l)] = `/${l}${path}`;
  }
  languages["x-default"] = `/${defaultLocale}${path}`;
  return {
    canonical: `/${locale}${path}`,
    languages,
  };
}

/** Locale-prefixed absolute-path URL for a locale-less route. */
export function localePath(locale: string, pathname: string) {
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}
