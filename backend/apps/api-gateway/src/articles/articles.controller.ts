import { Controller, Get, Post, Body, Param, Query, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { GetArticlesDto } from './dto/get-articles.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiCreatedResponse({ description: 'The article has been successfully created.' })
  create(@Body(new ValidationPipe()) createArticleDto: CreateArticleDto, @Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.articlesService.create(createArticleDto, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all articles',
    description:
      'Returns a paginated list of articles. Supports filtering by search term, category, subcategory, and author ID.',
  })
  @ApiOkResponse({ description: 'Articles retrieved successfully.' })
  findAll(
    @Query(new ValidationPipe({ transform: true })) query: GetArticlesDto,
  ) {
    return this.articlesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get an article by slug',
    description:
      'Returns the full details of a single article based on its unique slug.',
  })
  @ApiOkResponse({ description: 'Article retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Article not found.' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.articlesService.findOneBySlug(slug);
  }

  @Post(':slug/view')
  @ApiOperation({
    summary: 'Record a unique view for an article',
    description: 'Uses IP and User-Agent hashing to prevent duplicate counting within 24 hours.',
  })
  @ApiOkResponse({ description: 'View recorded successfully (or skipped if recent).' })
  async recordView(@Param('slug') slug: string, @Req() req: any) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    
    // Node.js crypto module to hash the viewer details
    const crypto = require('crypto');
    const viewerHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}-${secret}`)
      .digest('hex');

    return this.articlesService.recordView(slug, viewerHash);
  }
}
