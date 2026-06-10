import { siteConfig } from "@/utils/site-config";
import { getAllServices } from "@/utils/sdk/services";
import type { MetadataRoute } from 'next';

const locales = siteConfig.locales;
const baseUrl = siteConfig.baseUrl;

function generateLocalePage(path: string) {
  const urls: { [key: string]: string; } = {};
  for (const locale of locales) {
    urls[locale] = `${baseUrl}/${locale}${path}`;
  }
  const result: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    alternates: {
      languages: urls,
    },
  };
  return result;
}

// Generate sitemap entries for each locale and page
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    generateLocalePage('/'),
    generateLocalePage('/news'),
    generateLocalePage('/our-services'),
    ...getAllServices("en").map(s => generateLocalePage(`/our-services/${s.slug}`)),
    generateLocalePage('/about-us'),
    generateLocalePage('/support-us'),
    generateLocalePage('/donate'),
    generateLocalePage('/volunteer'),
    // Add more pages as needed
  ];
}
