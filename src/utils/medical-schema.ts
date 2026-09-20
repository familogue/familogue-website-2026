/**
 * Clinical vocabulary for structured data.
 *
 * The organization graph in `organization-schema.ts` describes *who* Familogue
 * is; this file describes *what kind of care* it delivers, in the terms that
 * search and answering engines resolve medically. Without it a parser reads an
 * NGO that runs classes — the therapeutic side is invisible.
 *
 * Two rules govern everything here:
 *
 * 1. Only claims the site already makes elsewhere are encoded. Indications come
 *    from therapist profiles and service copy, regulators from the credentials
 *    those therapists actually hold. Nothing is inferred to look more clinical.
 * 2. Services delivered by non-registrants are deliberately left out. The
 *    social skills group is run by an ECE instructor, so it stays a plain
 *    `Service` — typing it as `MedicalTherapy` would be a false claim of
 *    regulated care, which is worse than being under-described.
 */

export type MedicalAuthority = { name: string; url: string };

/**
 * Regulators and registries that recognize the credentials held by this team.
 *
 * `CHCPBC` absorbed the College of Speech and Hearing Health Professionals of
 * BC (CSHBC) and the College of Occupational Therapists of BC in 2024 — it is
 * the current registrant body for both professions, so it is the one worth
 * naming even though older directories still say CSHBC.
 */
export const MEDICAL_AUTHORITIES = {
  chcpbc: {
    name: "College of Health and Care Professionals of British Columbia",
    url: "https://chcpbc.ca",
  },
  bcacc: {
    name: "BC Association of Clinical Counsellors",
    url: "https://bcacc.ca",
  },
  bccsw: {
    name: "BC College of Social Workers",
    url: "https://www.bccsw.ca",
  },
  bacb: {
    name: "Behavior Analyst Certification Board",
    url: "https://www.bacb.com",
  },
  rasp: {
    name: "Registry of Autism Service Providers (British Columbia)",
    url: "https://www.mcf.gov.bc.ca/rasp/",
  },
} as const satisfies Record<string, MedicalAuthority>;

/**
 * Post-nominals that denote a registration or certification with a named body,
 * as opposed to an academic degree. Matched case-sensitively against the whole
 * token so `MSW` never matches as `RSW` and `MScOT` never matches as `OT`.
 */
const REGISTRATION_AUTHORITY: Record<string, MedicalAuthority> = {
  SLP: MEDICAL_AUTHORITIES.chcpbc,
  OT: MEDICAL_AUTHORITIES.chcpbc,
  RCC: MEDICAL_AUTHORITIES.bcacc,
  RSW: MEDICAL_AUTHORITIES.bccsw,
  BCBA: MEDICAL_AUTHORITIES.bacb,
  RASP: MEDICAL_AUTHORITIES.rasp,
};

/**
 * Splits a credential line into post-nominals without breaking on the commas
 * inside an expansion — `"SLP, MScESLPLD (Master of Science in Educational
 * Speech-Language Pathology and Learning Disabilities), RASP"` is three
 * credentials, not five.
 */
