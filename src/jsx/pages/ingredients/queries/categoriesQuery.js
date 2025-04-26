import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "../../../utils/apiRequest";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/categories`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });
};

// Query key constant for reuse
export const CATEGORIES_QUERY_KEY = ["categories"];
