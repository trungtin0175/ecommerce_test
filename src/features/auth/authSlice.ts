import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import {
  saveTokenToStorage,
  removeTokenFromStorage,
} from "../../utils/tokenUtils";

type User = {
  id: number;
  username: string;
  email?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      saveTokenToStorage(action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      removeTokenFromStorage();
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setCredentials, logout, setToken } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
