import { MetadataRoute } from 'next';
import { getArticlesFromApi } from '@/lib/articles';

export const dynamic = 'force-static';

const baseUrl = 'https://udaykumar-dhokia.github.io/insidethestack';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticlesFromApi();

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.meta.date || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...articleUrls,
  ];
}
