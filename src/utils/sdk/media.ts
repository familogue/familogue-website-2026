import fs from "fs";
import path from "path";
import { MediaRecord } from "src/types";

export function getAllMedia(): MediaRecord[] {
  const filePath = path.join(process.cwd(), "content/media.json");
  const { media }: { media: MediaRecord[] } = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return media
    .filter(r => r.status === "Published")
    .sort((a, b) => b.date.localeCompare(a.date));
}
