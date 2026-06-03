import { type NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/*
 * @type {import('next').NextConfig}
 * https://nextjs.org/docs/api-reference/next.config.js/introduction
 *
 * This is the configuration file for Next.js.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  cleanDistDir: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "familogue.ca",
        port: '',
        pathname: '/**',
      },
{
        protocol: "https",
        hostname: "*.airtableusercontent.com",
      }
    ],
  },
};

/* https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing */
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
