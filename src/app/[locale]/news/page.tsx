import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import img from "./voting-member.png";

export const metadata: Metadata = {
  title: "資訊中心",
  description: "Familogue 語你童行的最新消息和活動更新",
  openGraph: {
    title: "資訊中心",
    description: "Familogue 語你童行的最新消息和活動更新",
    url: process.env.SITE_URL + "/news",
    siteName: "Familogue 語你童行",
    type: "website",
    images: [
      {
        url: process.env.SITE_OG_IMAGE || "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function Page() {
  const link = "https://store.familogue.ca/items/b82eaa1c-e929-4dcb-bf78-f8fe3822a332";
  const t = await getTranslations();
  return (
    <div className="prose">
      <h1>資訊中心 News</h1>
      <h2>立即登記成為我們的投票會員，共同打造屬於你的語你童行。<br />Join us as a voting member and help us build Familogue together.</h2>
      <aside>2026-05-21</aside>
      <p><Link href={link}><Image src={img} alt="voting-member" /></Link></p>
      <p><Link className="x-button" href={link}>{t("General.view_details")} &rarr;</Link></p>
    </div>
  );
}

