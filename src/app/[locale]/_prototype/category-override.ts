// PROTOTYPE — throwaway. Branch prototype/link-accent-colour. Delete before merging to main.

import { CATEGORY_THEME } from "@/utils/category-theme";
import type { ServiceCategory } from "src/types";
import { PROTOTYPE_VARIANTS, type ProtoVariantKey } from "./variants";

/**
 * Returns CATEGORY_THEME with the active variant's categoryOverride merged
 * in (only variant B overrides therapeutic-services, to green). Does not
 * mutate the real CATEGORY_THEME.
 */
export function getProtoCategoryTheme(
  variantKey: ProtoVariantKey
): Record<ServiceCategory, (typeof CATEGORY_THEME)[ServiceCategory]> {
  const variant = PROTOTYPE_VARIANTS.find((v) => v.key === variantKey);
  if (!variant?.categoryOverride) return CATEGORY_THEME;

  return {
    ...CATEGORY_THEME,
    "therapeutic-services": {
      ...CATEGORY_THEME["therapeutic-services"],
      ...variant.categoryOverride,
    },
  };
}
