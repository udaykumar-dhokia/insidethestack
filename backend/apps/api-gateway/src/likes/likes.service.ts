import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async getLikeStatus(postId: string, userId?: string) {
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
      select: { likes_count: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let isLiked = false;
    if (userId) {
      const existingLike = await this.prisma.likes.findFirst({
        where: { user_id: userId, post_id: postId },
      });
      isLiked = !!existingLike;
    }

    return {
      likes_count: post.likes_count,
      isLiked,
    };
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.likes.findFirst({
      where: { user_id: userId, post_id: postId },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.$transaction([
        this.prisma.likes.delete({ where: { id: existingLike.id } }),
        this.prisma.posts.update({
          where: { id: postId },
          data: { likes_count: { decrement: 1 } },
        }),
      ]);
      return { isLiked: false, likes_count: post.likes_count - 1 };
    } else {
      // Like
      await this.prisma.$transaction([
        this.prisma.likes.create({
          data: { user_id: userId, post_id: postId },
        }),
        this.prisma.posts.update({
          where: { id: postId },
          data: { likes_count: { increment: 1 } },
        }),
      ]);
      return { isLiked: true, likes_count: post.likes_count + 1 };
    }
  }
}
