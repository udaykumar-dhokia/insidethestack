import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'articles');

export interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  category?: string;
  subCategory?: string;
  [key: string]: any;
}

export interface Article {
  id?: string;
  slug: string;
  meta: ArticleMeta;
  content: string;
  likes_count?: number;
}

export function getArticleBySlug(slug: string): Article | null {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDir, `${realSlug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug: realSlug,
    meta: data as ArticleMeta,
    content,
  };
}

export function getAllArticles() {
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  const files = fs.readdirSync(contentDir);
  const articles = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => getArticleBySlug(file))
    .filter((article): article is Article => article !== null);
  
  // Sort articles by date
  return articles.sort((a, b) => {
    if (!a?.meta.date || !b?.meta.date) return 0;
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });
}

export const CATEGORY_LABELS: Record<string, string> = {
  "AI": "AI",
  "DEVELOPER_TOOLS": "Developer Tools",
  "CLOUD": "Cloud",
  "PRODUCTIVITY": "Productivity",
  "DEVOPS_INFRASTRUCTURE": "DevOps & Infrastructure",
};

// Helper functions for fetching from the backend API
function mapApiArticleToLocal(item: any): Article {
  return {
    id: item.id,
    slug: item.slug,
    content: item.content,
    likes_count: item.likes_count,
    meta: {
      title: item.title,
      description: item.description,
      image: item.image,
      category: CATEGORY_LABELS[item.category] || item.category,
      subCategory: item.subCategory,
      date: item.published_at,
      author: item.user?.username,
      platformUrl: item.platformUrl,
    }
  };
}

export async function getArticlesFromApi(): Promise<Article[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/articles?limit=100`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).map(mapApiArticleToLocal);
  } catch (error) {
    console.error("Failed to fetch articles from API", error);
    return [];
  }
}

export async function getArticleBySlugFromApi(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/articles/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const item = await res.json();
    return mapApiArticleToLocal(item);
  } catch (error) {
    console.error(`Failed to fetch article ${slug} from API`, error);
    return null;
  }
}
