import { getArticleBySlugFromApi, getArticlesFromApi, Article } from '@/lib/articles';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { components, slugify } from '@/components/mdx-components';
import { FloatingActionButtons } from '@/components/floating-action-buttons';
import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlugFromApi(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const keywords = ["Software Architecture", "System Design", "Engineering Case Study"];
  if (article.meta.category) keywords.push(article.meta.category);
  if (article.meta.subCategory) keywords.push(article.meta.subCategory);

  return {
    title: `${article.meta.title} | InsideTheStack`,
    description: article.meta.description,
    keywords: keywords,
    alternates: {
      canonical: `https://udaykumar-dhokia.github.io/insidethestack/articles/${article.slug}`,
    },
    openGraph: {
      title: `${article.meta.title} | InsideTheStack`,
      description: article.meta.description,
      type: 'article',
      url: `https://udaykumar-dhokia.github.io/insidethestack/articles/${article.slug}`,
      publishedTime: article.meta.date ? new Date(article.meta.date).toISOString() : undefined,
      modifiedTime: article.meta.date ? new Date(article.meta.date).toISOString() : undefined,
      authors: ['https://github.com/udaykumar-dhokia'],
      images: article.meta.image ? [{ url: article.meta.image, alt: article.meta.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.meta.title} | InsideTheStack`,
      description: article.meta.description,
      creator: '@udaykumardhokia',
      images: article.meta.image ? [article.meta.image] : [],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticlesFromApi();
  if (!articles || articles.length === 0) {
    return [{ slug: 'fallback' }];
  }
  return articles.map((article) => ({
    slug: article?.slug,
  }));
}

export function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string; children: Array<{ level: number; text: string; id: string }> }> = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = slugify(match[2]);

    if (level === 2) {
      headings.push({ level, text, id, children: [] });
    } else if (level === 3) {
      if (headings.length > 0) {
        headings[headings.length - 1].children.push({ level, text, id });
      }
    }
  }
  return headings;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlugFromApi(slug);

  if (!article) {
    notFound();
  }

  const headings = extractHeadings(article.content);
  const allArticles = await getArticlesFromApi();
  
  // Find related articles (same category or subcategory, excluding current)
  const relatedArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .filter(a => a.meta.category === article.meta.category || a.meta.subCategory === article.meta.subCategory)
    .slice(0, 2);

  // If we don't have enough related by category, just backfill with recent ones
  if (relatedArticles.length < 2) {
    const backfill = allArticles
      .filter(a => a.slug !== article.slug && !relatedArticles.find(r => r.slug === a.slug))
      .slice(0, 2 - relatedArticles.length);
    relatedArticles.push(...backfill);
  }

  const questionRegex = /^(how|what|why|where|when|is|are|can|do|does)\b|\?$/i;
  const faqItems = headings
    .filter(h => questionRegex.test(h.text))
    .map(h => {
      const escapedText = h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`^#{2,3}\\s+${escapedText}\\s*\\n+([^#]+)`, 'm');
      const match = article.content.match(regex);
      if (match && match[1]) {
        let answer = match[1].split(/\n\s*\n/)[0].trim();
        answer = answer.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_`]/g, '');
        if (answer.length > 20) {
          return {
            '@type': 'Question',
            name: h.text,
            acceptedAnswer: {
              '@type': 'Answer',
              text: answer
            }
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `https://udaykumar-dhokia.github.io/insidethestack/articles/${article.slug}#article`,
        headline: article.meta.title,
        description: article.meta.description,
        image: article.meta.image ? [article.meta.image] : [],
        datePublished: article.meta.date ? new Date(article.meta.date).toISOString() : undefined,
        dateModified: article.meta.date ? new Date(article.meta.date).toISOString() : undefined,
        mainEntityOfPage: `https://udaykumar-dhokia.github.io/insidethestack/articles/${article.slug}`,
        author: {
          '@type': 'Person',
          name: article.meta.author || 'udthedeveloper',
          url: 'https://github.com/udaykumar-dhokia',
        },
        publisher: {
          '@type': 'Organization',
          name: 'InsideTheStack',
          url: 'https://udaykumar-dhokia.github.io/insidethestack',
          logo: {
            '@type': 'ImageObject',
            url: 'https://udaykumar-dhokia.github.io/insidethestack/favicon.ico'
          }
        },
        about: [
          article.meta.category ? { '@type': 'Thing', name: article.meta.category } : undefined,
          article.meta.subCategory ? { '@type': 'Thing', name: article.meta.subCategory } : undefined,
        ].filter(Boolean),
        keywords: [article.meta.category, article.meta.subCategory, "System Architecture", "How it Works"].filter(Boolean).join(", ")
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://udaykumar-dhokia.github.io/insidethestack/articles/${article.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://udaykumar-dhokia.github.io/insidethestack',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Articles',
            item: 'https://udaykumar-dhokia.github.io/insidethestack/articles',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.meta.title,
            item: `https://udaykumar-dhokia.github.io/insidethestack/articles/${article.slug}`,
          },
        ],
      }
    ]
  };

  if (faqItems.length > 0) {
    jsonLd['@graph'].push({
      '@type': 'FAQPage',
      '@id': `https://udaykumar-dhokia.github.io/insidethestack/articles/${article.slug}#faq`,
      mainEntity: faqItems
    });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start w-full py-4">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="flex-1 w-full min-w-0 max-w-[850px]">
        <header className="mb-10 text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            {article.meta.title}
          </h1>
          {article.meta.description && (
            <p className="text-xl text-muted-foreground mb-6">
              {article.meta.description}
            </p>
          )}
          <div className="flex items-center justify-start gap-4 text-sm text-muted-foreground">
            {article.meta.date && (
              <time dateTime={article.meta.date}>
                {new Date(article.meta.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
            {article.meta.author && <span>By {article.meta.author}</span>}
          </div>
        </header>
        
        {article.meta.image && (
          <div className="w-full mb-10 rounded-2xl overflow-hidden shadow-lg border border-divider bg-content2 flex justify-center">
            <img 
              src={article.meta.image} 
              alt={article.meta.title}
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
          <MDXRemote 
            source={article.content} 
            components={components} 
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  [rehypePrettyCode as any, {
                    theme: 'github-dark',
                  }]
                ],
              }
            }}
          />
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-divider">
            <h2 className="text-2xl font-bold mb-6">Read Next</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map(related => (
                <Link 
                  key={related.slug} 
                  href={`/articles/${related.slug}`}
                  className="group bg-content2 border border-divider rounded-xl overflow-hidden hover:border-primary transition-colors flex flex-col h-full shadow-sm"
                >
                  {related.meta.image && (
                    <div className="w-full h-32 relative overflow-hidden bg-background">
                      <img 
                        src={related.meta.image} 
                        alt={related.meta.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{related.meta.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{related.meta.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {headings.length > 0 && (
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-foreground/70">
            On this page
          </h3>
          <div className="flex flex-col gap-4 text-sm">
            {headings.map((heading, i) => (
              <div key={i} className="flex flex-col gap-2">
                <a 
                  href={`#${heading.id}`} 
                  className="font-medium text-foreground hover:text-primary transition-colors block leading-tight"
                >
                  {heading.text}
                </a>
                
                {heading.children.length > 0 && (
                  <div className="flex flex-col gap-2 pl-4 border-l border-divider ml-2">
                    {heading.children.map((sub, j) => (
                      <a 
                        key={j}
                        href={`#${sub.id}`} 
                        className="text-muted-foreground hover:text-foreground transition-colors block leading-tight"
                      >
                        {sub.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      )}

      <FloatingActionButtons 
        articleId={article.id}
        title={article.meta.title} 
        platformUrl={article.meta.platformUrl} 
      />
    </div>
  );
}
