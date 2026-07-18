import { getArticlesFromApi } from "@/lib/articles";
import { ArticlesExplorer } from "@/components/articles-explorer";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Explore How Modern Software Works | System Architecture | InsideTheStack",
  description: "Browse comprehensive architectural deep dives and case studies on how the world's biggest software platforms are built.",
  alternates: {
    canonical: "https://udaykumar-dhokia.github.io/insidethestack/articles",
  },
  openGraph: {
    title: "Explore How Modern Software Works | System Architecture | InsideTheStack",
    description: "Browse comprehensive architectural deep dives and case studies on how the world's biggest software platforms are built.",
    url: "https://udaykumar-dhokia.github.io/insidethestack/articles",
    type: "website",
  },
  twitter: {
    title: "Explore How Modern Software Works | System Architecture | InsideTheStack",
    description: "Browse comprehensive architectural deep dives and case studies on how the world's biggest software platforms are built.",
  }
};

export default async function ArticlesPage() {
  const articles = await getArticlesFromApi();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://udaykumar-dhokia.github.io/insidethestack',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: 'https://udaykumar-dhokia.github.io/insidethestack/articles',
      },
    ],
  };

  return (
    <div className="w-full">
      <Script
        id="json-ld-articles"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlesExplorer articles={articles} />
    </div>
  );
}
