"use client";

import { useEffect, useState } from "react";
import { EyeIcon } from "@phosphor-icons/react";

interface ArticleViewTrackerProps {
  slug: string;
  initialViews: number;
}

export function ArticleViewTracker({ slug, initialViews }: ArticleViewTrackerProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    // Only track view once per mount
    const trackView = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000"}/articles/${slug}/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.views_count) {
            setViews(data.views_count);
          }
        }
      } catch (error) {
        console.error("Failed to track view", error);
      }
    };

    trackView();
  }, [slug]);

  if (views === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
      <EyeIcon className="w-4 h-4" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
