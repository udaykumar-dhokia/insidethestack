import { MetadataRoute } from "next";
import { getArticlesFromApi } from "@/lib/articles";

export const dynamic = "force-static";

const baseUrl = "https://udaykumar-dhokia.github.io/insidethestack";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticlesFromApi();

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}/`,
    lastModified: new Date(article.meta.date || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: `${baseUrl}/articles/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    ...staticUrls,
    ...articleUrls,
  ];
}
