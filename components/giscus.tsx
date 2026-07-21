"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Match the Giscus theme with our Next.js theme
  const theme = resolvedTheme === "dark" ? "transparent_dark" : "light";

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    
    script.setAttribute("data-repo", "udaykumar-dhokia/insidethestack");
    script.setAttribute("data-repo-id", "R_kgDOTQE1Mg");
    
    // IMPORTANT: User needs to update these placeholders in Github Discussions setup
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOTQE1Ms4DBpSu");
    
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "en");

    ref.current.appendChild(script);
  }, []);

  // Update theme dynamically without reloading the script
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (!iframe) return;
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme } } },
      "https://giscus.app"
    );
  }, [theme]);

  return (
    <div className="w-full mt-16 border-t border-divider pt-10">
      <h3 className="text-2xl font-bold mb-6">Discussion</h3>
      <div ref={ref} />
    </div>
  );
}
