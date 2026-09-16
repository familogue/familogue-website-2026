import { ServiceCategory } from "src/types";
import { CATEGORY_THEME } from "@/utils/category-theme";

const BLOB_PATH = "M428.369,63.574c312.786,-0.083 444.447,162.409 466.66,349.895c22.212,187.485 -252.35,570.961 -563.973,362.682c-311.624,-208.28 -363.983,-442.344 -307.421,-573.084c56.562,-130.741 266.297,-139.457 404.734,-139.493Z";

/** The leaflet's coloured organic shape, reused inline (not the fixed spinning background blob). */
export const CategoryBlob: React.FC<{
  category: ServiceCategory;
  className?: string;
  children?: React.ReactNode;
}> = ({ category, className = "", children }) => {
  const theme = CATEGORY_THEME[category];
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 900 900"
        aria-hidden
        className={`absolute inset-0 h-full w-full ${theme.blobFill}`}
        fill="currentColor"
      >
        <path d={BLOB_PATH} />
      </svg>
      {children && (
        <div className={`relative flex h-full w-full items-center justify-center p-6 text-center ${theme.onBlob}`}>
          {children}
        </div>
      )}
    </div>
  );
};
