import { ArrowLink } from "@/components/ui/link";
import { bcp47For } from "@/utils/alternates";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { LOGO_SIZE, OUTLET_LOGOS } from "@/utils/outlet-logos";
import { getAllMedia } from "@/utils/sdk/media";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "Media", "/media");
}

/**
 * Dates are stored as plain `YYYY-MM-DD`. Formatted in UTC so the runtime's
 * own timezone can't shift a date to the previous day.
 */
function formatDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(bcp47For(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function Page() {
  const locale = await getLocale();
  const mediaItems = getAllMedia();
  const t = await getTranslations();
  return (
    <div className="x-container prose">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: mediaItems.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: item.url,
              item: {
                "@type": item.url.includes("youtube.com") || item.url.includes("youtu.be")
                  ? "VideoObject"
                  : "NewsArticle",
                name: item.headline,
                url: item.url,
                datePublished: item.date,
                publisher: { "@type": "Organization", name: item.outlet },
              },
            })),
          }),
        }}
      />
      <h1>{t("Media.title")}</h1>
      {/*
        `not-prose`: the typography plugin underlines every `a` it owns, and
        the row used to be a single link wrapping the logo, the outlet and the
        date as well as the headline — so the underline ran across all of it
        and the date read as clickable. Only the headline is a link now.
      */}
      <ul className="not-prose mt-8 flex list-none flex-col gap-8 p-0">
        {mediaItems.map((item) => (
          <li key={item.url} className="flex flex-row items-start gap-4">
            <div
              className="flex shrink-0 items-center justify-center"
              style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
            >
              <Image
                src={OUTLET_LOGOS[item.outlet] ?? item.thumbnail ?? "/images/og-image.png"}
                alt={item.outlet}
                width={LOGO_SIZE}
                height={LOGO_SIZE}
                className={`h-full w-full rounded ${OUTLET_LOGOS[item.outlet] ? "object-contain" : "object-cover"}`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground m-0 text-sm">
                {item.outlet} · <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
              </p>
              <h2 className="mt-1 mb-0 text-lg font-semibold">
                <ArrowLink href={item.url} external>
                  {item.headline}
                </ArrowLink>
              </h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
