import { Button } from "@/components/ui/button";
import { ArrowLink } from "@/components/ui/link";
import { Link } from "@/i18n/navigation";
import { CATEGORY_THEME } from "@/utils/category-theme";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getServicesByCategory } from "@/utils/sdk/services";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { ServiceCategory, ServiceRecord } from "src/types";

const THERAPEUTIC: ServiceCategory = "therapeutic-services";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "OurServices", "/our-services");
}

/** Service image, or a category-coloured block for the services that have none. */
const ServiceThumb: React.FC<{ service: ServiceRecord; }> = ({ service }) => {
  const theme = CATEGORY_THEME[service.category];
  if (service.image.length > 0) {
    return (
      <Image
        src={service.image[0]}
        alt={service.title}
        width={320}
        height={180}
        className="aspect-[16/9] w-full object-cover"
      />
    );
  }
  return (
    // The page background is already cream, so the lighter category tints need
    // an outline to read as a deliberate placeholder rather than empty space.
    <div className={`flex aspect-[16/9] w-full items-center justify-center border ${theme.softBg} ${theme.border}`}>
      <div className={`h-10 w-16 rounded-full opacity-70 ${theme.bg}`} />
    </div>
  );
};

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations();
  // The leaflet shows both languages on every category; pull the other locale's label too.
  const tAlt = await getTranslations({ locale: locale === "zh" ? "en" : "zh" });
  const groups = getServicesByCategory(locale);

  return (
    <div className="x-container">
      <h1 className="text-3xl font-bold">{t("OurServices.title")}</h1>

      {groups.map(({ category, services }) => {
        const theme = CATEGORY_THEME[category];
        return (
          <section key={category} id={category} className="mt-16 scroll-mt-24">
            <h2 className="x-section-heading flex flex-wrap items-baseline gap-x-3">
              <span aria-hidden className={`inline-block size-3 shrink-0 rounded-full ${theme.bg}`} />
              {t(`ServiceCategories.${category}.name`)}
              <span className="text-muted-foreground font-normal">
                {tAlt(`ServiceCategories.${category}.name`)}
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 mb-0 max-w-prose">
              {t(`ServiceCategories.${category}.tagline`)}
            </p>
            {category === THERAPEUTIC && (
              <p className="mt-2 mb-0">
                <ArrowLink href="/our-therapists" className="font-medium">
                  {t("OurTherapists.meetTheTeam")}
                </ArrowLink>
              </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {services.map((service) => (
                <article key={service.slug} className="flex flex-col gap-2">
                  <Link href={`/our-services/${service.slug}`}>
                    <ServiceThumb service={service} />
                  </Link>
                  <h3 className="font-semibold">
                    <Link href={`/our-services/${service.slug}`}>{service.title}</Link>
                  </h3>
                  <p className="text-muted-foreground my-0 flex-1 text-sm">
                    {extractExcerpt(service.content)}
                  </p>
                  <p className="mt-1 mb-0">
                    <Button asChild variant="accent" size="sm">
                      <Link href={`/our-services/${service.slug}`}>{t("General.view_details")}</Link>
                    </Button>
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
