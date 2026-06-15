import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { getAllNews, getNewsBySlug } from "@/utils/sdk/news";
import { siteConfig } from "@/utils/site-config";
import Markdown from "markdown-to-jsx";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const posts = getAllNews(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getNewsBySlug(slug, locale);
  if (!post) return {};
  const excerpt = extractExcerpt(post.body, 160);
  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: excerpt,
    alternates: {
      canonical: `/${locale}/news/${slug}`,
      languages: {
        en: `/en/news/${slug}`,
        zh: `/zh/news/${slug}`,
      },
    },
    openGraph: {
      title: `${post.title} | ${siteConfig.name}`,
      description: excerpt,
      url: `/${locale}/news/${slug}`,
      siteName: siteConfig.name,
      type: "article",
      images: post.featured_image
        ? [{ url: post.featured_image, width: 1280, height: 720, alt: post.title }]
        : [{ url: "/images/og-image.png", width: 1600, height: 900, alt: siteConfig.name }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getNewsBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("News");

  return (
    <div className="x-container prose">
      <nav aria-label="breadcrumb" className="not-prose text-sm mb-4">
        <Link href="/news" className="hover:underline">{t("title")}</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span>{post.title}</span>
      </nav>
      {post.featured_image && (
        <Image
          src={post.featured_image}
          alt={post.title}
          width={1280}
          height={720}
          className="w-full aspect-[16/9] object-cover rounded-lg mb-6"
        />
      )}
      <p className="not-prose text-sm text-gray-500 mb-1">Date: {post.date}</p>
      <h1>{post.title}</h1>
      <Markdown
        options={{
          overrides: {
            img: { component: "img" },
            a: { props: { target: "_blank", rel: "noopener noreferrer" } },
          },
        }}
      >
        {post.body}
      </Markdown>
    </div>
  );
}
