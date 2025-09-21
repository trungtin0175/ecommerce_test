import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosClient from "./axiosClient";
import type { IProduct, IProductsResponse } from "../../interfaces/IProduct";

export function useProducts(limit: number = 20) {
  return useInfiniteQuery<IProductsResponse, AxiosError>({
    queryKey: ["products", limit],
    queryFn: async ({ pageParam = 0 }) => {
      if ((pageParam as number) > 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const response = await axiosClient.get(`/products`, {
        params: {
          limit,
          skip: pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    initialPageParam: 0,
  });
}

export function useProduct(id: number) {
  return useQuery<IProduct, AxiosError>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSearchProducts(query: string) {
  return useQuery<IProductsResponse, AxiosError>({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/search`, {
        params: {
          q: query,
        },
      });
      return response.data;
    },
    enabled: !!query,
  });
}

export function useProductsByCategory(category: string, limit: number = 20) {
  return useQuery<IProductsResponse, AxiosError>({
    queryKey: ["products", "category", category, limit],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/category/${category}`);
      return response.data;
    },
    enabled: !!category,
  });
}

export function useCategories() {
  return useQuery<string[], AxiosError>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosClient.get(`/products/categories`);
      return response.data;
    },
  });
}