export function splitCredentials(raw: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of raw) {
    if (char === "(") depth++;
    if (char === ")") depth = Math.max(0, depth - 1);
    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

/** The post-nominal itself, with any parenthesised expansion stripped. */
function postNominal(credential: string): string {
  return credential.replace(/\s*\(.*$/, "").trim();
}

type CredentialNode = {
  "@type": "EducationalOccupationalCredential";
  name: string;
  credentialCategory: string;
  recognizedBy?: { "@type": "Organization"; name: string; url: string };
};

function credentialNode(
  name: string,
  category: string,
  authority?: MedicalAuthority
): CredentialNode {
  return {
    "@type": "EducationalOccupationalCredential",
    name,
    credentialCategory: category,
    ...(authority && {
      recognizedBy: { "@type": "Organization", name: authority.name, url: authority.url },
    }),
  };
}

/**
 * `hasCredential` entries for one team member.
 *
 * Plain strings are legal here but inert: an engine verifying a clinical claim
 * looks for the body that recognizes the credential, so registrations carry a
 * `recognizedBy` node and degrees and course certificates do not.
 */
export function credentialJsonLd(credentials: string, certifications: string[]): CredentialNode[] {
  const registrations = splitCredentials(credentials).map((credential) =>
    credentialNode(
      credential,
      REGISTRATION_AUTHORITY[postNominal(credential)]
        ? "Professional registration"
        : "Degree",
      REGISTRATION_AUTHORITY[postNominal(credential)]
    )
  );
  const courses = certifications
    .filter(Boolean)
    .map((certification) => credentialNode(certification, "Certificate"));
  return [...registrations, ...courses];
}

/**
 * Specialties claimed at the organization level. `SpeechPathology` is the only
 * schema.org `MedicalSpecialty` that matches a profession on this team —
 * occupational therapy and behaviour analysis have no enum member, so they are
 * expressed per-service instead of being forced into a wrong one.
 */
export const ORGANIZATION_MEDICAL_SPECIALTY = ["SpeechPathology", "Pediatric"];

type MedicalProfile = {
  /** schema.org `MedicalSpecialty` enum members, omitted where none fits. */
  relevantSpecialty?: string[];
  /** Conditions this service is offered for, as stated on the site. */
  indication?: string[];
  /** Body regulating the practitioners who deliver it. */
  recognizingAuthority: MedicalAuthority;
};

/**
 * Services delivered by registered clinicians, keyed by slug. A slug absent
 * from this map renders as a plain `Service` — see rule 2 at the top of the
 * file.
 */
const MEDICAL_PROFILES: Record<string, MedicalProfile> = {
  "speech-language-pathology": {
    relevantSpecialty: ["SpeechPathology", "Pediatric"],
    indication: [
      "Autism Spectrum Disorder",
      "Developmental Language Disorder",
      "Speech sound disorder",
      "Motor speech disorder",
    ],
    recognizingAuthority: MEDICAL_AUTHORITIES.chcpbc,
  },
  "speech-therapy-individual-and-group": {
    relevantSpecialty: ["SpeechPathology", "Pediatric"],
    indication: [
      "Autism Spectrum Disorder",
      "Developmental Language Disorder",
      "Speech sound disorder",
    ],
    recognizingAuthority: MEDICAL_AUTHORITIES.chcpbc,
  },
  "occupational-therapy": {
    relevantSpecialty: ["Pediatric"],
    indication: ["Autism Spectrum Disorder"],
    recognizingAuthority: MEDICAL_AUTHORITIES.chcpbc,
  },
  "behavior-intervention": {
    relevantSpecialty: ["Pediatric"],
    indication: ["Autism Spectrum Disorder"],
    recognizingAuthority: MEDICAL_AUTHORITIES.bacb,
  },
  "counselling-and-support-service": {
    recognizingAuthority: MEDICAL_AUTHORITIES.bcacc,
  },
  "clinical-counselling-services": {
    recognizingAuthority: MEDICAL_AUTHORITIES.bcacc,
  },
};

/**
 * `MedicalTherapy` properties for a service, or `null` when the service is not
 * clinician-delivered. Spread onto the `Service` node so the result is one
 * node of type `["Service", "MedicalTherapy"]` rather than two competing
 * descriptions of the same offering.
 */
/** Whether a service is delivered by registered clinicians. */
export function isClinicalService(slug: string): boolean {
  return slug in MEDICAL_PROFILES;
}

export function medicalTherapyProperties(slug: string) {
  const profile = MEDICAL_PROFILES[slug];
  if (!profile) return null;
  return {
    ...(profile.relevantSpecialty && { relevantSpecialty: profile.relevantSpecialty }),
    ...(profile.indication && {
      indication: profile.indication.map((name) => ({ "@type": "MedicalIndication", name })),
    }),
    recognizingAuthority: {
      "@type": "Organization",
      name: profile.recognizingAuthority.name,
      url: profile.recognizingAuthority.url,
    },
  };
}
