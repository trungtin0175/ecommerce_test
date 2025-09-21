import type { IUser, UpdateUserPayload } from "./../../interfaces/IAuth";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { setUserFromToken, clearUser } from "../../features/user/userSlice";
import {
  decodeToken,
  isTokenExpired,
  getTokenFromStorage,
  removeTokenFromStorage,
} from "../../utils/tokenUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "./axiosClient";
import type { AxiosError } from "axios";

export function useUser() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const initializeUser = () => {
      const token = getTokenFromStorage();

      if (!token) {
        dispatch(clearUser());
        setIsInitialized(true);
        return;
      }

      if (isTokenExpired(token)) {
        removeTokenFromStorage();
        dispatch(clearUser());
        setIsInitialized(true);
        return;
      }

      const decodedToken = decodeToken(token);
      if (decodedToken) {
        dispatch(setUserFromToken(decodedToken));
      } else {
        removeTokenFromStorage();
        dispatch(clearUser());
      }
      setIsInitialized(true);
    };

    initializeUser();
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (!user.isAuthenticated || !user.tokenExpiry) {
      return;
    }

    const checkTokenExpiry = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      if (user.tokenExpiry && user.tokenExpiry < currentTime) {
        removeTokenFromStorage();
        dispatch(clearUser());
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [dispatch, user.isAuthenticated, user.tokenExpiry]);

  return {
    ...user,
    isInitialized,
    logout: () => {
      removeTokenFromStorage();
      dispatch(clearUser());
    },
    refreshUserFromToken: () => {
      const token = getTokenFromStorage();
      if (token && !isTokenExpired(token)) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          dispatch(setUserFromToken(decodedToken));
        }
      }
    },
  };
}

export function useUserId(): number | null {
  return useSelector((state: RootState) => state.user.userId);
}

export function useIsAuthenticated(): boolean {
  return useSelector((state: RootState) => state.user.isAuthenticated);
}

export function useUserEmail(): string | null {
  return useSelector((state: RootState) => state.user.email);
}

export function useUsername(): string | null {
  return useSelector((state: RootState) => state.user.username);
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<IUser, AxiosError, UpdateUserPayload>({
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.put(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user", data.id],
      });
    },
  });
}
