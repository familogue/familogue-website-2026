import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Geist } from 'next/font/google';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';
import 'src/globals.css';
import { routing } from 'src/i18n/routing';
import { bcp47For } from '@/utils/alternates';
import { siteConfig } from '@/utils/site-config';
import { organizationSchema } from '@/utils/organization-schema';
import { Decorations } from "./_components/decorations";
import { Footer } from './_components/footer';
import { Navbar } from './_components/navbar';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

/**
 * Inherited by every route, so per-page metadata that only sets relative
 * `alternates` still resolves to absolute canonical / hreflang URLs.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
};

export const viewport: Viewport = {
  initialScale: 1,
};

const mainFont = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  preload: true,
});

const RootLayout: FC<{ children: ReactNode; params: Promise<{ locale: 'en' | 'zh'; }>; }> = async ({ children, params }) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={bcp47For(locale)} className={mainFont.className}>
      {/* <Head color={{ hue: 359, saturation: 100, lightness: 62 }} backgroundColor={{ dark: "#0f172a", light: "#fffbeb" }} /> */}
      <head style={{ backgroundColor: "#fffbeb" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema(locale)) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          {`
        html[data-theme="dark"] head {
          background-color: #0f172a !important;
        }
        html[data-theme="light"] head {
          background-color: #fffbeb !important;
        }
          `}
        </style>
      </head>
      <body>
        <NextIntlClientProvider>
          <div role="container" className="x-container">
            <Navbar lang={locale} />
            {children}
            <Footer />
          </div>
        </NextIntlClientProvider>
        <Decorations />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
    </html>

  );
};

export default RootLayout;
