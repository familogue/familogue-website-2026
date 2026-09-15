import { locales } from "@/i18n/config";
import { bcp47For } from "@/utils/alternates";
import { getAllNews } from "@/utils/sdk/news";
import { getAllServices } from "@/utils/sdk/services";
import { siteConfig } from "@/utils/site-config";
import type { MetadataRoute } from 'next';

const baseUrl = siteConfig.baseUrl;
const buildDate = new Date();

/**
 * One entry per locale, each carrying the full hreflang cluster.
 * The `loc` is locale-prefixed: the unprefixed path redirects, and
 * redirecting URLs in a sitemap are not indexable targets.
 */
function generateLocalePage(path: string, lastModified: Date = buildDate) {
  const languages: { [key: string]: string; } = {};
  for (const locale of locales) {
    languages[bcp47For(locale)] = `${baseUrl}/${locale}${path}`;
  }
  languages['x-default'] = `${baseUrl}${path}`;

  return locales.map<MetadataRoute.Sitemap[number]>((locale) => ({
    url: `${baseUrl}/${locale}${path}`,
    lastModified,
    alternates: {
      languages,
    },
  }));
}

// Generate sitemap entries for each locale and page
export default function sitemap(): MetadataRoute.Sitemap {
  const news = getAllNews("en");

  return [
    generateLocalePage(''),
    generateLocalePage('/news', news[0] ? new Date(news[0].date) : buildDate),
    ...news.map(p => generateLocalePage(`/news/${p.slug}`, new Date(p.date))),
    generateLocalePage('/our-services'),
    ...getAllServices("en").map(s => generateLocalePage(`/our-services/${s.slug}`)),
    generateLocalePage('/about-us'),
    generateLocalePage('/support-us'),
    generateLocalePage('/donate'),
    generateLocalePage('/volunteer'),
    // Add more pages as needed
  ].flat();
}
