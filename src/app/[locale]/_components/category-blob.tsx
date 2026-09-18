import { ServiceCategory } from "src/types";
import { CATEGORY_THEME } from "@/utils/category-theme";

const BLOB_PATH = "M428.369,63.574c312.786,-0.083 444.447,162.409 466.66,349.895c22.212,187.485 -252.35,570.961 -563.973,362.682c-311.624,-208.28 -363.983,-442.344 -307.421,-573.084c56.562,-130.741 266.297,-139.457 404.734,-139.493Z";

/** Must match the duration of `.x-animate-slow-spin` in globals.css. */
const SPIN_DURATION_SECONDS = 40;

/**
 * The leaflet's coloured organic shape, reused inline (not the fixed spinning
 * background blob).
 *
 * `spinOffsetDeg` staggers where each shape sits in the rotation. A negative
 * animation-delay starts the animation already part-way through, which is the
 * only way to phase-shift without fighting the keyframes' own transform.
 */
export const CategoryBlob: React.FC<{
  category: ServiceCategory;
  className?: string;
  spinOffsetDeg?: number;
  children?: React.ReactNode;
  /* PROTOTYPE hook */
  themeOverride?: typeof CATEGORY_THEME;
}> = ({ category, className = "", spinOffsetDeg = 0, children, themeOverride }) => {
  const theme = (themeOverride ?? CATEGORY_THEME)[category];
  const animationDelay = `-${(spinOffsetDeg / 360) * SPIN_DURATION_SECONDS}s`;

  return (
    <div className={`relative ${className}`}>
      {/* Only the shape rotates — the label sits in a separate, static layer. */}
      <svg
        viewBox="0 0 900 900"
        aria-hidden
        style={{ animationDelay }}
        className={`x-animate-slow-spin absolute inset-0 h-full w-full origin-center motion-reduce:animate-none ${theme.blobFill}`}
        fill="currentColor"
      >
        <path d={BLOB_PATH} />
      </svg>
      {children && (
        <div className={`relative flex h-full w-full items-center justify-center px-9 py-6 text-center ${theme.onBlob}`}>
          {children}
        </div>
      )}
    </div>
  );
};
