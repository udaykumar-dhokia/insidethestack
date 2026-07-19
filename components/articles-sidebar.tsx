"use client";

import type { Article } from "@/lib/articles";
import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ArticlesSidebarProps {
  articles: Article[];
}

export function ArticlesSidebar({ articles }: ArticlesSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoryParam = searchParams.get("category");
  const activeSubCategoryParam = searchParams.get("subCategory");
  const [isOpen, setIsOpen] = useState(false);

  // Dynamically build categories from loaded articles
  const dynamicCategories: Record<string, Set<string>> = {};
  articles.forEach((article) => {
    const cat = article.meta.category;
    const sub = article.meta.subCategory;
    if (cat) {
      if (!dynamicCategories[cat]) {
        dynamicCategories[cat] = new Set();
      }
      if (sub) {
        dynamicCategories[cat].add(sub);
      }
    }
  });

  const CATEGORIES = Object.fromEntries(
    Object.entries(dynamicCategories).map(([key, value]) => [key, Array.from(value)])
  );

  // Helper to find the slug for a subcategory
  const getArticleSlugForSubCategory = (subCategory: string) => {
    const article = articles.find((a) => a.meta.subCategory === subCategory);
    return article ? `/articles/${article.slug}` : `/articles?subCategory=${encodeURIComponent(subCategory)}`;
  };

  // Determine active states
  const isAllActive = pathname === "/articles" && !activeCategoryParam && !activeSubCategoryParam;

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="md:sticky md:top-24 overflow-y-auto max-h-[calc(100vh-6rem)] scrollbar-hide">
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-between w-full bg-content2 border border-divider rounded-xl px-4 py-3 mb-2 font-bold text-foreground shadow-sm"
        >
          <span>Browse Categories</span>
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
        </button>

        {/* Categories List */}
        <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col gap-4 bg-content2 md:bg-transparent p-4 md:p-0 rounded-xl border border-divider md:border-none shadow-sm md:shadow-none mb-6 md:mb-0`}>
          <h2 className="hidden md:block text-xl font-bold">Categories</h2>
          <NextLink
            href="/articles"
            className={`font-medium transition-colors ${isAllActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
          >
            All Articles
          </NextLink>
          
          {Object.entries(CATEGORIES).map(([category, subCategories]) => {
            const isCategoryActive = (activeCategoryParam === category) || 
              (pathname.startsWith('/articles/') && articles.find(a => a.slug === pathname.split('/').pop())?.meta.category === category);

            return (
              <div key={category} className="flex flex-col gap-2">
                <NextLink
                  href={`/articles?category=${encodeURIComponent(category)}`}
                  className={`font-medium transition-colors ${isCategoryActive && !activeSubCategoryParam ? 'text-primary' : 'text-foreground hover:text-primary/80'}`}
                >
                  {category}
                </NextLink>
                
                {subCategories.length > 0 && (
                  <div className="flex flex-col gap-1.5 pl-4 border-l border-divider ml-2">
                    {subCategories.map((sub) => {
                      const href = getArticleSlugForSubCategory(sub);
                      const isSubActive = pathname === href || activeSubCategoryParam === sub;
                      
                      return (
                        <NextLink
                          key={sub}
                          href={href}
                          className={`text-sm transition-colors ${isSubActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          {sub}
                        </NextLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
