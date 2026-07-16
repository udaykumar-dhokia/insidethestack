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
}
