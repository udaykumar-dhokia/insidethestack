import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About InsideTheStack - Behind Massive Platforms",
  description: "Learn about the mission of InsideTheStack to dissect the architecture, system design, and engineering patterns of large scale systems.",
  alternates: {
    canonical: "https://udaykumar-dhokia.github.io/insidethestack/about",
  },
  openGraph: {
    title: "About InsideTheStack - Behind Massive Platforms",
    description: "Learn about the mission of InsideTheStack to dissect the architecture, system design, and engineering patterns of large scale systems.",
    url: "https://udaykumar-dhokia.github.io/insidethestack/about",
    type: "website",
  },
  twitter: {
    title: "About InsideTheStack - Behind Massive Platforms",
    description: "Learn about the mission of InsideTheStack to dissect the architecture, system design, and engineering patterns of large scale systems.",
  }
};

export default function AboutPage() {
  return (
    <article className="prose dark:prose-invert text-left mx-auto max-w-2xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">About InsideTheStack</h1>
        <p className="text-xl text-muted-foreground">Demystifying software architecture at scale.</p>
      </header>
      
      <section className="space-y-6 text-foreground/80">
        <p>
          Welcome to <strong>InsideTheStack</strong>. Our mission is to dissect, analyze, and explain the architecture, infrastructure, and engineering decisions behind the world's most successful software platforms.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 text-foreground">Why InsideTheStack?</h2>
        <p>
          As software applications grow to serve millions (or billions) of users, engineering teams face unprecedented scalability, reliability, and security challenges. Textbooks can only teach you so much; real-world engineering happens under pressure, where teams must balance trade-offs, choose between relational and non-relational databases, implement caching strategies, design microservices, and evolve legacy systems.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 text-foreground">What We Cover</h2>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>System Design Deep Dives:</strong> How platforms like Netflix, ChatGPT, Vercel, and WhatsApp design their systems.</li>
          <li><strong>Database Decisions:</strong> Choosing, sharding, and scale-out strategies for databases.</li>
          <li><strong>Real-time Architectures:</strong> WebSockets, message brokers (Kafka, RabbitMQ), and live update streams.</li>
          <li><strong>Engineering Trade-offs:</strong> Monoliths vs. Microservices, Serverless, and edge computing.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 text-foreground">Get Involved</h2>
        <p>
          InsideTheStack is built for developers, system designers, architects, and engineering managers. Check out our <a href="/insidethestack" className="text-primary hover:underline">latest articles</a> to start learning, or connect with us on <a href="https://github.com/udaykumar-dhokia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
        </p>
      </section>
    </article>
  );
}
