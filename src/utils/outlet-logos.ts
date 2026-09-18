/**
 * Logo image per outlet, shared by the homepage strip and the full `/media`
 * list. Keyed by the `outlet` string used in `content/media.json`.
 */
export const OUTLET_LOGOS: Record<string, string> = {
  "Fairchild TV": "/images/logo-fairchildtv.jpg",
  "OMNI News": "/images/logo-omnitv.jpg",
  "One Night Talk": "/images/logo-onenighttalk.jpg",
  "UBC Asia Pacific": "/images/logo-ubc.jpg",
  // No published coverage from this outlet yet — kept ready for when there is.
  "The Toronto Star": "/images/logo-torontostar.jpg",
  "CBC News": "/images/logo-cbcnews.jpg",
};

/** Row thumbnail on the full `/media` list. */
export const LOGO_SIZE = 60;

/**
 * Homepage strip. Larger than the list thumbnail, and requested at twice the
 * rendered size so the logos stay sharp on a high-density screen.
 */
export const STRIP_LOGO_SIZE = 128;
