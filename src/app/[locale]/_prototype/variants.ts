// PROTOTYPE — throwaway. Branch prototype/link-accent-colour. Delete before merging to main.
//
// Four colour/affordance strategies for link and accent-button colour,
// answering: "what teal should links/CTA be, and does it collide with the
// emerald already used for the therapeutic-services category?"

import type { CATEGORY_THEME } from "@/utils/category-theme";

export type ProtoVariantKey = "A" | "B" | "C" | "D";

export interface ProtoVariant {
  key: ProtoVariantKey;
  name: string;
  /** Link colour (CSS colour string, or "var(--foreground)" for variant D). */
  link: string;
  linkHover: string;
  /** Accent/CTA button colour. */
  cta: string;
  ctaHover: string;
  linkUnderline: "always" | "hover";
  /** Bottom-rule colour for .x-section-heading within this variant's scope. */
  headingRule: string;
  /** Only set for variant B — recolours therapeutic-services to green. */
  categoryOverride?: Partial<(typeof CATEGORY_THEME)[keyof typeof CATEGORY_THEME]>;
}

export const PROTOTYPE_VARIANTS: ProtoVariant[] = [
  {
    key: "A",
    name: "Teal links, category untouched",
    link: "#0f766e", // teal-700
    linkHover: "#115e59", // teal-800
    cta: "#0f766e",
    ctaHover: "#115e59",
    linkUnderline: "hover",
    headingRule: "#10b981", // unchanged emerald-500
  },
  {
    key: "B",
    name: "Teal links, category recoloured green",
    link: "#0f766e",
    linkHover: "#115e59",
    cta: "#0f766e",
    ctaHover: "#115e59",
    linkUnderline: "hover",
    headingRule: "#0f766e", // becomes the link teal in this variant
    categoryOverride: {
      text: "text-green-700",
      blobFill: "text-green-600",
      onBlob: "text-white",
      bg: "bg-green-600",
      softBg: "bg-green-100",
      border: "border-green-600",
      hex: "#16a34a",
    },
  },
  {
    key: "C",
    name: "Cyan-leaning teal links, category untouched",
    link: "#155e75", // cyan-800
    linkHover: "#164e63", // cyan-900
    cta: "#0e7490", // cyan-700
    ctaHover: "#155e75",
    linkUnderline: "hover",
    headingRule: "#10b981",
  },
  {
    key: "D",
    name: "Ink links, teal CTA",
    link: "var(--foreground)",
    linkHover: "var(--foreground)",
    cta: "#0f766e",
    ctaHover: "#115e59",
    linkUnderline: "always",
    headingRule: "#10b981",
  },
];

export function resolveVariant(raw: string | undefined): ProtoVariant {
  return (
    PROTOTYPE_VARIANTS.find((v) => v.key === raw) ?? PROTOTYPE_VARIANTS[0]
  );
}
