"use client";

import { useState } from "react";
import clsx from "clsx";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // We need to extract the raw text content from the children
    // React children might be complex, but for MDX <pre> tags, 
    // we can use a ref or try to get text if it's a string.
    // An easier way is to use a ref to the <pre> tag itself and read innerText.
    const preEl = document.getElementById(props.id || '');
    if (!preEl) {
      // Fallback: search DOM relative to current button
      const text = (children as any)?.props?.children?.toString() || '';
      if (text) {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }
    
    navigator.clipboard.writeText(preEl.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <pre
        {...props}
        className={clsx(
          "p-4 rounded-xl overflow-x-auto bg-[#0d1117] text-sm", // standard dark theme code bg
          className
        )}
      >
        {children}
      </pre>
      
      <button
        onClick={handleCopy}
        className={clsx(
          "absolute top-2 right-2 p-2 rounded-lg bg-content2/80 backdrop-blur border border-divider",
          "opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2",
          copied ? "text-success border-success/50" : "text-muted-foreground hover:text-foreground"
        )}
        title="Copy Code"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-xs font-medium">Copied</span>
          </>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        )}
      </button>
    </div>
  );
}
