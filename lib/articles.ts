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
  slug: string;
  meta: ArticleMeta;
  content: string;
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
