import { baseApi } from "./baseApi";

export const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: (params) => ({
        url: "/articles",
        params,
      }),
    }),
    getArticleBySlug: builder.query({
      query: (slug: string) => `/articles/${slug}`,
    }),
    getArticleStats: builder.query({
      query: (slug: string) => `/articles/${slug}/stats`,
    }),
    createArticle: builder.mutation({
      query: (body) => ({
        url: "/articles",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetArticlesQuery, useGetArticleBySlugQuery, useGetArticleStatsQuery, useCreateArticleMutation } = articlesApi;
