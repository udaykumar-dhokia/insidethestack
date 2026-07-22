import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Support - InsideTheStack",
  description: "InsideTheStack is free and open-source. Discover how you can support our system design deep-dives and platform breakdown publications.",
  alternates: {
    canonical: "https://udaykumar-dhokia.github.io/insidethestack/pricing",
  },
  openGraph: {
    title: "Pricing & Support - InsideTheStack",
    description: "InsideTheStack is free and open-source. Discover how you can support our system design deep-dives and platform breakdown publications.",
    url: "https://udaykumar-dhokia.github.io/insidethestack/pricing",
    type: "website",
  },
  twitter: {
    title: "Pricing & Support - InsideTheStack",
    description: "InsideTheStack is free and open-source. Discover how you can support our system design deep-dives and platform breakdown publications.",
  }
};

export default function PricingPage() {
  return (
    <article className="text-left mx-auto max-w-4xl py-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Pricing & Support</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          InsideTheStack is 100% free, open-source, and community-driven. Support our deep dives into software architecture.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Card 1: Free Tier */}
        <section className="bg-content2 border border-divider rounded-2xl p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Community</h2>
            <p className="text-muted-foreground text-sm mb-6">Learn and grow with our free publications.</p>
            <div className="text-3xl font-extrabold mb-6">$0 <span className="text-sm font-normal text-muted-foreground">/ forever</span></div>
            
            <ul className="space-y-3 text-sm text-foreground/80 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span> Access to all platform deep-dives
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span> Code snippets & system design diagrams
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span> Open source on GitHub
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span> Community discussions
              </li>
            </ul>
          </div>
          <a
            href="/insidethestack"
            className="w-full text-center bg-foreground text-background font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Read Articles
          </a>
        </section>

        {/* Card 2: Sponsor Tier */}
        <section className="bg-content2 border-2 border-primary rounded-2xl p-8 flex flex-col justify-between shadow-md relative">
          <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Sponsor
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Backer / Sponsor</h2>
            <p className="text-muted-foreground text-sm mb-6">Support high-quality tech publications.</p>
            <div className="text-3xl font-extrabold mb-6">Any Amount <span className="text-sm font-normal text-muted-foreground">/ optional</span></div>
            
            <ul className="space-y-3 text-sm text-foreground/80 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Keep InsideTheStack 100% independent
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Help cover research and API build hosting costs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Get credited on GitHub sponsors page
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Suggest upcoming platform breakdowns
              </li>
            </ul>
          </div>
          <a
            href="https://github.com/sponsors/udaykumar-dhokia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sponsor on GitHub
          </a>
        </section>
      </div>
    </article>
  );
}
