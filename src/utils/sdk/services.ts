import fs from "fs";
import path from "path";
import { ServiceCategory, ServiceRecord } from "src/types";

type ServiceRow = {
  slug: string;
  title: string;
  title_en: string;
  category: ServiceCategory;
  content: string;
  content_en: string;
  image: string | null;
  status: string;
};

/** Display order of the three service categories. Structural — not editor-controlled. */
export const CATEGORY_ORDER: ServiceCategory[] = [
  "language-acquisition",
  "therapeutic-services",
  "community-services",
];

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
    category: r.category,
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

/** Published services bucketed by category, in CATEGORY_ORDER. Empty categories are dropped. */
export function getServicesByCategory(locale: string): { category: ServiceCategory; services: ServiceRecord[]; }[] {
  const all = getAllServices(locale);
  return CATEGORY_ORDER
    .map(category => ({ category, services: all.filter(s => s.category === category) }))
    .filter(group => group.services.length > 0);
}
