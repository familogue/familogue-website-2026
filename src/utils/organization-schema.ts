import { bcp47For } from "./alternates";
import { siteConfig } from "./site-config";

const ORGANIZATION_ID = `${siteConfig.baseUrl}/#organization`;
const WEBSITE_ID = `${siteConfig.baseUrl}/#website`;
const RICHMOND_ID = `${siteConfig.baseUrl}/#richmond-service-centre`;
const VANCOUVER_ID = `${siteConfig.baseUrl}/#vancouver-satellite-site`;

/** Public profiles that let search and answering engines resolve this entity. */
const SAME_AS = [
  "https://www.facebook.com/Familogue",
  "https://www.instagram.com/familogue",
  "https://www.youtube.com/@familogue",
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

const RICHMOND_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "8181 Cambie Rd. Unit 5530",
  addressLocality: "Richmond",
  addressRegion: "BC",
  postalCode: "V6X 1J8",
  addressCountry: "CA",
};

const VANCOUVER_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "8506 Ash Street",
  addressLocality: "Vancouver",
  addressRegion: "BC",
  postalCode: "V6P 3M2",
  addressCountry: "CA",
};

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
        logo: `${siteConfig.baseUrl}/images/og-image.png`,
        image: `${siteConfig.baseUrl}/images/og-image.png`,
        description: siteConfig.description,
        foundingDate: "2022",
        foundingLocation: { "@type": "Place", name: "British Columbia, Canada" },
        telephone: "+17789910902",
        email: "info@familogue.ca",
        address: RICHMOND_ADDRESS,
        location: [{ "@id": RICHMOND_ID }, { "@id": VANCOUVER_ID }],
        areaServed: AREA_SERVED,
        knowsLanguage: KNOWS_LANGUAGE,
        sameAs: SAME_AS,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+17789910902",
            email: "info@familogue.ca",
            availableLanguage: ["yue", "zh-Hant", "en"],
            areaServed: "CA",
          },
        ],
      },
      {
        "@type": ["LocalBusiness", "EducationalOrganization"],
        "@id": RICHMOND_ID,
        name: "Familogue Richmond Service Centre",
        parentOrganization: { "@id": ORGANIZATION_ID },
        url: siteConfig.baseUrl,
        telephone: "+17789910902",
        email: "info@familogue.ca",
        address: RICHMOND_ADDRESS,
        areaServed: AREA_SERVED,
        knowsLanguage: KNOWS_LANGUAGE,
      },
      {
        "@type": "Place",
        "@id": VANCOUVER_ID,
        name: "Familogue Vancouver Satellite Site",
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
