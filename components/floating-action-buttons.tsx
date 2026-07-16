"use client";

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useGetLikeStatusQuery, useToggleLikeMutation } from '@/lib/store/api/likesApi';
import { toast } from '@heroui/react';

interface FloatingActionButtonsProps {
  articleId?: string;
  title: string;
  platformUrl?: string;
}

export function FloatingActionButtons({ articleId, title, platformUrl }: FloatingActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const [showTop, setShowTop] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data: likeStatus, isLoading: isLikeStatusLoading } = useGetLikeStatusQuery(articleId as string, {
    skip: !articleId,
  });
  
  const [toggleLike, { isLoading: isToggling }] = useToggleLikeMutation();

  useEffect(() => {
    setUrl(window.location.href);

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTop(true);
      } else {
        setShowTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        console.error("Share failed", err);
      }
    }
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast("Authentication Required", {
        description: "Please log in to like this article.",
        variant: "warning",
      });
      return;
    }
    
    if (articleId) {
      try {
        await toggleLike(articleId).unwrap();
      } catch (err) {
        toast("Error", {
          description: "Could not update like status.",
          variant: "danger",
        });
      }
    }
  };

  const baseButtonClass = "group relative flex items-center justify-center w-14 h-14 rounded-full bg-content2/80 backdrop-blur-md border border-divider shadow-lg hover:border-primary hover:text-primary transition-all duration-300";

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col gap-3 z-50">
      {showTop && (
        <button
          onClick={scrollToTop}
          className={baseButtonClass}
          title="Scroll to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
      )}

      {articleId && (
        <button
          onClick={handleLike}
          disabled={isLikeStatusLoading || isToggling}
          className={baseButtonClass}
          title={likeStatus?.isLiked ? "Unlike Article" : "Like Article"}
        >
          {likeStatus?.isLiked ? (
            <svg className="w-6 h-6 text-danger" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          {likeStatus && likeStatus.likes_count > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md min-w-[20px] text-center">
              {likeStatus.likes_count}
            </span>
          )}
        </button>
      )}

      {platformUrl && (
        <a 
          href={platformUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={baseButtonClass}
          title="Visit Platform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </a>
      )}

      <button
        onClick={handleShare}
        className={baseButtonClass}
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
