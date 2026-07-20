import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local if it exists
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const baseUrl = "https://udaykumar-dhokia.github.io/insidethestack";
const BUILD_DATE = new Date("2026-07-16T00:00:00.000Z");
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://insidethestack-backend.onrender.com";

async function fetchArticles() {
  try {
    const res = await fetch(`${API_BASE}/articles?limit=100`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("Failed to fetch articles:", err.message);
    return [];
  }
}

function toISOString(dateStr) {
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return BUILD_DATE.toISOString();
  }
}

function buildSitemapXml(articles) {
  const staticPages = [
    { url: `${baseUrl}/`, lastmod: BUILD_DATE.toISOString() },
    { url: `${baseUrl}/articles/`, lastmod: BUILD_DATE.toISOString() },
    { url: `${baseUrl}/about/`, lastmod: BUILD_DATE.toISOString() },
    { url: `${baseUrl}/pricing/`, lastmod: BUILD_DATE.toISOString() },
    { url: `${baseUrl}/blog/`, lastmod: BUILD_DATE.toISOString() },
    { url: `${baseUrl}/docs/`, lastmod: BUILD_DATE.toISOString() },
  ];

  const articleEntries = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastmod: toISOString(article.published_at || BUILD_DATE),
  }));

  const allEntries = [...staticPages, ...articleEntries];

  const urlTags = allEntries
    .map(
      ({ url, lastmod }) =>
        `<url>\n<loc>${url}</loc>\n<lastmod>${lastmod}</lastmod>\n</url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>`;
}

async function main() {
  console.log("🗺️  Generating sitemap.xml...");

  const articles = await fetchArticles();
  console.log(`   Found ${articles.length} articles from API`);

  const xml = buildSitemapXml(articles);

  // Write to public/ so Next.js copies it to out/ during build
  const publicDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf-8");
  console.log(`   ✔ Written to public/sitemap.xml`);

  // Also write to out/ if it exists (post-build override, in case Next.js regenerated it)
  const outDir = path.join(__dirname, "..", "out");
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");
    console.log(`   ✔ Written to out/sitemap.xml`);
  }

  console.log(`✅  Done — ${articles.length} articles + 6 static pages`);
}

main();
