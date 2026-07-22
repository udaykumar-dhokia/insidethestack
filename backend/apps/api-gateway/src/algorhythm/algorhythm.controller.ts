import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AlgorhythmService } from './algorhythm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('api/algorhythm')
export class AlgorhythmController {
  constructor(private readonly algorhythmService: AlgorhythmService) {}

  @UseGuards(JwtAuthGuard)
  @Get('questions')
  async getQuestions(@Request() req: any) {
    return this.algorhythmService.getQuestions(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reviews/today')
  async getDueReviews(@Request() req: any) {
    return this.algorhythmService.getDueReviews(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reviews/:questionId')
  async submitReview(
    @Request() req: any,
    @Param('questionId') questionId: string,
    @Body('rating') rating: number,
  ) {
    return this.algorhythmService.submitReview(req.user.userId, questionId, rating);
  }
}

