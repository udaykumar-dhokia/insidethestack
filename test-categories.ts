import { getArticlesFromApi } from "./lib/articles";

async function test() {
  const articles = await getArticlesFromApi();
  const dynamicCategories: Record<string, Set<string>> = {};
  articles.forEach((article) => {
    const cat = article.meta.category;
    const sub = article.meta.subCategory;
    if (cat) {
      if (!dynamicCategories[cat]) {
        dynamicCategories[cat] = new Set();
      }
      if (sub) {
        dynamicCategories[cat].add(sub);
      }
    }
  });
  console.log("Categories from API:");
  Object.entries(dynamicCategories).forEach(([key, value]) => {
    console.log(`- "${key}":`, Array.from(value));
  });
}

test();
