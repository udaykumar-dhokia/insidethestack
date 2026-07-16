import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { ArrowUpRight } from "@/components/phosphor";
import { RecentArticles } from "@/components/recent-articles";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "InsideTheStack - Discover Software Architecture & System Design",
  description: "Discover how the world's biggest software platforms are built. Master scaling, microservices, cloud engineering, and technical tradeoffs with deep architectural breakdowns.",
  alternates: {
    canonical: "https://udaykumar-dhokia.github.io/insidethestack",
  },
  openGraph: {
    title: "InsideTheStack - Discover Software Architecture & System Design",
    description: "Discover how the world's biggest software platforms are built. Master scaling, microservices, cloud engineering, and technical tradeoffs with deep architectural breakdowns.",
    url: "https://udaykumar-dhokia.github.io/insidethestack",
    type: "website",
  },
  twitter: {
    title: "InsideTheStack - Discover Software Architecture & System Design",
    description: "Discover how the world's biggest software platforms are built. Master scaling, microservices, cloud engineering, and technical tradeoffs with deep architectural breakdowns.",
  }
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://udaykumar-dhokia.github.io/insidethestack/#website',
        url: 'https://udaykumar-dhokia.github.io/insidethestack',
        name: 'InsideTheStack',
        description: siteConfig.description,
        publisher: {
          '@id': 'https://udaykumar-dhokia.github.io/insidethestack/#organization'
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://udaykumar-dhokia.github.io/insidethestack/articles?query={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        ],
        inLanguage: 'en-US'
      },
      {
        '@type': 'Organization',
        '@id': 'https://udaykumar-dhokia.github.io/insidethestack/#organization',
        name: 'InsideTheStack',
        url: 'https://udaykumar-dhokia.github.io/insidethestack',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://udaykumar-dhokia.github.io/insidethestack/#logo',
          url: 'https://udaykumar-dhokia.github.io/insidethestack/favicon.ico',
          caption: 'InsideTheStack'
        },
        sameAs: [
          siteConfig.links.github,
          siteConfig.links.twitter
        ]
      }
    ]
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

      <div className="mt-16 max-w-4xl text-left flex flex-col gap-6 text-lg text-muted-foreground">
        <p>
          Welcome to <strong>InsideTheStack</strong>, your premier destination to discover how the world's biggest software platforms are built. 
          Understanding the architecture and system design of massively successful products is the key to leveling up as a software engineer.
        </p>
        <p>
          Whether you are preparing for a system design interview, building scalable microservices, or simply curious about the infrastructure 
          choices made by engineering teams at companies like Netflix, WhatsApp, Stripe, and Vercel, you will find comprehensive deep dives here. 
          We break down complex engineering concepts into digestible, actionable insights.
        </p>
        <p>
          Our mission is to demystify software architecture. We explore the tradeoffs behind different databases, the nuances of distributed systems, 
          and the evolution of tech stacks over time. Dive into our latest articles below to explore how industry-leading platforms tackle 
          unprecedented scale and reliability challenges every single day.
        </p>
      </div>

      <div className="mt-16 w-full">
        <h2 className="text-2xl font-bold mb-8 text-left border-b border-divider pb-2">
          Recent Articles
        </h2>
        <RecentArticles />
      </div>
    </section>
  );
}
