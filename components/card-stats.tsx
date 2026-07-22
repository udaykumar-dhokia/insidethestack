"use client";

import { useGetArticleStatsQuery } from "@/lib/store/api/articlesApi";
import { HeartFilledIcon, EyeIcon } from "@/components/icons";

interface CardStatsProps {
  slug: string;
  initialLikes: number;
  initialViews: number;
}

export function CardStats({ slug, initialLikes, initialViews }: CardStatsProps) {
  const { data } = useGetArticleStatsQuery(slug);

  const likes = data?.likes_count ?? initialLikes;
  const views = data?.views_count ?? initialViews;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        <HeartFilledIcon className="w-4 h-4 text-red-500" />
        <span>{likes}</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        <EyeIcon className="w-4 h-4" />
        <span>{views}</span>
      </div>
    </div>
  );
}
