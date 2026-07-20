import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';
import 'dotenv/config';

async function syncCategory(categoryEnumName: string) {
  const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
  let schema = fs.readFileSync(schemaPath, 'utf-8');
  
  // Find the Category enum
  const enumRegex = /enum Category\s*{([^}]*)}/;
  const match = schema.match(enumRegex);
  if (match) {
    const enumBody = match[1];
    // Check if category exists
    const existingValues = enumBody.split('\n').map(l => l.trim()).filter(Boolean);
    if (!existingValues.includes(categoryEnumName)) {
      console.log(`Adding new category enum value: ${categoryEnumName}`);
      const newEnumBody = enumBody.endsWith('\n') 
        ? `${enumBody}  ${categoryEnumName}\n`
        : `${enumBody}\n  ${categoryEnumName}\n`;
      schema = schema.replace(enumRegex, `enum Category {${newEnumBody}}`);
      fs.writeFileSync(schemaPath, schema);
      
      console.log('Running prisma db push...');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      
      console.log('Running prisma generate...');
      execSync('npx prisma generate', { stdio: 'inherit' });
    }
  }
}

async function main() {
  const slug = process.argv[2] || 'how-replit-works';
  const articlePath = path.join(__dirname, `../content/articles/${slug}.mdx`);
  const content = fs.readFileSync(articlePath, 'utf-8');
  const parsed = matter(content);
  
  const categoryEnumName = parsed.data.category.toUpperCase().replace(/ & /g, '_').replace(/ /g, '_');
  
  // Sync the category to Prisma schema first
  await syncCategory(categoryEnumName);
  
  // Dynamically import the generated client
  const { PrismaClient } = await import('./generated/prisma/client');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);
  
  try {
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
    
    const post = await prisma.posts.upsert({
      where: { slug: slug },
      update: {
        title: parsed.data.title,
        description: parsed.data.description,
        category: categoryEnumName,
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
        slug: slug,
        category: categoryEnumName,
        subCategory: parsed.data.subCategory,
        image: parsed.data.image,
        platformUrl: parsed.data.platformUrl,
        content: parsed.content,
        published_at: new Date(parsed.data.date),
      }
    });

    console.log('Successfully pushed article:', post.title);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
