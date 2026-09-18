import { ArrowGlyph, ArrowLink } from "@/components/ui/link";
import { Link } from "@/i18n/navigation";
import { CATEGORY_THEME } from "@/utils/category-theme";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getAllMedia } from "@/utils/sdk/media";
import { getFeaturedNews } from "@/utils/sdk/news";
import { getServicesByCategory } from "@/utils/sdk/services";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { CategoryBlob } from "./_components/category-blob";

export async function generateMetadata() {
  const locale = await getLocale();
  return await generatedMetadataForPage(locale, "Home", "/");
}

const OUTLET_LOGOS: Record<string, string> = {
  "Fairchild TV": "/images/logo-fairchildtv.jpg",
  "OMNI News": "/images/logo-omnitv.jpg",
  "One Night Talk": "/images/logo-onenighttalk.jpg",
  "UBC Asia Pacific": "/images/logo-ubc.jpg",
  "The Toronto Star": "/images/logo-torontostar.jpg",
  "CBC News": "/images/logo-cbcnews.jpg",
};

const LOGO_SIZE = 60;

export default async function Page() {
  const locale = await getLocale();
  const serviceGroups = getServicesByCategory(locale);
  const mediaItems = getAllMedia();
  const featuredNews = getFeaturedNews(locale);
  const t = await getTranslations();
  const tAlt = await getTranslations({ locale: locale === "zh" ? "en" : "zh" });
  return (
    <div className="x-top-page">
      <section className="x-hero">
        <h1>{t("Homepage.title")}</h1>
        <h2>{t("Homepage.subtitle")}</h2>
      </section>
      <section className="mt-20">
        <h2 className="x-section-heading"><ArrowLink href="/our-services">{t("OurServices.title")}</ArrowLink></h2>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {serviceGroups.map(({ category, services }, index) => (
            <Link
              key={category}
              href={`/our-services#${category}`}
              className="group col-span-1 flex flex-col items-center text-center no-underline"
            >
              <CategoryBlob
                category={category}
                spinOffsetDeg={index * 120}
                className="h-[12.65rem] w-[14.95rem] transition-transform group-hover:scale-105"
              >
                <span className="text-sm leading-tight font-semibold text-balance">
                  {tAlt(`ServiceCategories.${category}.name`)}
                  <span className="mt-1 block text-lg font-bold">
                    {t(`ServiceCategories.${category}.name`)}
                  </span>
                </span>
              </CategoryBlob>
              <p className="text-muted-foreground mt-3 mb-0">{t(`ServiceCategories.${category}.tagline`)}</p>
              <p className={`mt-2 mb-0 font-medium ${CATEGORY_THEME[category].text}`}>
                {services.map((service) => service.title).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      </section>
      {featuredNews.length > 0 && (
        <section className="mt-20">
          <h2 className="x-section-heading"><ArrowLink href="/news">{t("News.title")}</ArrowLink></h2>
          <div className={"mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"}>
            {featuredNews.map((post) => (
              <div key={post.slug} className="flex flex-col gap-2">
                <Link href={`/news/${post.slug}`} className="shrink-0">
                  <Image
                    src={post.featured_image ?? "/images/og-image.png"}
                    alt={post.title}
                    width={320}
                    height={180}
                    className="aspect-[16/9] object-cover w-full"
                  />
                </Link>
                <div className="flex-1">
                  <h3><ArrowLink href={`/news/${post.slug}`}>{post.title}</ArrowLink></h3>
                  <p className="text-muted-foreground">{extractExcerpt(post.body)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="mt-20">
        <h2 className="x-section-heading"><ArrowLink href="/about-us">{t("AboutUs.title")}</ArrowLink></h2>
        <h3>{t("AboutUs.subtitle")}</h3>
        <p>{t("AboutUs.description")}</p>
      </section>
      <section className="mt-20" aria-labelledby="media-section-heading">
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
        <h2 id="media-section-heading" className="x-section-heading">{t("Homepage.mediaSection.title")}</h2>
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
      </section>
    </div>
  );
}
