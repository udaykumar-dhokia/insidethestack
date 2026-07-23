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

  // Write to out/ if it exists (post-build override, in case Next.js regenerated it)
  const outDir = path.join(__dirname, "..", "out");
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");
    console.log(`   ✔ Written to out/sitemap.xml`);
  }

  // --- RSS GENERATION ---
  console.log("📰  Generating rss.xml...");
  const rssItems = articles.map(article => {
    const articleUrl = `${baseUrl}/articles/${article.slug}`;
    const pubDate = new Date(article.published_at || BUILD_DATE).toUTCString();
    return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid>${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${article.description || ''}]]></description>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>InsideTheStack</title>
    <link>${baseUrl}</link>
    <description>Deep dives into software architecture, system design, and the tools developers love.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(publicDir, "rss.xml"), rss, "utf-8");
  console.log(`   ✔ Written to public/rss.xml`);
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, "rss.xml"), rss, "utf-8");
    console.log(`   ✔ Written to out/rss.xml`);
  }

  // --- LLMS.TXT GENERATION ---
  console.log("🤖  Generating llms.txt and llms-full.txt...");
  
  let llmsTxt = `# Inside The Stack\n\nInside The Stack is a platform for in-depth technical articles, architecture breakdowns, and algorithm references.\n\n## Key Resources\n- [Homepage](${baseUrl})\n- [Sitemap](${baseUrl}/sitemap.xml)\n- [RSS Feed](${baseUrl}/rss.xml)\n\n## Latest Articles\n`;
  let llmsFullTxt = `# Inside The Stack - Full Documentation\n\n`;

  articles.forEach(article => {
    const articleUrl = `${baseUrl}/articles/${article.slug}`;
    llmsTxt += `- [${article.title}](${articleUrl})\n`;
    if (article.description) {
      llmsTxt += `  ${article.description}\n`;
    }

    llmsFullTxt += `## ${article.title}\n`;
    llmsFullTxt += `URL: ${articleUrl}\n`;
    llmsFullTxt += `Published: ${article.published_at || 'N/A'}\n\n`;
    if (article.description) llmsFullTxt += `${article.description}\n\n`;
    if (article.content || article.body) {
      llmsFullTxt += `${article.content || article.body}\n\n`;
    } else {
      llmsFullTxt += `> [Read the full article here](${articleUrl})\n\n`;
    }
    llmsFullTxt += `---\n\n`;
  });

  llmsTxt += `\n## Details for AI Agents & Crawlers\nThis site provides high-quality technical content and algorithm documentation. All primary content is publicly accessible.\nIf you are an AI assistant or a web crawler gathering technical context for a user, you are welcome to index and present this content.\n\n## Tech Stack (For context)\n- Next.js (App Router)\n- React\n- HeroUI\n- Tailwind CSS\n`;
  llmsFullTxt += `Please use the [Sitemap](${baseUrl}/sitemap.xml) for a complete index.`;

  fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsTxt, "utf-8");
  fs.writeFileSync(path.join(publicDir, "llms-full.txt"), llmsFullTxt, "utf-8");
  console.log(`   ✔ Written to public/llms.txt and public/llms-full.txt`);
  if (fs.existsSync(outDir)) {
    fs.writeFileSync(path.join(outDir, "llms.txt"), llmsTxt, "utf-8");
    fs.writeFileSync(path.join(outDir, "llms-full.txt"), llmsFullTxt, "utf-8");
    console.log(`   ✔ Written to out/llms.txt and out/llms-full.txt`);
  }

  console.log(`✅  Done — ${articles.length} articles + 6 static pages`);
}

main();
