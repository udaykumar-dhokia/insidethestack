import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const baseUrl = 'https://udaykumar-dhokia.github.io/insidethestack';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/create',
          '/login',
          '/signup',
          '/api/',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'GPTBot', 'ChatGPT-User', 'Google-Extended', 'Anthropic-ai', 'CCBot', 'PerplexityBot', 'Omgili'],
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
