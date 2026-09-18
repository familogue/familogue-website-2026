/**
 * Single source of truth for Familogue's contact details: phone, email,
 * social/messaging links, physical locations and opening hours.
 *
 * `organization-schema.ts` (structured data), `footer.tsx` and
 * `contact-block.tsx` all derive from this file rather than repeating these
 * literals themselves.
 */

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

/**
 * A contiguous or non-contiguous group of days sharing the same hours.
 *
 * Times are stored as 24-hour `HH:mm` strings, never pre-formatted per
 * locale — display components format them at render time with
 * `Intl.DateTimeFormat`, which is the only way to get "11:00 a.m." in
 * English and "上午11:00" in Chinese from one value.
 */
export type OpeningHoursGroup =
  | { days: DayOfWeek[]; closed: true }
  | { days: DayOfWeek[]; closed?: false; opens: string; closes: string };

export type ContactLocation = {
  /** Stable key used for React keys, message lookups, etc. */
  key: "richmond" | "vancouver";
  /** Suffix appended to the site base URL for this location's schema `@id`. */
  idSuffix: string;
  name: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  /** Single-line address for display. */
  displayAddress: string;
  /** Google Maps link for this location. */
  mapsUrl: string;
  /**
   * Posted opening hours, grouped by shared schedule. Absent where a site has
   * none — which is why hours live on the location rather than at the top
   * level: nothing has to know by name which site they belong to.
   */
  openingHours?: OpeningHoursGroup[];
};

export const contactInfo = {
  phone: {
    e164: "+17789910902",
    display: "+1 (778) 991-0902",
  },
  email: "info@familogue.ca",
  whatsappUrl: "https://wa.me/17789910902",
  social: {
    facebook: "https://www.facebook.com/Familogue",
    instagram: "https://www.instagram.com/familogue",
    youtube: "https://www.youtube.com/@familogue",
  },
  locations: [
    {
      key: "richmond",
      idSuffix: "richmond-service-centre",
      name: "Familogue Richmond Service Centre",
      streetAddress: "8181 Cambie Rd. Unit 5530",
      addressLocality: "Richmond",
      addressRegion: "BC",
      postalCode: "V6X 1J8",
      addressCountry: "CA",
      displayAddress: "8181 Cambie Rd. Unit 5530, Richmond, BC V6X 1J8",
      mapsUrl: "https://maps.app.goo.gl/wopnafQpovYgxuBH6",
      openingHours: [
        { days: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "11:00", closes: "16:00" },
        { days: ["Saturday"], opens: "09:30", closes: "12:30" },
        { days: ["Sunday", "Monday"], closed: true },
      ],
    },
    {
      key: "vancouver",
      idSuffix: "vancouver-satellite-site",
      name: "Familogue Vancouver Satellite Site",
      streetAddress: "8506 Ash Street",
      addressLocality: "Vancouver",
      addressRegion: "BC",
      postalCode: "V6P 3M2",
      addressCountry: "CA",
      displayAddress: "8506 Ash Street, Vancouver, BC V6P 3M2",
      mapsUrl: "https://maps.app.goo.gl/Nzo5ehY8aTSwdugM6",
      // No posted hours by decision — do not infer any from Richmond's.
    },
  ] as ContactLocation[],
};
