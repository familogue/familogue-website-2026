import fs from "fs";
import path from "path";
import { ServiceRecord } from "src/types";

type ServiceRow = {
  slug: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image: string | null;
  status: string;
};

function loadRows(): ServiceRow[] {
  const filePath = path.join(process.cwd(), "content/services.json");
  const { services: rows }: { services: ServiceRow[] } = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return rows;
}

function toRecord(r: ServiceRow, locale: string): ServiceRecord {
  return {
    title: locale === "zh" ? r.title : r.title_en,
    content: locale === "zh" ? r.content : r.content_en,
    slug: r.slug,
    image: r.image ? [r.image] : [],
  };
}

export function getAllServices(locale: string): ServiceRecord[] {
  return loadRows()
    .filter(r => r.status === "Published")
    .map(r => toRecord(r, locale));
}

export function getServiceBySlug(slug: string, locale: string): ServiceRecord | null {
  const row = loadRows().find(r => r.slug === slug && r.status === "Published");
  return row ? toRecord(row, locale) : null;
}
