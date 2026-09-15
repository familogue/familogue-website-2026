import { siteConfig } from "@/utils/site-config";
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/',
    },
    host: siteConfig.baseUrl,
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
