"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export type Heading = {
  level: number;
  text: string;
  id: string;
  children?: Heading[];
};

interface StickyTableOfContentsProps {
  headings: Heading[];
}

export function StickyTableOfContents({ headings }: StickyTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // If no headings, do nothing
    if (!headings.length) return;

    // Create an intersection observer to track which heading is currently on screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -40% 0px" }
    );

    // Get all heading elements that match our extracted heading IDs
    const elements = headings.flatMap((h) => {
      const parent = document.getElementById(h.id);
      const children = h.children ? h.children.map((c) => document.getElementById(c.id)) : [];
      return [parent, ...children].filter(Boolean) as HTMLElement[];
    });

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground/70">
        On this page
      </h3>
      <div className="flex flex-col gap-3 text-sm relative">
        {/* Decorative left border line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-divider" />
        
        {headings.map((heading, i) => (
          <div key={i} className="flex flex-col gap-2">
            <a 
              href={`#${heading.id}`} 
              className={clsx(
                "relative pl-4 font-medium transition-colors block leading-tight",
                activeId === heading.id 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              )}
            >
              {activeId === heading.id && (
                <span className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-primary rounded-full" />
              )}
              {heading.text}
            </a>
            
            {heading.children && heading.children.length > 0 && (
              <div className="flex flex-col gap-2 pl-4">
                {heading.children.map((sub, j) => (
                  <a 
                    key={j}
                    href={`#${sub.id}`} 
                    className={clsx(
                      "relative pl-4 transition-colors block leading-tight",
                      activeId === sub.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {activeId === sub.id && (
                      <span className="absolute left-[-17px] top-0 bottom-0 w-[2px] bg-primary rounded-full" />
                    )}
                    {sub.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
