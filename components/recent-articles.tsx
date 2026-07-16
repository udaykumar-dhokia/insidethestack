"use client";

import NextLink from "next/link";
import { Skeleton } from "@heroui/react";
import { useGetArticlesQuery } from "@/lib/store/api/articlesApi";

export function RecentArticles() {
  const { data, isLoading, error } = useGetArticlesQuery({ limit: 4 });

  if (error) {
    return (
      <div className="w-full text-center py-10 text-danger">
        Failed to load recent articles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
      {isLoading ? (
        // Skeleton loaders
        Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-surface shadow-surface border border-divider rounded-2xl flex flex-col items-start h-full p-4 w-full justify-between"
          >
            <div className="flex flex-col gap-3 h-full w-full">
              <Skeleton className="w-full h-32 rounded-lg mb-2" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
            <div className="pt-4 flex flex-col items-start gap-2 w-full mt-auto">
              <div className="flex flex-wrap gap-2 w-full">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))
      ) : (
        // Actual articles
        data?.items?.map((article: any) => (
          <NextLink
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="bg-surface shadow-surface border border-divider rounded-2xl flex flex-col items-start h-full p-4 w-full justify-between hover:bg-surface/80 hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex flex-col gap-3 h-full w-full">
              {article.image && (
                <div className="w-full h-32 relative rounded-lg overflow-hidden mb-2">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              )}
              <h3 className="text-lg font-bold leading-tight">
                {article.title}
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {article.description}
              </p>
            </div>
            <div className="pt-4 flex flex-col items-start gap-2 w-full mt-auto">
              <div className="flex flex-wrap gap-2 w-full">
                {article.category && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md">
                    {article.category}
                  </span>
                )}
                {article.subCategory && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-md">
                    {article.subCategory}
                  </span>
                )}
              </div>
            </div>
          </NextLink>
        ))
      )}
    </div>
  );
}
