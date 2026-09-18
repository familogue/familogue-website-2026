import { bcp47For } from "./alternates";
import { contactInfo, type OpeningHoursGroup } from "./contact-info";
import { siteConfig } from "./site-config";

const ORGANIZATION_ID = `${siteConfig.baseUrl}/#organization`;
const WEBSITE_ID = `${siteConfig.baseUrl}/#website`;

const RICHMOND = contactInfo.locations.find((l) => l.key === "richmond")!;
const VANCOUVER = contactInfo.locations.find((l) => l.key === "vancouver")!;

const RICHMOND_ID = `${siteConfig.baseUrl}/#${RICHMOND.idSuffix}`;
const VANCOUVER_ID = `${siteConfig.baseUrl}/#${VANCOUVER.idSuffix}`;

/** Public profiles that let search and answering engines resolve this entity. */
const SAME_AS = [
  contactInfo.social.facebook,
  contactInfo.social.instagram,
  contactInfo.social.youtube,
];

/**
 * Languages the organization actually serves families in. Cantonese (`yue`) is
 * listed explicitly — it is the language most people search this service by,
 * and `zh` alone does not express it.
 */
const KNOWS_LANGUAGE = [
  { "@type": "Language", name: "Cantonese", alternateName: "yue" },
  { "@type": "Language", name: "Traditional Chinese", alternateName: "zh-Hant" },
  { "@type": "Language", name: "English", alternateName: "en" },
];

const AREA_SERVED = [
  { "@type": "City", name: "Vancouver", addressRegion: "BC", addressCountry: "CA" },
  { "@type": "City", name: "Richmond", addressRegion: "BC", addressCountry: "CA" },
  { "@type": "City", name: "Burnaby", addressRegion: "BC", addressCountry: "CA" },
  { "@type": "AdministrativeArea", name: "Metro Vancouver, British Columbia, Canada" },
];

function postalAddress(location: typeof RICHMOND) {
  return {
    "@type": "PostalAddress",
    streetAddress: location.streetAddress,
    addressLocality: location.addressLocality,
    addressRegion: location.addressRegion,
    postalCode: location.postalCode,
    addressCountry: location.addressCountry,
  };
}

const RICHMOND_ADDRESS = postalAddress(RICHMOND);
const VANCOUVER_ADDRESS = postalAddress(VANCOUVER);

/**
 * `openingHours` groups -> schema.org `OpeningHoursSpecification` entries.
 * Closed days use `opens`/`closes` of `"00:00"` — Google's documented way to
 * express a closed day, since `OpeningHoursSpecification` has no boolean for it.
 */
function openingHoursSpecification(groups: OpeningHoursGroup[]) {
  return groups.map((group) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: group.days.map((day) => `https://schema.org/${day}`),
    opens: group.closed ? "00:00" : group.opens,
    closes: group.closed ? "00:00" : group.closes,
  }));
}

const RICHMOND_OPENING_HOURS = openingHoursSpecification(RICHMOND.openingHours ?? []);

/**
 * Site-wide entity graph, rendered once in the root layout.
 *
 * Modelled as a `@graph` so the organization, its two physical sites and the
 * website are distinct nodes with stable `@id`s that other pages can reference,
 * rather than a single node with an invalid `location` array.
 */
export function organizationSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["NGO", "Organization"],
        "@id": ORGANIZATION_ID,
        name: siteConfig.name,
        alternateName: ["語你童行", "Familogue", "Familogue Education Society"],
        url: siteConfig.baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.baseUrl}/familogue-icon.png`,
          width: 828,
          height: 827,
        },
        image: `${siteConfig.baseUrl}/images/og-image.png`,
        description: siteConfig.description,
        foundingDate: "2022",
        foundingLocation: { "@type": "Place", name: "British Columbia, Canada" },
        telephone: contactInfo.phone.e164,
        email: contactInfo.email,
        address: RICHMOND_ADDRESS,
        // This node shares Richmond's address/telephone, so it carries the
        // same posted hours as the Richmond LocalBusiness node below.
        openingHoursSpecification: RICHMOND_OPENING_HOURS,
        location: [{ "@id": RICHMOND_ID }, { "@id": VANCOUVER_ID }],
        areaServed: AREA_SERVED,
        knowsLanguage: KNOWS_LANGUAGE,
        sameAs: SAME_AS,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: contactInfo.phone.e164,
            email: contactInfo.email,
            availableLanguage: ["yue", "zh-Hant", "en"],
            areaServed: "CA",
          },
        ],
      },
      {
        "@type": ["LocalBusiness", "EducationalOrganization"],
        "@id": RICHMOND_ID,
        name: RICHMOND.name,
        parentOrganization: { "@id": ORGANIZATION_ID },
        url: siteConfig.baseUrl,
        telephone: contactInfo.phone.e164,
        email: contactInfo.email,
        address: RICHMOND_ADDRESS,
        areaServed: AREA_SERVED,
        knowsLanguage: KNOWS_LANGUAGE,
        openingHoursSpecification: RICHMOND_OPENING_HOURS,
      },
      {
        "@type": "Place",
        "@id": VANCOUVER_ID,
        name: VANCOUVER.name,
        address: VANCOUVER_ADDRESS,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: siteConfig.baseUrl,
        name: siteConfig.name,
        inLanguage: bcp47For(locale),
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}
