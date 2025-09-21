import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DecodedToken } from "../../utils/tokenUtils";

export interface UserState {
  userId: number | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
  tokenExpiry: number | null;
}

const storedUserId = localStorage.getItem("id");

const initialState: UserState = {
  userId: storedUserId ? Number(storedUserId) : null,
  email: null,
  username: null,
  isAuthenticated: false,
  tokenExpiry: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserFromToken: (state, action: PayloadAction<DecodedToken>) => {
      const payload = action.payload;

      const userId =
        payload.userId || payload.sub || payload.id || payload.user_id || null;
      const { email, username, exp } = payload;

      state.userId = userId;
      state.email = email || null;
      state.username = username || null;
      state.isAuthenticated = !!userId;
      state.tokenExpiry = exp || null;
    },

    setUser: (
      state,
      action: PayloadAction<{
        userId: number;
        email?: string;
        username?: string;
        tokenExpiry?: number;
      }>
    ) => {
      const { userId, email, username, tokenExpiry } = action.payload;

      state.userId = userId;
      state.email = email || null;
      state.username = username || null;
      state.isAuthenticated = true;
      state.tokenExpiry = tokenExpiry || null;
    },

    clearUser: (state) => {
      state.userId = null;
      state.email = null;
      state.username = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
    },

    updateUserInfo: (
      state,
      action: PayloadAction<{
        email?: string;
        username?: string;
      }>
    ) => {
      const { email, username } = action.payload;

      if (email !== undefined) {
        state.email = email;
      }
      if (username !== undefined) {
        state.username = username;
      }
    },
  },
});

export const { setUserFromToken, setUser, clearUser, updateUserInfo } =
  userSlice.actions;

export default userSlice.reducer;
