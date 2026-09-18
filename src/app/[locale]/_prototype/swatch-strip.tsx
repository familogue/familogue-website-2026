// PROTOTYPE — throwaway. Branch prototype/link-accent-colour. Delete before merging to main.

import { contrastRatio } from "./contrast";
import type { ProtoVariant } from "./variants";
import { CATEGORY_THEME } from "@/utils/category-theme";

// Matches --background: oklch(0.99 0.02 95.15), the warm cream page background.
const PAGE_BACKGROUND_HEX = "#FDFBF3";

function Swatch({ label, hex }: { label: string; hex: string }) {
  const ratio = contrastRatio(hex, PAGE_BACKGROUND_HEX);
  const fail = ratio < 4.5;
  return (
    <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2">
      <span
        aria-hidden
        className="h-5 w-5 shrink-0 rounded-full border border-black/10"
        style={{ backgroundColor: hex }}
      />
      <div className="text-xs leading-tight">
        <div className="font-semibold">{label}</div>
        <div className="text-stone-500">
          {hex} · {ratio.toFixed(2)}:1
        </div>
      </div>
      {fail && (
        <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
          FAIL
        </span>
      )}
    </div>
  );
}

export function SwatchStrip({
  variant,
  categoryTheme,
}: {
  variant: ProtoVariant;
  categoryTheme: typeof CATEGORY_THEME;
}) {
  const linkHex = variant.link.startsWith("var(") ? "#1c1917" /* --foreground approx */ : variant.link;

  return (
    <div className="mb-8 flex flex-wrap gap-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3">
      <Swatch label="Link" hex={linkHex} />
      <Swatch label="CTA" hex={variant.cta} />
      <Swatch label="Therapeutic" hex={categoryTheme["therapeutic-services"].hex} />
      <Swatch label="Language" hex={categoryTheme["language-acquisition"].hex} />
      <Swatch label="Community" hex={categoryTheme["community-services"].hex} />
    </div>
  );
}
