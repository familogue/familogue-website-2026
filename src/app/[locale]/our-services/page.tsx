import { Link } from "@/i18n/navigation";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getAllServices } from "@/utils/sdk/services";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "OurServices", "/our-services");
}

function extractExcerpt(markdown: string): string {
  const firstParagraph = markdown.split(/\n\n+/)[0];
  return firstParagraph
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function Page() {
  const locale = await getLocale();
  const records = getAllServices(locale);
  const t = await getTranslations('OurServices');
  return (
    <div className="x-container prose">
      <h1>{t("title")}</h1>
      {records.map((record) => (
        <section key={record.slug} className="sm:flex sm:flex-row-reverse sm:items-start gap-2 mb-6">
          <Image
            src={record.image && record.image.length > 0 ? record.image[0] : "/images/og-image.png"}
            alt={record.title || "Service Image"}
            width={320}
            height={180}
            className="aspect-[16/9] object-cover" />
          <div className="flex-1">
            <h2 className="mt-0">{record.title}</h2>
            <p>{extractExcerpt(record.content)}</p>
            <Link href={`/our-services/${record.slug}`} className="not-prose text-sm font-medium hover:underline">
              {t("readMore")} →
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
