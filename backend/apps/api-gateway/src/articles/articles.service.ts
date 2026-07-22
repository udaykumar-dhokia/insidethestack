import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { GetArticlesDto } from './dto/get-articles.dto';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetArticlesDto) {
    const { limit = 10, offset = 0, search, category, subCategory, authorId } = query;

    const where: any = {};

    if (category) {
      where.category = category;
    }
    if (subCategory) {
      where.subCategory = subCategory;
    }
    if (authorId) {
      where.user_id = authorId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.posts.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { published_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              username: true,
            },
          },
        },
      }),
      this.prisma.posts.count({ where }),
    ]);

    return {
      items,
      total,
      limit,
      offset,
    };
  }

  async findOneBySlug(slug: string) {
    const article = await this.prisma.posts.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            username: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    return article;
  }

  async getStats(slug: string) {
    const article = await this.prisma.posts.findUnique({
      where: { slug },
      select: { likes_count: true, views_count: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    return article;
  }

  async create(createArticleDto: CreateArticleDto, userId: string) {
    const slug =
      createArticleDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.random().toString(36).substring(2, 8);

    return this.prisma.posts.create({
      data: {
        ...createArticleDto,
        slug,
        user_id: userId,
        published_at: new Date(),
      },
    });
  }

  async recordView(slug: string, viewerHash: string) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Check if this user hash has viewed this article in the last 24 hours
    const existingView = await this.prisma.articleView.findFirst({
      where: {
        slug,
        viewerHash,
        created_at: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    if (existingView) {
      // Already viewed recently, just return current count without incrementing
      const article = await this.prisma.posts.findUnique({
        where: { slug },
        select: { views_count: true },
      });
      return { views_count: article?.views_count || 0, recorded: false };
    }

    // Insert new view record and increment total count
    await this.prisma.articleView.create({
      data: {
        slug,
        viewerHash,
      },
    });

    const updatedArticle = await this.prisma.posts.update({
      where: { slug },
      data: {
        views_count: { increment: 1 },
      },
      select: { views_count: true },
    });

    return { views_count: updatedArticle.views_count, recorded: true };
  }
}
