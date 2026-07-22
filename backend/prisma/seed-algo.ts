import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import 'dotenv/config';

async function main() {
  const { PrismaClient } = await import('../generated/prisma/client');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  console.log('Fetching NeetCode 150 JSON...');
  const res = await fetch('https://raw.githubusercontent.com/krmanik/Anki-NeetCode/main/neetcode-150-list.json');
  const data = await res.json();

  console.log('Seeding AlgoQuestions...');
  let count = 0;

  for (const topic in data) {
    const problems = data[topic];
    for (const title in problems) {
      const details = problems[title];
      
      // Extract slug from URL (e.g. https://leetcode.com/problems/contains-duplicate/)
      const urlMatches = details.url.match(/problems\/([^\/]+)/);
      const slug = urlMatches ? urlMatches[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Map difficulty string to Enum
      const diffString = details.difficulty.toUpperCase();
      let difficulty = 'MEDIUM';
      if (diffString === 'EASY') difficulty = 'EASY';
      if (diffString === 'HARD') difficulty = 'HARD';

      await prisma.algoQuestion.upsert({
        where: { slug },
        update: {
          title,
          difficulty,
          topic,
          leetcodeUrl: details.url,
        },
        create: {
          title,
          slug,
          difficulty,
          topic,
          leetcodeUrl: details.url,
        },
      });
      count++;
    }
  }

  console.log(`Successfully seeded ${count} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
