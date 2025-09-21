import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosClient from "./axiosClient";
import type {
  AddToCartPayload,
  ICart,
  UpdateCartPayload,
} from "../../interfaces/ICart";

export function useCartByUser(userId: number) {
  return useQuery<ICart, AxiosError>({
    queryKey: ["cart", "user", userId],
    queryFn: async () => {
      const response = await axiosClient.get(`/carts/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation<ICart, AxiosError, UpdateCartPayload>({
    mutationFn: async ({ cartId, products }) => {
      const response = await axiosClient.put(`/carts/${cartId}`, { products });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart", "user", data.userId],
      });
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<ICart, AxiosError, AddToCartPayload>({
    mutationFn: async (payload) => {
      const response = await axiosClient.post(`/carts/add`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart", "user", data.userId],
      });
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();

  return useMutation<
    { isDeleted: boolean; id: number },
    AxiosError,
    { cartId: number; userId: number }
  >({
    mutationFn: async ({ cartId }) => {
      const response = await axiosClient.delete(`/carts/${cartId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cart", "user", variables.userId],
      });
    },
  });
}
