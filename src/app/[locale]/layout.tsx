import { GoogleAnalytics } from '@next/third-parties/google';
import { Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Geist } from 'next/font/google';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';
import 'src/globals.css';
import { routing } from 'src/i18n/routing';
import { Decorations } from "./_components/decorations";
import { Footer } from './_components/footer';
import { Navbar } from './_components/navbar';

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

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
    <html lang={locale} className={mainFont.className}>
      {/* <Head color={{ hue: 359, saturation: 100, lightness: 62 }} backgroundColor={{ dark: "#0f172a", light: "#fffbeb" }} /> */}
      <head style={{ backgroundColor: "#fffbeb" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["NGO", "LocalBusiness"],
              "name": "Familogue 語你童行",
              "url": "https://familogue.ca",
              "telephone": "+17788070211",
              "email": "info@familogue.ca",
              "location": [
                {
                  "@type": "Place",
                  "name": "Primary Site (Richmond Service Centre)",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "8181 Cambie Rd. Unit 5530",
                    "addressLocality": "Richmond",
                    "addressRegion": "BC",
                    "postalCode": "V6X 1J8",
                    "addressCountry": "CA"
                  }
                },
                {
                  "@type": "Place",
                  "name": "Satellite Site (Every Saturday)",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "8506 Ash Street",
                    "addressLocality": "Vancouver",
                    "addressRegion": "BC",
                    "postalCode": "V6P 3M2",
                    "addressCountry": "CA"
                  }
                }
              ]
            })
          }}
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
