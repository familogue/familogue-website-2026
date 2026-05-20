import { siteConfig } from "@/utils/site-config";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers["x-revalidate-token"];
  if (!process.env.REVALIDATE_SECRET || token !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    for (const locale of siteConfig.locales) {
      await res.revalidate(locale + '/');
      await res.revalidate(locale + '/our-services');
    }
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).json({ message: 'Error revalidating', error: (err as Error).message });
  }
}
