import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export interface AlgoQuestion {
  id: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  leetcodeUrl: string;
  status: "UNSEEN" | "LEARNING" | "REVIEW" | "MASTERED";
  nextReviewDate: string | null;
  lastReviewedAt: string | null;
  intervalDays: number;
  easeFactor: number;
  reviewCount: number;
}

export interface AlgoProgress {
  id: string;
  question_id: string;
  user_id: string;
  status: "LEARNING" | "REVIEW" | "MASTERED";
  ease_factor: number;
  interval_days: number;
  review_count: number;
  next_review_date: string;
  question: AlgoQuestion;
}

export interface HeatmapTopic {
  name: string;
  questions: AlgoQuestion[];
}

export interface HeatmapStats {
  totalSolved: number;
  dueToday: number;
  decaying: number;
  mastered: number;
}

export interface HeatmapData {
  topics: HeatmapTopic[];
  stats: HeatmapStats;
}

export const algorhythmApi = createApi({
  reducerPath: "algorhythmApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/api/algorhythm`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Questions", "Reviews"],
  endpoints: (builder) => ({
    getQuestions: builder.query<AlgoQuestion[], void>({
      query: () => "/questions",
      providesTags: ["Questions"],
    }),
    getDueReviews: builder.query<AlgoProgress[], void>({
      query: () => "/reviews/today",
      providesTags: ["Reviews"],
    }),
    submitReview: builder.mutation<
      AlgoProgress,
      { questionId: string; rating: number }
    >({
      query: ({ questionId, rating }) => ({
        url: `/reviews/${questionId}`,
        method: "POST",
        body: { rating },
      }),
      invalidatesTags: ["Questions", "Reviews"],
    }),
    getHeatmapData: builder.query<HeatmapData, void>({
      query: () => '/heatmap',
      providesTags: ['Questions', 'Reviews'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetDueReviewsQuery,
  useSubmitReviewMutation,
  useGetHeatmapDataQuery,
} = algorhythmApi;
