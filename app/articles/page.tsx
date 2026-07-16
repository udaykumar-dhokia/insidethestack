import { getArticlesFromApi } from "@/lib/articles";
import { ArticlesExplorer } from "@/components/articles-explorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Explore the architectures of the world's biggest software platforms.",
};

export default async function ArticlesPage() {
  const articles = await getArticlesFromApi();

  return (
    <div className="w-full">
      <ArticlesExplorer articles={articles} />
    </div>
  );
}
