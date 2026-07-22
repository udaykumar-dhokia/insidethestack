"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import type { Article } from "@/lib/articles";

import NextLink from "next/link";
import { SearchIcon } from "@/components/icons";
import { useSearchParams } from "next/navigation";
import { CardStats } from "@/components/card-stats";

interface ArticlesExplorerProps {
  articles: Article[];
}

function ExplorerContent({ articles }: ArticlesExplorerProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subCategory");
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setSearchQuery(searchParams.get("query") || "");
  }, [searchParams]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (category && article.meta.category !== category) {
        return false;
      }
      // Filter by subcategory
      if (subCategory && article.meta.subCategory !== subCategory) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = article.meta.title?.toLowerCase().includes(query);
        const descMatch = article.meta.description?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch) {
          return false;
        }
      }
      return true;
    });
  }, [articles, searchQuery, category, subCategory]);

  return (
    <div className="flex-1 flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">
          {subCategory || category || "All Articles"}
        </h1>
        <div className="w-full md:w-72">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-muted-foreground mb-0.5 flex-shrink-0" />
            </div>
            <input
              type="text"
              aria-label="Search articles"
              className="w-full bg-surface shadow-surface rounded-lg py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary border border-divider"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No articles found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <NextLink 
              key={article.slug} 
              href={`/articles/${article.slug}`} 
              className="bg-surface shadow-surface border border-divider rounded-2xl flex flex-col items-start h-full p-4 w-full justify-between hover:bg-surface/80 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex flex-col gap-3 h-full w-full text-left">
                {article.meta.image && (
                  <div className="w-full h-48 relative rounded-lg overflow-hidden mb-2">
                    <img src={article.meta.image} alt={article.meta.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold leading-tight">{article.meta.title}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">{article.meta.description}</p>
              </div>
              <div className="pt-4 flex justify-between items-center gap-2 w-full mt-auto">
                <div className="flex flex-wrap gap-2">
                  {article.meta.category && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md">
                      {article.meta.category}
                    </span>
                  )}
                  {article.meta.subCategory && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-md">
                      {article.meta.subCategory}
                    </span>
                  )}
                </div>
                <CardStats 
                  slug={article.slug} 
                  initialLikes={article.likes_count || 0} 
                  initialViews={article.views_count || 0} 
                />
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function ArticlesExplorer({ articles }: ArticlesExplorerProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading articles...</div>}>
      <ExplorerContent articles={articles} />
    </Suspense>
  );
}
