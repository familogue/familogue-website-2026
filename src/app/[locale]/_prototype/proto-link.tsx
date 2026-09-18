// PROTOTYPE — throwaway. Branch prototype/link-accent-colour. Delete before merging to main.

import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      className={`inline-block transition-transform group-hover/arrow:translate-x-0.5 ${className}`}
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Heading/standalone link: coloured via variant scope, arrow nudges right on hover. */
export function ProtoArrowLink({
  href,
  className = "",
  children,
  ...rest
}: ComponentProps<typeof Link> & { href: string }) {
  return (
    <Link
      href={href}
      className={`proto-link group/arrow inline-flex items-center gap-1 ${className}`}
      {...rest}
    >
      {children}
      <ArrowGlyph className="proto-arrow" />
    </Link>
  );
}

/** Plain (non-link) arrow treatment, e.g. media headline rows. */
export function ProtoArrow({ className = "" }: { className?: string }) {
  return <ArrowGlyph className={`proto-arrow ${className}`} />;
}
