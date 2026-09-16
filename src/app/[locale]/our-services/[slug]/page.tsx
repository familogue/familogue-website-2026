import { siteConfig } from "@/utils/site-config";
import { locales } from "@/i18n/config";
import { buildAlternates, openGraphLocale } from "@/utils/alternates";
import { Link } from "@/i18n/navigation";
import { getAllServices, getServiceBySlug } from "@/utils/sdk/services";
import { getTeamForService } from "@/utils/sdk/team";
import { initials } from "@/utils/category-theme";
import { extractExcerpt } from "@/utils/extractExcerpt";
import Markdown from "markdown-to-jsx";
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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: excerpt,
    category: tt(`ServiceCategories.${service.category}.name`),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.baseUrl,
    },
    areaServed: { "@type": "AdministrativeArea", name: "Greater Vancouver, British Columbia" },
    availableLanguage: ["yue", "cmn", "en"],
    ...(therapists.length > 0 && {
      employee: therapists.map((m) => ({
        "@type": "Person",
        name: m.name,
        jobTitle: tt(`TeamRoles.${m.role}`),
        knowsLanguage: m.languages,
      })),
    }),
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
      <nav aria-label="breadcrumb" className="not-prose text-sm mb-4">
        <Link href="/our-services" className="hover:underline">{t("title")}</Link>
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
      <Markdown
        options={{
          overrides: {
            img: { component: "img" },
            a: { props: { target: "_blank", rel: "noopener noreferrer" } },
          },
        }}
      >
        {service.content}
      </Markdown>

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
                  <p className="my-0! leading-tight font-semibold">{m.name}</p>
                  <p className="text-muted-foreground my-0! text-sm leading-snug">{m.credentials}</p>
                  <p className="text-muted-foreground my-0! text-sm leading-snug">
                    {m.languages.map((c) => tt(`Languages.${c}`)).join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 mb-0!">
            <Link href="/our-therapists" className="font-medium text-emerald-700 underline underline-offset-4">
              {tt("OurTherapists.meetTheTeam")} &rsaquo;
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
