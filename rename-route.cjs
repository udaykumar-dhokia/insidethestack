const fs = require('fs');

function replaceInFile(filePath, search, replace) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(search)) {
    fs.writeFileSync(filePath, content.replaceAll(search, replace));
    console.log(`Updated ${filePath}`);
  }
}

// 1. config/site.ts
replaceInFile('config/site.ts', 'href: "/articles"', 'href: "/insidethestack"');
replaceInFile('config/site.ts', 'label: "Articles"', 'label: "InsideTheStack"');

// 2. app/about/page.tsx
replaceInFile('app/about/page.tsx', 'href="/articles"', 'href="/insidethestack"');

// 3. app/blog/page.tsx
replaceInFile('app/blog/page.tsx', 'href="/articles"', 'href="/insidethestack"');

// 4. app/page.tsx
replaceInFile('app/page.tsx', 'href="/articles"', 'href="/insidethestack"');

// 5. app/pricing/page.tsx
replaceInFile('app/pricing/page.tsx', 'href="/articles"', 'href="/insidethestack"');

// 6. components/articles-sidebar.tsx
replaceInFile('components/articles-sidebar.tsx', 'href="/articles"', 'href="/insidethestack"');

// 7. components/footer.tsx
replaceInFile('components/footer.tsx', 'href="/articles"', 'href="/insidethestack"');
replaceInFile('components/footer.tsx', '>Articles<', '>InsideTheStack<');
replaceInFile('components/footer.tsx', '> Articles <', '> InsideTheStack <');
replaceInFile('components/footer.tsx', 'Articles\n            </NextLink>', 'InsideTheStack\n            </NextLink>');

// 8. components/recent-articles.tsx
replaceInFile('components/recent-articles.tsx', 'href={`/articles/${article.slug}`}', 'href={`/insidethestack/${article.slug}`}');

// 9. components/articles-explorer.tsx
replaceInFile('components/articles-explorer.tsx', 'href={`/articles/${article.slug}`}', 'href={`/insidethestack/${article.slug}`}');
replaceInFile('components/articles-explorer.tsx', 'placeholder="Search articles..."', 'placeholder="Search InsideTheStack..."');

// 10. app/insidethestack/page.tsx
replaceInFile('app/insidethestack/page.tsx', 'https://udaykumar-dhokia.github.io/insidethestack/articles', 'https://udaykumar-dhokia.github.io/insidethestack/insidethestack');

// 11. app/insidethestack/[slug]/page.tsx
replaceInFile('app/insidethestack/[slug]/page.tsx', 'https://udaykumar-dhokia.github.io/insidethestack/articles', 'https://udaykumar-dhokia.github.io/insidethestack/insidethestack');
replaceInFile('app/insidethestack/[slug]/page.tsx', 'href={`/articles/${related.slug}`}', 'href={`/insidethestack/${related.slug}`}');
