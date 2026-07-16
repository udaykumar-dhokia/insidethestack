import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { authApi } from "../api/authApi";

interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name?: string;
  isEmailVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: Cookies.get("access_token") || null,
  isAuthenticated: !!Cookies.get("access_token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove("access_token");
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; access_token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      state.isAuthenticated = true;
      Cookies.set("access_token", action.payload.access_token, { expires: 7 });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.access_token;
        state.user = payload.user;
        state.isAuthenticated = true;
        Cookies.set("access_token", payload.access_token, { expires: 7 });
      },
    );
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.access_token;
        state.user = payload.user;
        state.isAuthenticated = true;
        Cookies.set("access_token", payload.access_token, { expires: 7 });
      },
    );
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
      },
    );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
