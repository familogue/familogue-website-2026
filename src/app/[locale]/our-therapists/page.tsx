import { generatedMetadataForPage } from "@/utils/generatedMetadataForPage";
import { initials } from "@/utils/category-theme";
import { getTeamByRole } from "@/utils/sdk/team";
import { siteConfig } from "@/utils/site-config";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { TeamMemberRecord } from "src/types";

export async function generateMetadata() {
  const locale = await getLocale();
  return generatedMetadataForPage(locale, "OurTherapists", "/our-therapists");
}

/** Headshot when we have one, initials disc when we don't. */
const Avatar: React.FC<{ member: TeamMemberRecord; }> = ({ member }) =>
  member.photo ? (
    <Image
      src={member.photo}
      alt={member.name}
      width={64}
      height={64}
      className="size-16 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span
      aria-hidden
      className="flex size-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800"
    >
      {initials(member.name)}
    </span>
  );

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations();
  const groups = getTeamByRole(locale);

  // Person entities are the AEO payload: role, credentials and — the differentiator —
  // which languages each therapist actually practises in.
  const personJsonLd = groups.flatMap(({ role, members }) =>
    members.map((m) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: m.name,
      jobTitle: t(`TeamRoles.${role}`),
      description: m.content,
      knowsLanguage: m.languages,
      hasCredential: [m.credentials, ...m.certifications].filter(Boolean),
      worksFor: { "@type": "Organization", name: siteConfig.name, url: siteConfig.baseUrl },
      ...(m.photo ? { image: `${siteConfig.baseUrl}${m.photo}` } : {}),
    }))
  );

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("OurServices.title"), item: `${siteConfig.baseUrl}/${locale}/our-services` },
      { "@type": "ListItem", position: 2, name: t("OurTherapists.title"), item: `${siteConfig.baseUrl}/${locale}/our-therapists` },
    ],
  };

  return (
    <div className="x-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <h1 className="text-3xl font-bold">{t("OurTherapists.title")}</h1>
      <p className="text-muted-foreground mt-2 mb-0! max-w-prose">{t("OurTherapists.subtitle")}</p>

      {groups.map(({ role, members }) => (
        <section key={role} id={role} className="mt-12 scroll-mt-24">
          <h2 className="x-section-heading">{t(`TeamRoles.${role}`)}</h2>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {members.map((member) => (
              <article key={member.slug} className="rounded-lg border p-5">
                <div className="flex items-start gap-4">
                  <Avatar member={member} />
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="text-lg leading-tight font-semibold">{member.name}</h3>
                    <p className="text-muted-foreground my-0! text-sm leading-snug">{member.credentials}</p>
                    <p className="text-muted-foreground my-0! text-sm leading-snug">
                      {t("OurTherapists.languages")}:{" "}
                      {member.languages.map((code) => t(`Languages.${code}`)).join(" · ")}
                    </p>
                  </div>
                </div>
                <p className="mt-4 mb-0! text-sm whitespace-pre-line">{member.content}</p>
                {member.certifications.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      {t("OurTherapists.certifications")} ({member.certifications.length})
                    </summary>
                    <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
                      {member.certifications.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </details>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
