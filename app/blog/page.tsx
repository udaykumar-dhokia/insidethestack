import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InsideTheStack Blog - Platform Engineering & Updates",
  description: "Stay updated with platform announcements, engineering news, and thoughts on system design from the InsideTheStack team.",
  alternates: {
    canonical: "https://udaykumar-dhokia.github.io/insidethestack/blog",
  },
  openGraph: {
    title: "InsideTheStack Blog - Platform Engineering & Updates",
    description: "Stay updated with platform announcements, engineering news, and thoughts on system design from the InsideTheStack team.",
    url: "https://udaykumar-dhokia.github.io/insidethestack/blog",
    type: "website",
  },
  twitter: {
    title: "InsideTheStack Blog - Platform Engineering & Updates",
    description: "Stay updated with platform announcements, engineering news, and thoughts on system design from the InsideTheStack team.",
  }
};

export default function BlogPage() {
  return (
    <article className="text-left mx-auto max-w-2xl py-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">InsideTheStack Blog</h1>
        <p className="text-xl text-muted-foreground">Platform engineering updates and developer thoughts.</p>
      </header>

      <section className="space-y-8 mt-12">
        <div className="bg-content2 border border-divider rounded-xl p-6">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Announcement</span>
          <h2 className="text-2xl font-bold mt-2 mb-3 text-foreground">Welcome to InsideTheStack!</h2>
          <p className="text-muted-foreground text-sm mb-4">
            We are excited to launch InsideTheStack, a dedicated platform to share architectural deep-dives of modern, high-scale software platforms.
          </p>
          <div className="text-xs text-muted-foreground">Published on July 16, 2026 by udthedeveloper</div>
        </div>

        <div className="border-t border-divider pt-8 text-center">
          <h3 className="text-lg font-semibold mb-2">More updates coming soon!</h3>
          <p className="text-muted-foreground text-sm">
            We are working on detailed write-ups about cloud hosting migration, performance fine-tuning, and new platform breakdowns. 
            Check back weekly, or explore our <a href="/articles" className="text-primary hover:underline">main articles explorer</a>.
          </p>
        </div>
      </section>
    </article>
  );
}
