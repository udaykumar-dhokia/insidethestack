import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { ArrowUpRight } from "@/components/phosphor";
import { RecentArticles } from "@/components/recent-articles";
import { Metadata } from "next";
import Script from "next/script";
import NextLink from "next/link";

export const metadata: Metadata = {
  title: "coDecode | Code. Decode. Master Software Engineering.",
  description: "Discover how the world's biggest software platforms are built. Learn how modern applications work under the hood with deep architectural breakdowns, system design, and cloud engineering.",
  alternates: {
    canonical: "https://udaykumar-dhokia.github.io/insidethestack",
  },
  openGraph: {
    title: "coDecode | Code. Decode. Master Software Engineering.",
    description: "Discover how the world's biggest software platforms are built. Learn how modern applications work under the hood with deep architectural breakdowns, system design, and cloud engineering.",
    url: "https://udaykumar-dhokia.github.io/insidethestack",
    type: "website",
  },
  twitter: {
    title: "coDecode | Code. Decode. Master Software Engineering.",
    description: "Discover how the world's biggest software platforms are built. Learn how modern applications work under the hood with deep architectural breakdowns, system design, and cloud engineering.",
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
        name: 'coDecode',
        description: siteConfig.description,
        publisher: {
          '@id': 'https://udaykumar-dhokia.github.io/insidethestack/#organization'
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://udaykumar-dhokia.github.io/insidethestack/insidethestack?query={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          }
        ],
        inLanguage: 'en-US'
      },
      {
        '@type': 'Organization',
        '@id': 'https://udaykumar-dhokia.github.io/insidethestack/#organization',
        name: 'coDecode',
        url: 'https://udaykumar-dhokia.github.io/insidethestack',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://udaykumar-dhokia.github.io/insidethestack/#logo',
          url: 'https://udaykumar-dhokia.github.io/insidethestack/favicon.ico',
          caption: 'coDecode'
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
        <span className={title()}>Code.&nbsp;</span>
        <span className={title({ color: "blue" })}>Decode.&nbsp;</span>
        <br />
        <span className={title()}>Master Software Engineering.</span>

        <div className={subtitle({ class: "mt-6" })}>
          The ultimate platform for developers. Master data structures, build your algorithms rhythm, and reverse-engineer the architecture of the world's biggest platforms.
        </div>
      </h1>
      <div className="flex gap-3">
        <NextLink
          className="button button--primary button--md rounded-full"
          href="/insidethestack"
        >
          Explore InsideTheStack <ArrowUpRight size={32} />
        </NextLink>
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
          Welcome to <strong>coDecode</strong>, your premier ecosystem to master the art of software engineering. 
          Whether you are preparing for a system design interview, practicing your algorithms, or simply curious about infrastructure choices, you will find everything you need right here.
        </p>
        <p>
          Dive into <strong>InsideTheStack</strong> to demystify software architecture and explore the tradeoffs behind different databases and distributed systems built by engineering teams at companies like Netflix, WhatsApp, and Stripe.
        </p>
        <p>
          Stay tuned for our upcoming <strong>DSA Mastery App</strong> to leverage spaced repetition and supercharge your algorithmic problem-solving skills for your next technical interview!
        </p>
      </div>

      <div className="mt-16 w-full">
        <div className="flex justify-between items-end mb-6 border-b border-divider pb-2">
          <h2 className="text-2xl font-bold text-left">
            Recent Articles
          </h2>
          <NextLink href="/insidethestack" className="text-primary hover:underline font-medium flex items-center gap-1 mb-1">
            Explore InsideTheStack <ArrowUpRight size={20} />
          </NextLink>
        </div>
        <RecentArticles />
      </div>
    </section>
  );
}
