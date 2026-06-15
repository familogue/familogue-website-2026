import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getAllNews } from "@/utils/sdk/news";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "News", "/news");
}

export default async function Page() {
  const locale = await getLocale();
  const posts = getAllNews(locale);
  const t = await getTranslations();
  return (
    <div className="x-container prose">
      <h1>{t("News.title")}</h1>
      {posts.map((post) => (
        <section key={post.slug} className="sm:flex sm:items-start gap-4 mb-8 border-b pb-6 last:border-b-0 not-prose">
          <Link href={`/news/${post.slug}`} className="shrink-0">
            <Image
              src={post.featured_image ?? "/images/og-image.png"}
              alt={post.title}
              width={320}
              height={180}
              className="aspect-[16/9] object-cover w-full sm:w-[320px]"
            />
          </Link>
          <div className="flex-1 mt-3 sm:mt-0">
            <h2 className="mt-0 text-xl font-semibold">
              <Link href={`/news/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-700">{extractExcerpt(post.body)}</p>
            <p>
              <Button asChild variant="accent" size="lg">
                <Link href={`/news/${post.slug}`}>{t("General.view_details")} &rarr;</Link>
              </Button>
            </p>
            <p className="text-sm text-gray-500 mb-1">{t("News.postedOn")} {post.date}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
