import { ArrowGlyph } from "@/components/ui/link";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { LOGO_SIZE, OUTLET_LOGOS } from "@/utils/outlet-logos";
import { getAllMedia } from "@/utils/sdk/media";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "Media", "/media");
}

export default async function Page() {
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
      <div className="mt-8 flex flex-col gap-4">
        {mediaItems.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-row items-center gap-4"
          >
            {OUTLET_LOGOS[item.outlet] ? (
              <div className="flex shrink-0 items-center justify-center" style={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
                <Image
                  src={OUTLET_LOGOS[item.outlet]}
                  alt={item.outlet}
                  width={LOGO_SIZE}
                  height={LOGO_SIZE}
                  className="h-full w-full object-contain rounded"
                />
              </div>
            ) : (
              <div className="flex shrink-0 items-center justify-center" style={{ width: LOGO_SIZE, height: LOGO_SIZE }}>
                <Image
                  src={item.thumbnail ?? "/images/og-image.png"}
                  alt={item.headline}
                  width={LOGO_SIZE}
                  height={LOGO_SIZE}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="text-muted-foreground text-sm">
                {item.outlet} · <time dateTime={item.date}>{item.date}</time>
              </div>
              <h3>
                {item.headline} <ArrowGlyph className="text-link" />
              </h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
