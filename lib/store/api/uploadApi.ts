import { baseApi } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ url: string; public_id: string }, FormData>({
      query: (formData) => ({
        url: "/upload/image",
        method: "POST",
        body: formData,
      }),
    }),
    cleanupImages: builder.mutation<{ success: boolean; count: number }, { publicIds: string[] }>({
      query: (data) => ({
        url: "/upload/cleanup",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useUploadImageMutation, useCleanupImagesMutation } = uploadApi;
