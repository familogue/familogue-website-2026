import { getAllServices, getServiceBySlug } from "@/utils/sdk/services";
import Markdown from "markdown-to-jsx";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const locales = ["en", "zh"];
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

function extractExcerpt(markdown: string): string {
  const firstParagraph = markdown.split(/\n\n+/)[0];
  return firstParagraph.replace(/<[^>]+>/g, "").trim().slice(0, 160);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const service = getServiceBySlug(slug, locale);
  if (!service) return {};
  const excerpt = extractExcerpt(service.content);
  return {
    title: service.title,
    description: excerpt,
    openGraph: {
      title: service.title,
      description: excerpt,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const service = getServiceBySlug(slug, locale);
  if (!service) notFound();

  const ourServicesLabel = locale === "zh" ? "我們的服務" : "Our Services";

  return (
    <div className="x-container prose">
      <nav aria-label="breadcrumb" className="not-prose text-sm mb-4">
        <Link href="/our-services" className="hover:underline">{ourServicesLabel}</Link>
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
    </div>
  );
}
