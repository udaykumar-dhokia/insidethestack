import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
    private readonly jwtService: JwtService,
  ) {}

  @Get(':postId')
  @ApiOperation({ summary: 'Get like status for a post' })
  @ApiParam({ name: 'postId', type: 'string' })
  async getLikeStatus(@Param('postId') postId: string, @Req() req: Request) {
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only',
        });
        userId = payload.sub || payload.id;
      } catch (e) {}
    }

    return this.likesService.getLikeStatus(postId, userId);
  }

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like status for a post' })
  @ApiParam({ name: 'postId', type: 'string' })
  async toggleLike(@Param('postId') postId: string, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.likesService.toggleLike(postId, userId);
  }
}
