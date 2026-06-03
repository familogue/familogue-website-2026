#!/usr/bin/env node
/**
 * One-time migration: web_posts_rows.csv → content/services.json + public/images/
 */
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Parse the CSV (handles quoted multiline fields, no external deps)
// ---------------------------------------------------------------------------
function parseCsv(text) {
  const rows = [];
  let field = "";
  let inQuotes = false;
  let currentRow = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        currentRow.push(field);
        field = "";
      } else if (ch === "\r" && next === "\n") {
        currentRow.push(field);
        field = "";
        rows.push(currentRow);
        currentRow = [];
        i++;
      } else if (ch === "\n") {
        currentRow.push(field);
        field = "";
        rows.push(currentRow);
        currentRow = [];
      } else {
        field += ch;
      }
    }
  }
  // last field / row
  if (field || currentRow.length) {
    currentRow.push(field);
    rows.push(currentRow);
  }
  return rows;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`  skip (exists): ${path.basename(dest)}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const csvPath = path.join(ROOT, "web_posts_rows.csv");
const raw = fs.readFileSync(csvPath, "utf8");
const [header, ...dataRows] = parseCsv(raw);

console.log("Columns:", header);
console.log(`Rows: ${dataRows.length}`);

// Map column names → indices
const col = {};
header.forEach((h, i) => { col[h.trim()] = i; });

const imagesDir = path.join(ROOT, "public", "images");
fs.mkdirSync(imagesDir, { recursive: true });

const contentDir = path.join(ROOT, "content");
fs.mkdirSync(contentDir, { recursive: true });

const services = [];
const downloads = [];

for (const row of dataRows) {
  if (row.length < 2) continue; // skip empty trailing rows

  let slug = row[col["slug"]] ?? "";
  // Fix row 9: strip leading space and normalize U+2011 non-breaking hyphen → U+002D
  slug = slug.trim().replace(/‑/g, "-");

  const imageUrl = (row[col["image"]] ?? "").trim();
  let imageField = null;

  if (imageUrl) {
    const filename = imageUrl.split("/").pop();
    imageField = `/images/${filename}`;
    downloads.push({ url: imageUrl, filename });
  }

  services.push({
    id: Number(row[col["id"]]),
    slug,
    title: row[col["title"]] ?? "",
    title_en: row[col["title_en"]] ?? "",
    content: row[col["content"]] ?? "",
    content_en: row[col["content_en"]] ?? "",
    image: imageField,
    position: Number(row[col["position"]]),
    status: row[col["status"]] ?? "",
  });
}

// Write JSON
const jsonPath = path.join(contentDir, "services.json");
fs.writeFileSync(jsonPath, JSON.stringify(services, null, 2) + "\n");
console.log(`\nWrote ${services.length} records → content/services.json`);

// Verify row 9
const row9 = services.find((s) => s.id === 9);
console.log(`Row 9 slug: "${row9?.slug}"`);

// Download images
console.log(`\nDownloading ${downloads.length} images…`);
for (const { url, filename } of downloads) {
  const dest = path.join(imagesDir, filename);
  process.stdout.write(`  ${filename} … `);
  try {
    await downloadFile(url, dest);
    console.log("ok");
  } catch (err) {
    console.error(`FAILED: ${err.message}`);
    process.exit(1);
  }
}

console.log("\nDone.");
