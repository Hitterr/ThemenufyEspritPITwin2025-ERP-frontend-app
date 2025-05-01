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
export const useConsumptionsQuery = () =>
	useQuery({
		queryKey: ["consumptions"],
		queryFn: async (filters = {}) => {
			console.log(filters);
			const response = await apiRequest.get(`/storage/history/consumptions`);
			return response.data;
		},
	});
export const usePriceHistoryQuery = () =>
	useQuery({
		queryKey: ["PriceHistory"],
		queryFn: async () => {
			const response = await apiRequest.get(`/storage/history/trends`);
			return response.data;
		},
	});
