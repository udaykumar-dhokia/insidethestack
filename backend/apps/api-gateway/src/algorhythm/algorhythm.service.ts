import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class AlgorhythmService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(userId: string) {
    const questions = await this.prisma.algoQuestion.findMany({
      include: {
        progress: {
          where: { user_id: userId }
        }
      }
    });

    return questions.map(q => {
      const p = q.progress[0];
      return {
        id: q.id,
        title: q.title,
        slug: q.slug,
        difficulty: q.difficulty,
        topic: q.topic,
        leetcodeUrl: q.leetcodeUrl,
        status: p?.status || 'UNSEEN',
        nextReviewDate: p?.next_review_date || null
      };
    });
  }

  async getDueReviews(userId: string) {
    const now = new Date();
    const reviews = await this.prisma.algoProgress.findMany({
      where: {
        user_id: userId,
        next_review_date: {
          lte: now
        }
      },
      include: {
        question: true
      }
    });
    return reviews;
  }

  async submitReview(userId: string, questionId: string, rating: number) {
    // SuperMemo-2 (SM-2) algorithm simplified
    let progress = await this.prisma.algoProgress.findUnique({
      where: {
        user_id_question_id: {
          user_id: userId,
          question_id: questionId
        }
      }
    });

    if (!progress) {
      progress = await this.prisma.algoProgress.create({
        data: {
          user_id: userId,
          question_id: questionId,
          status: 'LEARNING',
        }
      });
    }

    let easeFactor = progress.ease_factor;
    let intervalDays = progress.interval_days;
    let reviewCount = progress.review_count;

    if (rating >= 3) {
      if (reviewCount === 0) {
        intervalDays = 1;
      } else if (reviewCount === 1) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor);
      }
      reviewCount++;
    } else {
      reviewCount = 0;
      intervalDays = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

    let status = 'REVIEW';
    if (reviewCount > 4) status = 'MASTERED';

    return this.prisma.algoProgress.update({
      where: { id: progress.id },
      data: {
        ease_factor: easeFactor,
        interval_days: intervalDays,
        review_count: reviewCount,
        next_review_date: nextReviewDate,
        status: status as any
      }
    });
  }
}
