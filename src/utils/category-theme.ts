import { ServiceCategory } from "src/types";

/**
 * Category colours reuse the palette already used by <Decorations />, so the
 * category blobs and the background blobs never clash.
 * Leaflet mapping: Language = orange/amber, Therapeutic = teal/emerald, Community = yellow.
 */
export const CATEGORY_THEME: Record<ServiceCategory, {
  /** Readable-on-background colour for links and small labels. */
  text: string;
  /** Solid fill for the blob and other large shapes. */
  blobFill: string;
  /** Text colour that stays legible on top of blobFill. */
  onBlob: string;
  bg: string; softBg: string; border: string; hex: string;
}> = {
  "language-acquisition": {
    text: "text-amber-600", blobFill: "text-amber-500", onBlob: "text-white",
    bg: "bg-amber-500", softBg: "bg-amber-100", border: "border-amber-500", hex: "#f59e0b",
  },
  "therapeutic-services": {
    text: "text-emerald-700", blobFill: "text-emerald-500", onBlob: "text-white",
    bg: "bg-emerald-500", softBg: "bg-emerald-100", border: "border-emerald-500", hex: "#10b981",
  },
  "community-services": {
    // yellow-400 is too light for white text — the leaflet uses dark brown on yellow.
    text: "text-yellow-700", blobFill: "text-yellow-400", onBlob: "text-yellow-950",
    bg: "bg-yellow-400", softBg: "bg-yellow-100", border: "border-yellow-400", hex: "#facc15",
  },
};

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}
