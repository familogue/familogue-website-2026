import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";
import { buildAlternates, localePath, openGraphLocale } from "./alternates";
import { siteConfig } from "./site-config";


const defaultMeta: Metadata = {
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.baseUrl,
    }
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  metadataBase: new URL(siteConfig.baseUrl),
};

export async function generatedMetadataForPage(locale: string, namespace: string, pathname: string) {
  const t = await getTranslations(namespace);
  const metadata: Metadata = {
    title: t("title") + " | " + siteConfig.name,
    description: t("meta.description"),
    openGraph: {
      title: t("title") + " | " + siteConfig.name,
      description: t("meta.description"),
      url: localePath(locale, pathname),
      siteName: siteConfig.name,
      locale: openGraphLocale(locale),
      alternateLocale: locales.filter(l => l !== locale).map(openGraphLocale),
      type: "website",
      images: [
        {
          url: `/images/og-image.png`,
          width: 1600,
          height: 900,
          alt: `${siteConfig.name} Open Graph Image`
        }
      ]
    },
    alternates: buildAlternates(locale, pathname),
  };
  return { ...defaultMeta, ...metadata };
}
