import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../utils/apiRequest";

export const useRestaurantQuery = () =>
  useQuery({
    initialData: [],
    queryKey: ["restaurants"],
    queryFn: async () => {
      const res = (await apiRequest.get("/restaurant")).data;
      return res.data;
    },
  });
export const useStocksQuery = () =>
  useQuery({
    initialData: [],
    queryKey: ["stocks"],
    queryFn: async () => {
      const res = (await apiRequest.get("/stock")).data;
      return res.data;
    },
  });

// Add this to your existing queries file
export const useConsumptionsQuery = (filters) => {
  return useQuery({
    queryKey: ['consumptions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.restaurantId) params.append('restaurantId', filters.restaurantId);
      if (filters.stockId) params.append('stockId', filters.stockId);
      if (filters.ordreId) params.append('ordreId', filters.ordreId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiRequest.get(`/storage/history/consumptions?${params}`);
      return response.data;
    },
    enabled: Boolean(filters.restaurantId || filters.stockId || filters.ordreId),
  });
};
