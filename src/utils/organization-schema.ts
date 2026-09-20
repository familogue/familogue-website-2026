import { bcp47For } from "./alternates";
import { contactInfo, type OpeningHoursGroup } from "./contact-info";
import { isClinicalService, ORGANIZATION_MEDICAL_SPECIALTY } from "./medical-schema";
import { siteConfig } from "./site-config";
// This file was previously pure data with no filesystem access. Pulling in
// `getAllMedia` gives it an `fs` read of content/media.json — that's fine
// since `organizationSchema` is only ever called from the server-rendered
// root layout, never from the client.
import { getAllMedia } from "./sdk/media";
import { getAllServices } from "./sdk/services";

export const ORGANIZATION_ID = `${siteConfig.baseUrl}/#organization`;
export const WEBSITE_ID = `${siteConfig.baseUrl}/#website`;

/**
 * Stable `@id`s for entities that more than one page describes.
 *
 * A service page and the organization graph both talk about the same service;
 * a therapist page and a service page both talk about the same person. Without
 * a shared identifier each page mints a fresh entity, and a parser sees eleven
 * unrelated people who happen to share a name with our team. The URL is
 * locale-free on purpose: one therapist, not an English one and a Chinese one.
 */
export function serviceNodeId(slug: string) {
  return `${siteConfig.baseUrl}/#service/${slug}`;
}

export function personNodeId(slug: string) {
  return `${siteConfig.baseUrl}/#person/${slug}`;
}

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

/**
 * `City` is a `Place`, and `addressRegion` / `addressCountry` are not defined
 * on it — they belong to `PostalAddress` or `DefinedRegion`. Naming the cities
 * plainly and stating the region once as a `DefinedRegion` says the same thing
 * with properties that resolve instead of being dropped.
 */
const AREA_SERVED = [
  { "@type": "City", name: "Vancouver" },
  { "@type": "City", name: "Richmond" },
  { "@type": "City", name: "Burnaby" },
  { "@type": "DefinedRegion", addressRegion: "BC", addressCountry: "CA" },
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
 * Media coverage as `subjectOf` entries on the Organization node.
 *
 * Previously the homepage emitted these as standalone `NewsArticle`/
 * `VideoObject` nodes whose `publisher` was the outlet, with nothing tying
 * them back to Familogue — a parser saw thirteen unrelated articles rather
 * than coverage of this organization. `subjectOf` on the Organization states
 * "this organization was the subject of this coverage", which is the
 * association actually worth having.
 */
const SUBJECT_OF = getAllMedia().map((item) => ({
  "@type": item.url.includes("youtube.com") || item.url.includes("youtu.be")
    ? "VideoObject"
    : "NewsArticle",
  name: item.headline,
  url: item.url,
  datePublished: item.date,
  publisher: { "@type": "Organization", name: item.outlet },
}));

/**
 * Site-wide entity graph, rendered once in the root layout.
 *
 * Modelled as a `@graph` so the organization, its two physical sites and the
 * website are distinct nodes with stable `@id`s that other pages can reference,
 * rather than a single node with an invalid `location` array.
 */
export function organizationSchema(locale: string) {
  const services = getAllServices(locale);

  /**
   * Every published service as an offer, so the site-wide graph carries the
   * inventory rather than leaving it to be discovered one service page at a
   * time. Each `itemOffered` is an `@id` reference — the service page itself
   * supplies the type, description and clinical properties for that node.
   */
  const offerCatalog = {
    "@type": "OfferCatalog",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@id": serviceNodeId(service.slug),
        name: service.title,
        url: `${siteConfig.baseUrl}/${locale}/our-services/${service.slug}`,
      },
    })),
  };

  /** Clinician-delivered services only — what a `MedicalClinic` can offer. */
  const clinicalServices = services
    .filter((service) => isClinicalService(service.slug))
    .map((service) => ({ "@id": serviceNodeId(service.slug), name: service.title }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        // The medical types are load-bearing. Without them the therapeutic side
        // reads as programming a community group happens to run. Both are
        // needed: `MedicalBusiness` is a `LocalBusiness` and says this is a
        // place you attend, while `medicalSpecialty` is only defined on
        // `MedicalOrganization`, so claiming a specialty without it would be an
        // invalid property that parsers drop.
        "@type": ["NGO", "Organization", "MedicalBusiness", "MedicalOrganization"],
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
        medicalSpecialty: ORGANIZATION_MEDICAL_SPECIALTY,
        hasOfferCatalog: offerCatalog,
        sameAs: SAME_AS,
        subjectOf: SUBJECT_OF,
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
        // Richmond is the site with posted hours and the address therapy is
        // booked at, so it — not the Vancouver satellite — carries the clinic
        // typing. `MedicalClinic` is what a "speech therapist near me" style
        // query resolves against.
        "@type": ["LocalBusiness", "EducationalOrganization", "MedicalClinic"],
        "@id": RICHMOND_ID,
        name: RICHMOND.name,
        parentOrganization: { "@id": ORGANIZATION_ID },
        url: siteConfig.baseUrl,
        telephone: contactInfo.phone.e164,
        email: contactInfo.email,
        address: RICHMOND_ADDRESS,
        areaServed: AREA_SERVED,
        knowsLanguage: KNOWS_LANGUAGE,
        medicalSpecialty: ORGANIZATION_MEDICAL_SPECIALTY,
        availableService: clinicalServices,
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
