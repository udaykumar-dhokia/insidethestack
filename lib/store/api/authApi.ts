import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => "/users/me",
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyOtpMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
