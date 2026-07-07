import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { getAllArticles } from "@/lib/articles";
import NextLink from "next/link";

export default function Home() {
  const recentArticles = getAllArticles().slice(0, 4);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-4xl text-center justify-center">
        <span className={title()}>Discover&nbsp;</span>
        <span className={title({ color: "blue" })}>How&nbsp;</span>
        <span className={title()}>the World's Biggest</span>
        <br />
        <span className={title()}>Software Platforms Are Built.</span>

        <div className={subtitle({ class: "mt-6" })}>
          Deep dives into the architecture, infrastructure, and engineering
          decisions behind products like ChatGPT, Netflix, WhatsApp, GitHub,
          Stripe, Vercel, and more.
        </div>
      </div>
      <div className="flex gap-3">
        <a
          className="button button--primary button--md rounded-full"
          href="/articles"
          rel="noopener noreferrer"
          target="_blank"
        >
          Explore Articles
        </a>
        <a
          className="button button--tertiary button--md rounded-full"
          href={siteConfig.links.github}
          rel="noopener noreferrer"
          target="_blank"
        >
          <GithubIcon size={20} />
          GitHub
        </a>
      </div>

      <div className="mt-20 w-full">
        <h2 className="text-2xl font-bold mb-8 text-left border-b border-divider pb-2">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {recentArticles.map((article) => (
            <NextLink 
              key={article.slug} 
              href={`/articles/${article.slug}`} 
              className="bg-surface shadow-surface border border-divider rounded-2xl flex flex-col items-start h-full p-4 w-full justify-between hover:bg-surface/80 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex flex-col gap-3 h-full w-full">
                {article.meta.image && (
                  <div className="w-full h-32 relative rounded-lg overflow-hidden mb-2">
                    <img 
                      src={article.meta.image} 
                      alt={article.meta.title} 
                      className="w-full h-full object-cover" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold leading-tight">{article.meta.title}</h3>
                <p className="text-muted-foreground line-clamp-2 text-sm">{article.meta.description}</p>
              </div>
              <div className="pt-4 flex flex-col items-start gap-2 w-full mt-auto">
                <div className="flex flex-wrap gap-2 w-full">
                  {article.meta.category && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md">
                      {article.meta.category}
                    </span>
                  )}
                  {article.meta.subCategory && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-md">
                      {article.meta.subCategory}
                    </span>
                  )}
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </section>
  );
}
