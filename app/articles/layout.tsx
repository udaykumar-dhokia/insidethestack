import { getAllArticles } from "@/lib/articles";
import { ArticlesSidebar } from "@/components/articles-sidebar";
import { Suspense } from "react";

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  const articles = getAllArticles();
  
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      <Suspense fallback={<div className="w-full md:w-64 flex-shrink-0">Loading...</div>}>
        <ArticlesSidebar articles={articles} />
      </Suspense>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
