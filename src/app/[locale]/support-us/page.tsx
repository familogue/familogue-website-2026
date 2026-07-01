import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/_icons";
import { Button } from "@/components/ui/button";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { HandCoins, HeartHandshake, Megaphone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "SupportUs", "/support-us");
}

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations();
  const iconsize = 80;
  return (
    <div className="x-container prose">
      <h1>{t("SupportUs.title")}</h1>
      <p>{t("SupportUs.meta.description")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <section className="col-span-1">
          <h2><HandCoins size={iconsize} /> {t("Donate.title")}</h2>
          <p>{t("Donate.description")}</p>
          <Button asChild className="not-prose" variant="accent" size="lg"><Link href="/donate">{t("General.view_details")}</Link></Button>
        </section>
        <section className="col-span-1">
          <h2><HeartHandshake size={iconsize} /> {t("Volunteer.title")}</h2>
          <p>{t("Volunteer.description")}</p>
          <Button asChild className="not-prose" variant="accent" size="lg"><Link href="/volunteer">{t("General.view_details")}</Link></Button>
        </section>
        <section className="col-span-1">
          <h2><Megaphone size={iconsize} /> {t("SupportUs.subscribe")}</h2>
          <p>{t("SupportUs.subscribe_description")}</p>
          <ul>
            <li><Link href="https://www.facebook.com/Familogue" target="_blank" rel="noopener noreferrer">
              <div className="h-8 mr-2 inline-block">
                <FacebookIcon />
              </div>
              Facebook</Link></li>
            <li><Link href="https://www.instagram.com/familogue" target="_blank" rel="noopener noreferrer">
              <div className="h-8 mr-2 inline-block">
                <InstagramIcon />
              </div>
              Instagram</Link></li>
            <li><Link href="https://www.youtube.com/@familogue" target="_blank" rel="noopener noreferrer">
              <div className="h-8 mr-2 inline-block">
                <YouTubeIcon />
              </div>
              YouTube</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}