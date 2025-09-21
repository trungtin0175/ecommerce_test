import type { AxiosError } from "axios";
import apiClient from "../../hooks/actions/axiosClient";
import type { UserLogin } from "../../interfaces/IAuth";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
  return useMutation<any, AxiosError, UserLogin>({
    mutationFn: (user) => apiClient.post("auth/login", user),
    onSuccess: (data) => {
      if (data?.data?.accessToken && data?.data?.id) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("id", data.data.id);
      }
    },
    onError: (error) => {
      console.error("Login error:", error.response?.data || error.message);
    },
  });
}
