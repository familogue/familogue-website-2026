import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/link";
import { Link } from "@/i18n/navigation";
import { CATEGORY_THEME } from "@/utils/category-theme";
import { contactInfo } from "@/utils/contact-info";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { OUTLET_LOGOS, STRIP_LOGO_SIZE } from "@/utils/outlet-logos";
import { getAllMedia } from "@/utils/sdk/media";
import { getFeaturedNews } from "@/utils/sdk/news";
import { getServicesByCategory } from "@/utils/sdk/services";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { CategoryBlob } from "./_components/category-blob";
import { ContactBlock } from "./_components/contact-block";

export async function generateMetadata() {
  const locale = await getLocale();
  return await generatedMetadataForPage(locale, "Home", "/");
}

export default async function Page() {
  const locale = await getLocale();
  const serviceGroups = getServicesByCategory(locale);
  const mediaItems = getAllMedia();
  // Outlets in order of first (most recent, since getAllMedia is
  // date-descending) appearance, with how many pieces each ran — five logos
  // otherwise undersell thirteen pieces of coverage.
  // Filtered to outlets that have a logo: the strip is images only, and a new
  // outlet added to the content without one would otherwise render an <Image>
  // with no `src`. Its coverage still appears in full on /media.
  const outlets = [...new Set(mediaItems.map((item) => item.outlet))]
    .filter((outlet) => OUTLET_LOGOS[outlet])
    .map((outlet) => ({
      outlet,
      count: mediaItems.filter((item) => item.outlet === outlet).length,
    }));
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
          {/*
            The group is how news actually reaches families, so the ask needs
            to answer "why would I join?" rather than just name the channel.
            Kept as an outline button: it is a secondary action, and Donate in
            the header is the only solid button on the page.
          */}
          <div className="border-accent/30 bg-accent/5 mt-8 rounded-lg border p-6">
            <h3 className="mt-0 mb-1 text-lg font-semibold">
              {t("Contact.whatsappGroupTitle")}
            </h3>
            <p className="text-muted-foreground mt-0 mb-4 max-w-prose">
              {t("Contact.whatsappGroupBlurb")}
            </p>
            <Button asChild variant="accentOutline" size="lg">
              <a href={contactInfo.whatsappCommunityUrl} target="_blank" rel="noopener noreferrer">
                {t("Contact.joinWhatsappGroup")}
              </a>
            </Button>
          </div>
        </section>
      )}
      <section className="mt-20">
        <h2 className="x-section-heading"><ArrowLink href="/about-us">{t("AboutUs.title")}</ArrowLink></h2>
        <h3>{t("AboutUs.subtitle")}</h3>
        <p>{t("AboutUs.description")}</p>
      </section>
      <section className="mt-20" aria-labelledby="media-section-heading">
        <h2 id="media-section-heading" className="x-section-heading">
          <ArrowLink href="/media">{t("Homepage.mediaSection.title")}</ArrowLink>
        </h2>
        <p className="text-muted-foreground mt-2">{t("Homepage.mediaSection.featuredIn")}</p>
        {/*
          A fixed grid rather than free-flowing wrap: the outlet names differ
          a lot in length, so wrapping chips sized to their content produced
          ragged rows. One per row on a phone, where a two-up chip would be
          too narrow for "UBC Asia Pacific" on one line.
        */}
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {outlets.map(({ outlet, count }) => (
            <li key={outlet}>
              <Link
                href="/media"
                className="hover:border-accent hover:bg-accent/5 flex h-full items-center gap-4 rounded-xl border p-4 no-underline transition-colors"
              >
                {/* White tile behind the logo: the source images carry their
                    own white backgrounds, so this squares them off against
                    the cream page rather than letting them float. */}
                <span className="ring-border flex size-16 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm ring-1">
                  <Image
                    src={OUTLET_LOGOS[outlet]}
                    alt=""
                    width={STRIP_LOGO_SIZE}
                    height={STRIP_LOGO_SIZE}
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-foreground font-medium">{outlet}</span>
                  <span className="text-muted-foreground mt-0.5 text-sm">
                    {t("Homepage.mediaSection.storyCount", { count })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ContactBlock locale={locale} />
    </div>
  );
}
