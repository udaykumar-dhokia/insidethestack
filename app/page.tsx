import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { ArrowUpRight } from "@/components/phosphor";
import { RecentArticles } from "@/components/recent-articles";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: 'https://udaykumar-dhokia.github.io/insidethestack',
    description: siteConfig.description,
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Script
        id="json-ld-homepage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="inline-block max-w-4xl text-center justify-center">
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
      </h1>
      <div className="flex gap-3">
        <a
          className="button button--primary button--md rounded-full"
          href="/articles"
          rel="noopener noreferrer"
        >
          Explore Articles <ArrowUpRight size={32} />
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
        <h2 className="text-2xl font-bold mb-8 text-left border-b border-divider pb-2">
          Recent Articles
        </h2>
        <RecentArticles />
      </div>
    </section>
  );
}
