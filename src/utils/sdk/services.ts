import fs from "fs";
import path from "path";
import { ServiceRecord } from "src/types";

type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  image: string | null;
  position: number;
  status: string;
};

export function getAllServices(locale: string): ServiceRecord[] {
  const filePath = path.join(process.cwd(), "content/services.json");
  const { services: rows }: { services: ServiceRow[] } = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return rows
    .filter(r => r.status === "Published")
    .sort((a, b) => a.position - b.position)
    .map(r => ({
      title: locale === "zh" ? r.title : r.title_en,
      content: locale === "zh" ? r.content : r.content_en,
      slug: r.slug,
      image: r.image ? [r.image] : [],
    }));
}
