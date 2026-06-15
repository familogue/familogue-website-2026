import { Button } from "@/components/ui/button";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getAllMedia } from "@/utils/sdk/media";
import { getAllServices } from "@/utils/sdk/services";
import { getAllNews } from "@/utils/sdk/news";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata() {
  const locale = await getLocale();
  return await generatedMetadataForPage(locale, "Home", "/");
}

const OUTLET_LOGOS: Record<string, string> = {
  "Fairchild TV": "/images/logo-fairchildtv.jpg",
  "OMNI News": "/images/logo-omnitv.jpg",
  "One Night Talk": "/images/logo-onenighttalk.jpg",
  "UBC Asia Pacific": "/images/logo-ubc.jpg",
};

const LOGO_SIZE = 60;

export default async function Page() {
  const locale = await getLocale();
  const records = getAllServices(locale);
  const mediaItems = getAllMedia();
  const latestNews = getAllNews(locale)[0];
  const t = await getTranslations();
  return (
    <div className="x-top-page">
      <section className="x-hero">
        <h1>{t("Homepage.title")} ✨</h1>
        <h2>{t("Homepage.subtitle")}</h2>
      </section>
      {/* <section>
        <h2>課程及活動</h2>
        <ProgramList />
        <p><Link className="x-button" href="/programs">更多課程及活動 &rarr;</Link></p>
      </section> */}
      {latestNews && (
        <section>
          <h2>{t("News.title")}</h2>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-start gap-4">
            <Link href={`/news/${latestNews.slug}`} className="shrink-0">
              <Image
                src={latestNews.featured_image ?? "/images/og-image.png"}
                alt={latestNews.title}
                width={320}
                height={180}
                className="aspect-[16/9] object-cover w-full sm:w-[320px]"
              />
            </Link>
            <div className="flex-1">
              <h3><Link href={`/news/${latestNews.slug}`}>{latestNews.title}</Link></h3>
              <p className="text-muted-foreground">{extractExcerpt(latestNews.body)}</p>
              <p><Button asChild variant="accent" size="lg"><Link href={`/news/${latestNews.slug}`}>{t("General.view_details")} &rarr;</Link></Button></p>
            </div>
          </div>
        </section>
      )}
      <section>
        <h2>{t("AboutUs.title")}</h2>
        <h3>{t("AboutUs.subtitle")}</h3>
        <p>{t("AboutUs.description")}</p>
        <p><Button asChild variant="accent" size="lg"><Link href="/about-us">{t("General.view_details")} &rarr;</Link></Button></p>
      </section>
      <section>
        <h2>{t("OurServices.title")}</h2>
        <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          {records.map((record) => (
            <div key={record.title} className="col-span-1 flex flex-col gap-2">
              <div className="flex items-start justify-center">
                <Link href={`/our-services/${record.slug}`}>
                  <Image
                    src={record.image && record.image.length > 0 ? record.image[0] : "/images/og-image.png"}
                    alt={record.title || "Service Image"}
                    width={320}
                    height={180}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </Link>
              </div>
              <div>
                <h3><Link href={`/our-services/${record.slug}`}>{record.title}</Link></h3>
                <p className="text-muted-foreground">{record.content.split("\n")[0]}</p>
                <p><Button asChild variant="outline" size="sm"><Link href={`/our-services/${record.slug}`}>{t("General.view_details")} &rarr;</Link></Button></p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="media-section-heading">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              mediaItems.map((item) => ({
                "@context": "https://schema.org",
                "@type": item.url.includes("youtube.com") || item.url.includes("youtu.be")
                  ? "VideoObject"
                  : "NewsArticle",
                "name": item.headline,
                "url": item.url,
                "datePublished": item.date,
                "publisher": { "@type": "Organization", "name": item.outlet },
              }))
            ),
          }}
        />
        <h2 id="media-section-heading">{t("Homepage.mediaSection.title")}</h2>
        <div className="mt-8 flex flex-col gap-4">
          {mediaItems.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center gap-4"
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
                <h3>{item.headline} →</h3>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
