import { MetadataRoute } from "next";
import { getArticlesFromApi } from "@/lib/articles";

export const dynamic = "force-static";

const baseUrl = "https://udaykumar-dhokia.github.io/insidethestack";
const BUILD_DATE = new Date("2026-07-16T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticlesFromApi();

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.meta.date || BUILD_DATE),
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: BUILD_DATE,
    },
    {
      url: `${baseUrl}/articles/`,
      lastModified: BUILD_DATE,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: BUILD_DATE,
    },
    {
      url: `${baseUrl}/pricing/`,
      lastModified: BUILD_DATE,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: BUILD_DATE,
    },
    {
      url: `${baseUrl}/docs/`,
      lastModified: BUILD_DATE,
    },
    ...articleUrls,
  ];
}
