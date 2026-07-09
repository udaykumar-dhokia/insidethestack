"use client";

import { useState, useEffect } from 'react';

interface FloatingActionButtonsProps {
  title: string;
  platformUrl?: string;
}

export function FloatingActionButtons({ title, platformUrl }: FloatingActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share gets cancelled or fails
        console.error("Share failed", err);
      }
    }
    
    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-3 z-50">
      {platformUrl && (
        <a 
          href={platformUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 rounded-full bg-content2 border border-divider shadow-lg hover:border-primary hover:text-primary transition-all duration-300"
          title="Visit Platform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      )}

      <button
        onClick={handleShare}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-content2 border border-divider shadow-lg hover:border-primary hover:text-primary transition-all duration-300"
        title="Share Article"
      >
        {copied ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        )}

        {copied && (
          <span className="absolute right-full mr-4 bg-foreground text-background text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Link Copied!
          </span>
        )}
      </button>
    </div>
  );
}
