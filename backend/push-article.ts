import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // First, find the user "udthedeveloper"
  let user = await prisma.user.findUnique({
    where: { username: 'udthedeveloper' }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        first_name: 'UD',
        username: 'udthedeveloper',
        email: 'ud@example.com',
        password: 'password123',
      }
    });
  }

  const articlePath = path.join(__dirname, '../content/articles/how-dropbox-works.mdx');
  const content = fs.readFileSync(articlePath, 'utf-8');
  const parsed = matter(content);
  
  const post = await prisma.posts.upsert({
    where: { slug: 'how-dropbox-works' },
    update: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category.toUpperCase().replace(' ', '_'),
      subCategory: parsed.data.subCategory,
      image: parsed.data.image,
      platformUrl: parsed.data.platformUrl,
      content: parsed.content,
      published_at: new Date(parsed.data.date),
    },
    create: {
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      slug: 'how-dropbox-works',
      category: parsed.data.category.toUpperCase().replace(' ', '_'),
      subCategory: parsed.data.subCategory,
      image: parsed.data.image,
      platformUrl: parsed.data.platformUrl,
      content: parsed.content,
      published_at: new Date(parsed.data.date),
    }
  });

  console.log('Successfully pushed article:', post.title);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
