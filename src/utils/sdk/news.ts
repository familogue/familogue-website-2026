import fs from "fs";
import path from "path";

type NewsRow = {
  slug: string;
  title: string;
  title_en: string;
  body: string;
  body_en: string;
  date: string;
  author: string;
  featured_image: string | null;
  status: string;
  featured?: boolean;
};

export type NewsPost = {
  slug: string;
  title: string;
  body: string;
  date: string;
  author: string;
  featured_image: string | null;
};

function loadRows(): NewsRow[] {
  const filePath = path.join(process.cwd(), "content/news.json");
  const { news: rows }: { news: NewsRow[] } = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return rows;
}

function toPost(r: NewsRow, locale: string): NewsPost {
  return {
    slug: r.slug,
    title: locale === "zh" ? r.title : r.title_en,
    body: locale === "zh" ? r.body : r.body_en,
    date: r.date,
    author: r.author,
    featured_image: r.featured_image ?? null,
  };
}

export function getAllNews(locale: string): NewsPost[] {
  return loadRows()
    .filter(r => r.status === "Published")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(r => toPost(r, locale));
}

export function getFeaturedNews(locale: string): NewsPost[] {
  return loadRows()
    .filter(r => r.status === "Published" && r.featured === true)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(r => toPost(r, locale));
}

export function getNewsBySlug(slug: string, locale: string): NewsPost | undefined {
  const row = loadRows().find(r => r.slug === slug && r.status === "Published");
  return row ? toPost(row, locale) : undefined;
}
