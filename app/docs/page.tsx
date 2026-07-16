import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InsideTheStack Documentation - Guide & References",
  description: "Learn how to contribute articles, set up the development environment, and write MDX deep dives for InsideTheStack.",
  alternates: {
    canonical: "https://udaykumar-dhokia.github.io/insidethestack/docs",
  },
  openGraph: {
    title: "InsideTheStack Documentation - Guide & References",
    description: "Learn how to contribute articles, set up the development environment, and write MDX deep dives for InsideTheStack.",
    url: "https://udaykumar-dhokia.github.io/insidethestack/docs",
    type: "website",
  },
  twitter: {
    title: "InsideTheStack Documentation - Guide & References",
    description: "Learn how to contribute articles, set up the development environment, and write MDX deep dives for InsideTheStack.",
  }
};

export default function DocsPage() {
  return (
    <article className="text-left mx-auto max-w-2xl py-6 prose dark:prose-invert">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Documentation</h1>
        <p className="text-xl text-muted-foreground">Contribution guidelines and platform details.</p>
      </header>

      <section className="space-y-6 text-foreground/80">
        <p>
          Welcome to the InsideTheStack documentation portal. This reference guide helps you understand how the platform works and how you can contribute high-quality architectural case studies.
        </p>

        <h2 className="text-2xl font-bold mt-8 text-foreground">Contribution Guide</h2>
        <p>
          InsideTheStack relies on submissions from the developer community. We value deep engineering breakdowns over superficial summaries.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 text-foreground">Submission Process</h3>
        <ol className="list-decimal list-inside space-y-2 pl-4">
          <li>Fork our repository on <a href="https://github.com/udaykumar-dhokia/insidethestack" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.</li>
          <li>Create a new markdown page under the `/content/articles` directory.</li>
          <li>Populate the frontmatter properties (title, description, category, author, publishing date).</li>
          <li>Submit a Pull Request for our team to review.</li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 text-foreground">MDX Content Formatting</h3>
        <p>
          InsideTheStack uses MDX. You can write standard markdown syntax, include HTML elements, use code highlight blocks (powered by Rehype Pretty Code & Shiki), and embed React components.
        </p>

        <div className="border-t border-divider mt-12 pt-6">
          <p className="text-sm text-muted-foreground">
            Need further help? Feel free to open an issue or start a discussion on our <a href="https://github.com/udaykumar-dhokia/insidethestack" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub repository</a>.
          </p>
        </div>
      </section>
    </article>
  );
}
