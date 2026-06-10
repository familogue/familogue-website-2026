export interface SiteConfig {
  baseUrl: string;
  name: string;
  description: string;
  author: string;
  locales: string[];
  // Add more fields as needed
}

export const siteConfig: SiteConfig = {
  baseUrl: "https://familogue.ca",
  name: "Familogue 語你童行",
  description: "As a registered non-profit organization in British Columbia, we aim to utilize our expertise to systematically help parents and children develop additional skills through the use of their mother tongue abilities at home.",
  author: "Familogue 語你童行",
  locales: ['en', 'zh'],
  // Add more fields as needed
};
