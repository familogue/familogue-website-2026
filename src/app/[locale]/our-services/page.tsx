import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { CATEGORY_THEME } from "@/utils/category-theme";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getServicesByCategory } from "@/utils/sdk/services";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { ServiceCategory, ServiceRecord } from "src/types";
import { CategoryBlob } from "../_components/category-blob";

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
    <div className={`flex aspect-[16/9] w-full items-center justify-center ${theme.softBg}`}>
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
            <div className={`border-b-2 pb-5 ${theme.border}`}>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                <CategoryBlob category={category} className="h-44 w-52 shrink-0">
                  <h2 className="text-lg leading-tight font-bold">
                    {tAlt(`ServiceCategories.${category}.name`)}
                    <span className="mt-1 block text-xl">
                      {t(`ServiceCategories.${category}.name`)}
                    </span>
                  </h2>
                </CategoryBlob>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-muted-foreground my-0! max-w-prose">
                    {t(`ServiceCategories.${category}.tagline`)}
                  </p>
                  {category === THERAPEUTIC && (
                    <p className="mt-3 mb-0!">
                      <Link
                        href="/our-therapists"
                        className={`font-medium underline underline-offset-4 ${theme.text}`}
                      >
                        {t("OurTherapists.meetTheTeam")} &rsaquo;
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {services.map((service) => (
                <article key={service.slug} className="flex flex-col gap-2">
                  <Link href={`/our-services/${service.slug}`}>
                    <ServiceThumb service={service} />
                  </Link>
                  <h3 className="font-semibold">
                    <Link href={`/our-services/${service.slug}`}>{service.title}</Link>
                  </h3>
                  <p className="text-muted-foreground my-0! flex-1 text-sm">
                    {extractExcerpt(service.content)}
                  </p>
                  <p className="mt-1 mb-0!">
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
