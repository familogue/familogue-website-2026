import fs from "fs";
import path from "path";
import { MediaRecord } from "src/types";

type MediaRow = {
  outlet: string;
  headline: string;
  date: string;
  url: string;
  thumbnail: string;
  status: string;
};

function loadRows(): MediaRow[] {
  const filePath = path.join(process.cwd(), "content/media.json");
  const { media: rows }: { media: MediaRow[] } = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return rows;
}

export function getAllMedia(): MediaRecord[] {
  return loadRows()
    .filter(r => r.status === "Published")
    .sort((a, b) => b.date.localeCompare(a.date)) as MediaRecord[];
}
