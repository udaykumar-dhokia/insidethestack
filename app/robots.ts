import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const baseUrl = 'https://udaykumar-dhokia.github.io/insidethestack';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
