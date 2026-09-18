import * as React from "react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type LinkOwnProps = {
  className?: string;
};

// `external` discriminates between the locale-aware next-intl `Link` (for
// internal routes) and a plain `<a>` (for absolute/external URLs, which
// next-intl's `Link` would otherwise try to localise).
type InternalLinkProps = LinkOwnProps &
  React.ComponentProps<typeof Link> & { external?: false };
type ExternalLinkProps = LinkOwnProps &
  React.ComponentProps<"a"> & { external: true };

export type TextLinkProps = InternalLinkProps | ExternalLinkProps;
export type ArrowLinkProps = InternalLinkProps | ExternalLinkProps;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 rounded-sm";

/**
 * Bare right-arrow glyph, on its own. Use this (instead of ArrowLink) when
 * the arrow needs to sit inside a larger clickable element — e.g. a heading
 * inside a card that is already wrapped in an `<a>` — where a nested link
 * would be invalid HTML.
 */
function ArrowGlyph({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        // Sized in `em` so the arrow tracks whatever text it follows — the
        // same glyph sits in an <h2> and in body copy. `align-[-0.125em]`
        // is the usual nudge to sit an inline icon on the text baseline.
        "inline-block size-[1em] align-[-0.125em] motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5",
        className
      )}
      {...props}
    >
      <path
        d="M4 8h8m0 0-3.5-3.5M12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Inline text link for prose/body copy. Always underlined — this is
 * deliberate and must not be "cleaned up": WCAG 1.4.1 (Use of Colour)
 * requires links within a block of text to be distinguishable by more
 * than colour alone, so the underline stays even though it looks busier
 * than ArrowLink's hover-only underline.
 */
function TextLink({ className, ...props }: TextLinkProps) {
  const classes = cn(
    "text-link underline underline-offset-4 hover:text-link-hover",
    focusRing,
    className
  );

  if (props.external) {
    const { external: _external, ...anchorProps } = props;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...anchorProps}
      />
    );
  }

  const { external: _external, ...linkProps } = props;
  return <Link className={classes} {...linkProps} />;
}

/**
 * Standalone/heading/card link: teal, underlined only on hover, followed
 * by an inline arrow. The arrow is an SVG (not a `→` character) so it
 * can't wrap away from the text and keeps stable spacing under Chinese
 * text on this bilingual site.
 */
function ArrowLink({ className, children, ...props }: ArrowLinkProps) {
  // Deliberately NOT inline-flex: a flex container makes the label and the
  // arrow siblings, so on a link that wraps to two lines the arrow is laid
  // out against the right edge and vertically centred instead of following
  // the last character. Normal inline flow is what we want.
  const classes = cn(
    "group text-link no-underline hover:text-link-hover",
    focusRing,
    className
  );

  // The underline lives on the label, not the anchor, so it doesn't paint
  // under the arrow. The non-breaking space both provides the gap and stops
  // the arrow from wrapping onto a line of its own.
  const label = (
    <>
      <span className="group-hover:underline">{children}</span>
      {" "}
      <ArrowGlyph />
    </>
  );

  if (props.external) {
    const { external: _external, ...anchorProps } = props;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...anchorProps}
      >
        {label}
      </a>
    );
  }

  const { external: _external, ...linkProps } = props;
  return (
    <Link className={classes} {...linkProps}>
      {label}
    </Link>
  );
}

export { ArrowGlyph, ArrowLink, TextLink };
