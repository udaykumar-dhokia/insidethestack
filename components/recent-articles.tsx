import NextLink from "next/link";
import { CardStats } from "@/components/card-stats";
import { HeartFilledIcon, EyeIcon } from "@/components/icons";
import { getArticlesFromApi } from "@/lib/articles";

export async function RecentArticles() {
  const articles = await getArticlesFromApi();
  // Get only the 4 most recent articles
  const recent = articles.slice(0, 4);

  if (!recent || recent.length === 0) {
    return (
      <div className="w-full text-center py-10 text-danger">
        No recent articles found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
      {recent.map((article: any) => (
        <NextLink
          key={article.slug}
          href={`/insidethestack/${article.slug}`}
          className="bg-surface shadow-surface border border-divider rounded-2xl flex flex-col items-start h-full p-4 w-full justify-between hover:bg-surface/80 hover:-translate-y-1 transition-all duration-200"
        >
          <div className="flex flex-col gap-3 h-full w-full">
            {article.meta?.image && (
              <div className="w-full h-32 relative rounded-lg overflow-hidden mb-2">
                <img
                  src={article.meta.image}
                  alt={article.meta.title}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            )}
            <h3 className="text-lg font-bold leading-tight">
              {article.meta?.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {article.meta?.description}
            </p>
          </div>
          <div className="pt-4 flex justify-between items-center gap-2 w-full mt-auto">
            <div className="flex flex-wrap gap-2">
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
  );
}
