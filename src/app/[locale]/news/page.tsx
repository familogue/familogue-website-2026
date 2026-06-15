import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { getAllNews } from "@/utils/sdk/news";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "News", "/news");
}

export default async function Page() {
  const locale = await getLocale();
  const posts = getAllNews(locale);
  const t = await getTranslations("News");
  return (
    <div className="x-container prose">
      <h1>{t("title")}</h1>
      {posts.map((post) => (
        <section key={post.slug} className="mb-8 border-b pb-6 last:border-b-0">
          <p className="not-prose text-sm text-gray-500 mb-1">{post.date}</p>
          <h2 className="mt-0">
            <Link href={`/news/${post.slug}`} className="no-underline hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-700">{extractExcerpt(post.body)}</p>
          <p>
            <Button asChild className="not-prose" variant="accent" size="lg">
              <Link href={`/news/${post.slug}`}>{t("readMore")} &rarr;</Link>
            </Button>
          </p>
        </section>
      ))}
    </div>
  );
}
