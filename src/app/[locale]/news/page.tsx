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
      <p><Link href={link}><Image src={img} alt="voting-member" /></Link></p>
      <h2>Annual General Meeting Notice 週年會員大會通知</h2>
      <p>NOTICE IS HEREBY GIVEN that the Annual General Meeting (AGM) of Familogue Education
        Society will be held as follows:<br />
        現通知 語你童行將舉行週年會員大會（AGM），詳情如下：</p>
      <p>Date 日期: 2026, Jun 20 (Sat)</p>
      <p>Time 時間: 1:30 – 2:00pm</p>
      <p>Location 地點: Multipurpose Room 1, Thompson Community Centre (5151 Granville Ave, Richmond,
        BC V7C 1E6)</p>
      <p>Virtual 線上會議： https://meet.google.com/pmf-mckb-icy)<br />Or dial:
        (CA) +1 587-688-7972 PIN: 837 217 309#</p>
      <h4>Agenda 議程:</h4>
      <ol>
        <li>Directors’ report
          董事會報告</li>
        <li>Presentation of financial statements
          財務報表匯報</li>
        <li>Election of Board of Directors of 2026-2027
          選舉 2026-2027 年度董事會</li>
        <li>Other business
          其他事項</li>
      </ol>
      <p>All members in good standing are entitled to attend and all voting members in good standing are
        entitled to vote at the meeting.</p>
      <p>所有良好狀態會員均可出席，而所有良好狀態而擁有投票權的會員均可在會議投票。</p>
      <p>By order of the Board, 承董事會命</p>
      <p>Ms Felicia Cheung (Chairman, Familogue Education Society)</p>
      <p>May 19, 2026</p>
      <Link href="/assets/Familogue_AGM_Notice.pdf">Download AGM Notice PDF</Link>
      <p><Link className="x-button" href={link}>✨ Voting Member Registration &rarr;</Link></p>
    </div>
  );
}

