import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import EnglishPage from "./en";
import ChinesePage from "./zh";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "AboutUs", "/about-us");
}

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("OurTherapists");
  if (locale !== 'en' && locale !== 'zh') notFound();
  return (
    <>
      {locale === 'en' ? <EnglishPage /> : <ChinesePage />}
      <section className="x-container mt-12">
        <h2 className="x-section-heading">{t("title")}</h2>
        <p className="text-muted-foreground mt-3 mb-0 max-w-prose">{t("subtitle")}</p>
        <p className="mt-4">
          <Button asChild variant="accent">
            <Link href="/our-therapists">{t("meetTheTeam")}</Link>
          </Button>
        </p>
      </section>
    </>
  );
}  