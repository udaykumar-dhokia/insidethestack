import { getAllArticles } from "@/lib/articles";
import { ArticlesExplorer } from "@/components/articles-explorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description: "Explore the architectures of the world's biggest software platforms.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="w-full">
      <ArticlesExplorer articles={articles} />
    </div>
  );
}
