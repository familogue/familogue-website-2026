// PROTOTYPE — throwaway. Branch prototype/link-accent-colour. Delete before merging to main.
//
// Hand-written CSS scoped to [data-proto-variant="X"]. Tailwind can't generate
// arbitrary runtime colour values, so a plain <style> tag is the right tool
// here rather than trying to force this through utility classes.

import type { ProtoVariant } from "./variants";

export function VariantStyles({ variant }: { variant: ProtoVariant }) {
  const scope = `[data-proto-variant="${variant.key}"]`;
  const underlineRule =
    variant.linkUnderline === "always"
      ? "text-decoration: underline;"
      : "text-decoration: none;";
  const underlineHoverRule =
    variant.linkUnderline === "always" ? "" : `${scope} .proto-link:hover { text-decoration: underline; }`;

  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
${scope} {
  --proto-link: ${variant.link};
  --proto-link-hover: ${variant.linkHover};
  --proto-cta: ${variant.cta};
  --proto-cta-hover: ${variant.ctaHover};
}

${scope} .proto-link,
${scope} .proto-prose-link {
  color: var(--proto-link);
  ${underlineRule}
}

${scope} .proto-link:hover,
${scope} .proto-prose-link:hover {
  color: var(--proto-link-hover);
}

${underlineHoverRule}

${scope} .proto-arrow {
  color: var(--proto-link);
}

${scope} .x-section-heading {
  border-bottom-color: ${variant.headingRule} !important;
}
`,
      }}
    />
  );
}
