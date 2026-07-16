import { baseApi } from "./baseApi";

export const likesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLikeStatus: builder.query<
      { isLiked: boolean; likes_count: number },
      string
    >({
      query: (postId) => `/likes/${postId}`,
      providesTags: (result, error, postId) => [
        { type: "Like" as const, id: postId },
      ],
    }),
    toggleLike: builder.mutation<
      { isLiked: boolean; likes_count: number },
      string
    >({
      query: (postId) => ({
        url: `/likes/${postId}`,
        method: "POST",
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          likesApi.util.updateQueryData("getLikeStatus", postId, (draft) => {
            if (draft) {
              if (draft.isLiked) {
                draft.isLiked = false;
                draft.likes_count = Math.max(0, draft.likes_count - 1);
              } else {
                draft.isLiked = true;
                draft.likes_count += 1;
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, postId) => [
        { type: "Like" as const, id: postId },
      ],
    }),
  }),
});

export const { useGetLikeStatusQuery, useToggleLikeMutation } = likesApi;
