import { siteConfig } from "@/utils/site-config";
import { locales } from "@/i18n/config";
import { bcp47For, buildAlternates, openGraphLocale } from "@/utils/alternates";
import {
  ORGANIZATION_ID,
  personNodeId,
  serviceNodeId,
  WEBSITE_ID,
} from "@/utils/organization-schema";
import { ArrowLink } from "@/components/ui/link";
import { Link } from "@/i18n/navigation";
import { getAllServices, getServiceBySlug } from "@/utils/sdk/services";
import { getTeamForService } from "@/utils/sdk/team";
import { initials } from "@/utils/category-theme";
import { medicalTherapyProperties } from "@/utils/medical-schema";
import { extractExcerpt } from "@/utils/extractExcerpt";
import { ContentMarkdown } from "@/components/content-markdown";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const services = getAllServices(locale);
    for (const service of services) {
      params.push({ locale, slug: service.slug });
    }
  }
  return params;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const service = getServiceBySlug(slug, locale);
  if (!service) return {};
  const excerpt = extractExcerpt(service.content, 160);
  return {
    title: `${service.title} | ${siteConfig.name}`,
    description: excerpt,
    alternates: buildAlternates(locale, `/our-services/${slug}`),
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: excerpt,
      url: `/${locale}/our-services/${slug}`,
      siteName: siteConfig.name,
      locale: openGraphLocale(locale),
      alternateLocale: locales.filter((l) => l !== locale).map(openGraphLocale),
      type: "website",
      images:
        service.image.length > 0
          ? [{ url: service.image[0], width: 1280, height: 720, alt: service.title }]
          : [{ url: "/images/og-image.png", width: 1600, height: 900, alt: siteConfig.name }],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const service = getServiceBySlug(slug, locale);
  if (!service) notFound();

  const t = await getTranslations("OurServices");
  const tt = await getTranslations();
  const tFaq = await getTranslations("ServiceFaq");
  const excerpt = extractExcerpt(service.content, 160);
  const therapists = getTeamForService(slug, locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("title"),
        item: `${siteConfig.baseUrl}/${locale}/our-services`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: service.title,
        item: `${siteConfig.baseUrl}/${locale}/our-services/${slug}`,
      },
    ],
  };

  // Clinician-delivered services carry `MedicalTherapy` alongside `Service`, so
  // one node states both the offering and the regulated care it is. Services
  // without a clinical profile (community programmes, classes) get `null` back
  // and stay a plain `Service` — see `medical-schema.ts`.
  const medicalProperties = medicalTherapyProperties(slug);

  const pageUrl = `${siteConfig.baseUrl}/${locale}/our-services/${slug}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": medicalProperties ? ["Service", "MedicalTherapy"] : "Service",
    // Shared with the organization's offer catalogue, so both descriptions
    // resolve to one service rather than two lookalikes.
    "@id": serviceNodeId(slug),
    url: pageUrl,
    name: service.title,
    description: excerpt,
    category: tt(`ServiceCategories.${service.category}.name`),
    // The therapists who deliver a service sit here rather than under
    // `employee`: `provider` accepts an organization *or* a person and means
    // exactly this, whereas `employee` is an Organization property that says
    // nothing about who performs the service.
    provider: [
      { "@id": ORGANIZATION_ID },
      ...therapists.map((m) => ({
        "@id": personNodeId(m.slug),
        "@type": "Person",
        name: m.name,
        jobTitle: tt(`TeamRoles.${m.role}`),
        knowsLanguage: m.languages,
      })),
    ],
    areaServed: { "@type": "AdministrativeArea", name: "Greater Vancouver, British Columbia" },
    availableLanguage: ["yue", "cmn", "en"],
    ...(medicalProperties ?? {}),
  };

  /**
   * Clinical service pages are also `MedicalWebPage`s — a page *about* regulated
   * care written for patients, which is a different claim from the service node
   * describing the care itself. Non-clinical pages get no such node.
   */
  const medicalWebPageJsonLd = medicalProperties && {
    "@context": "https://schema.org",
    "@type": ["WebPage", "MedicalWebPage"],
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: service.title,
    description: excerpt,
    inLanguage: bcp47For(locale),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": serviceNodeId(slug) },
    mainEntity: { "@id": serviceNodeId(slug) },
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
    ...("relevantSpecialty" in medicalProperties && {
      specialty: medicalProperties.relevantSpecialty,
    }),
  };

  /**
   * Question-and-answer pairs for services that have them, in the current
   * locale. The answers are the specifics people phone to ask — languages,
   * funding, who delivers the session — which is the shape an answering engine
   * can quote back verbatim. Rendered on the page as well as in `FAQPage`:
   * marking up content a visitor cannot see is a structured-data violation,
   * not a shortcut.
   */
  const faq: { question: string; answer: string; }[] = tFaq.has(`items.${slug}`)
    ? tFaq.raw(`items.${slug}`)
    : [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <div className="x-container prose">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {medicalWebPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageJsonLd) }}
        />
      )}
      {faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <nav aria-label="breadcrumb" className="not-prose text-sm mb-4">
        <Link href="/our-services" className="text-link hover:text-link-hover hover:underline">{t("title")}</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span>{service.title}</span>
      </nav>
      {service.image.length > 0 && (
        <Image
          src={service.image[0]}
          alt={service.title}
          width={1280}
          height={720}
          className="w-full aspect-[16/9] object-cover rounded-lg mb-6"
        />
      )}
      <h1>{service.title}</h1>
      <ContentMarkdown>{service.content}</ContentMarkdown>

      {faq.length > 0 && (
        <section className="mt-12">
          <h2 className="x-section-heading">{tFaq("heading")}</h2>
          <dl className="mt-6">
            {faq.map(({ question, answer }) => (
              <div key={question} className="border-t py-5 first:border-t-0 first:pt-0">
                <dt className="font-semibold">{question}</dt>
                <dd className="text-muted-foreground mt-2 mb-0 ml-0">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {therapists.length > 0 && (
        <section className="not-prose mt-12">
          <h2 className="x-section-heading">{tt("OurTherapists.onThisService")}</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {therapists.map((m) => (
              <li key={m.slug} className="flex items-start gap-3 rounded-lg border p-4">
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} width={48} height={48} className="size-12 shrink-0 rounded-full object-cover" />
                ) : (
                  <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                    {initials(m.name)}
                  </span>
                )}
                <div className="min-w-0 space-y-0.5">
                  <p className="my-0 leading-tight font-semibold">{m.name}</p>
                  <p className="text-muted-foreground my-0 text-sm leading-snug">{m.credentials}</p>
                  <p className="text-muted-foreground my-0 text-sm leading-snug">
                    {m.languages.map((c) => tt(`Languages.${c}`)).join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 mb-0">
            <ArrowLink href="/our-therapists" className="font-medium">
              {tt("OurTherapists.meetTheTeam")}
            </ArrowLink>
          </p>
        </section>
      )}
    </div>
  );
}
