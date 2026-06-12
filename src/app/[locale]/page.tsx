import { Button } from "@/components/ui/button";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getAllMedia } from "@/utils/sdk/media";
import { getAllServices } from "@/utils/sdk/services";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import img from "./news/voting-member.png";

export async function generateMetadata() {
  const locale = await getLocale();
  return await generatedMetadataForPage(locale, "Home", "/");
}

export default async function Page() {
  const locale = await getLocale();
  const records = getAllServices(locale);
  const mediaItems = getAllMedia();
  const t = await getTranslations();
  return (
    <div className="x-top-page">
      <section className="x-hero">
        <h1>{t("Homepage.title")}</h1>
        <h2>{t("Homepage.subtitle")}</h2>
      </section>
      {/* <section>
        <h2>課程及活動</h2>
        <ProgramList />
        <p><Link className="x-button" href="/programs">更多課程及活動 &rarr;</Link></p>
      </section> */}
      <section>
        <h2>立即登記成為我們的投票會員，共同打造屬於你的語你童行。<br />Join us as a voting member and help us build Familogue together.</h2>
        <p><Link href="/news"><Image src={img} alt="voting-member" /></Link></p>
        <p><Button asChild variant="accent" size="lg"><Link href="/news">{t("General.view_details")} &rarr;</Link></Button></p>
      </section>
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
      <section>
        <h2>{t("Homepage.mediaSection.title")}</h2>
        <div className="mt-8 flex flex-col gap-4">
          {mediaItems.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center gap-4"
            >
              <Image
                src={item.thumbnail && item.thumbnail.length > 0 ? item.thumbnail : "/images/og-image.png"}
                alt={item.headline}
                width={160}
                height={90}
                className="aspect-[16/9] shrink-0 object-cover"
              />
              <div>
                <div className="text-muted-foreground text-sm">{item.outlet}</div>
                <h3>{item.headline}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}