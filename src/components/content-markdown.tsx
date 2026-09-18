import Markdown from "markdown-to-jsx";
import { getTranslations } from "next-intl/server";
import * as React from "react";

import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";

/** Absolute URLs, including protocol-relative ones. */
const EXTERNAL = /^(https?:)?\/\//i;
/** Schemes handed off to another app rather than navigated to. */
const HANDOFF_SCHEME = /^(mailto:|tel:|sms:)/i;
/** A trailing file extension marks a static file (`/assets/notice.pdf`). */
const STATIC_FILE = /\.[a-z0-9]+$/i;
/** A locale segment written into the content by hand (`/zh/our-services/...`). */
const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(?=/|$)`, "i");

/**
 * Arrow marking a link that leaves the site. Sized in `em` so it tracks the
 * surrounding text.
 */
function ExternalArrowGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="ml-0.5 inline-block size-[0.8em] align-[0.05em]"
    >
      <path
        d="M6 10l4-4m0 0H6.5M10 6v3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type MarkdownLinkProps = React.ComponentProps<"a"> & { newTabLabel: string };

/**
 * A link inside markdown content.
 *
 * Markdown bodies previously set `target="_blank"` on every link regardless of
 * destination, which sent in-site links to a new tab and opened an orphan tab
 * ahead of `mailto:`/`tel:` handoffs. Each kind of destination is now handled
 * on its own terms:
 *
 * - external        new tab, with an arrow and a note for screen readers
 * - mailto/tel/#    same tab, no `rel`
 * - static files    same tab, and never locale-prefixed — `/assets/x.pdf`
 *                   is a file on disk, so routing it would 404
 * - in-site routes  rendered through next-intl's `Link`, so an English page
 *                   links on to English and a Chinese page to Chinese
 */
function MarkdownLink({ href = "", newTabLabel, children, ...props }: MarkdownLinkProps) {
  if (EXTERNAL.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <ExternalArrowGlyph />
        <span className="sr-only"> {newTabLabel}</span>
      </a>
    );
  }

  if (HANDOFF_SCHEME.test(href) || href.startsWith("#") || STATIC_FILE.test(href)) {
    return <a href={href} {...props}>{children}</a>;
  }

  // Strip any hand-written locale segment before handing the path to `Link`,
  // which adds the reader's own locale back. Without this, existing content
  // written as `/zh/our-services/x` would come out as `/zh/zh/our-services/x`.
  const path = href.replace(LOCALE_PREFIX, "") || "/";

  return <Link href={path} {...props}>{children}</Link>;
}

/**
 * Shared renderer for the markdown stored in `content/*.json`. Both the news
 * and service detail pages render bodies from the same source, so the options
 * live here rather than being repeated per page and drifting apart.
 */
export async function ContentMarkdown({ children }: { children: string }) {
  const t = await getTranslations("General");
  const newTabLabel = t("opensInNewTab");

  return (
    <Markdown
      options={{
        overrides: {
          img: { component: "img" },
          a: {
            component: (props: React.ComponentProps<"a">) => (
              <MarkdownLink newTabLabel={newTabLabel} {...props} />
            ),
          },
        },
      }}
    >
      {children}
    </Markdown>
  );
}
