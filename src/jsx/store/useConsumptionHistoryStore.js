import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const useConsumptionHistoryStore = create(
	devtools((set, get) => ({
		consumptions: [],
		dailyTrends: [],
		filterCriteria: {
			restaurantId: "",
			stockId: "",
			ordreId: "",
		},
		isLoading: false,
		error: null,
		setFilterCriteria: (criteria) => {
			set((state) => ({
				filterCriteria: { ...state.filterCriteria, ...criteria },
			}));
			get().fetchConsumptions();
		},
		resetFilters: () => {
			set({ filterCriteria: { restaurantId: "", stockId: "", ordreId: "" } });
			get().fetchConsumptions();
		},
		fetchConsumptions: async () => {
			const { filterCriteria } = get();
			console.log("Filter Criteria:", filterCriteria); // Debug log
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(
					`${API_URL}/storage/history/consumptions`,
					{
						params: {
							restaurantId: filterCriteria.restaurantId || undefined,
							stockId: filterCriteria.stockId || undefined,
							ordreId: filterCriteria.ordreId || undefined,
						},
					}
				);
				console.log("Fetch Consumptions Response:", response.data); // Debug log
				set({ consumptions: response.data, isLoading: false });
			} catch (error) {
				console.error("Fetch Consumptions Error:", error.response || error); // Debug log
				set({
					error: error.response?.data?.message || error.message,
					isLoading: false,
				});
			}
		},
		createConsumption: async (stockId, restaurantId, ordreId, qty) => {
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.post(
					`${API_URL}/storage/history/consumptions`,
					{
						stockId,
						restaurantId,
						ordreId,
						qty,
					}
				);
				set((state) => ({
					consumptions: [response.data, ...state.consumptions],
					isLoading: false,
				}));
				return { success: true, data: response.data };
			} catch (error) {
				console.error("Create Consumption Error:", error.response || error); // Debug log
				set({ error: error.message, isLoading: false });
				return { success: false, error: error.message };
			}
		},
		fetchDailyTrends: async (restaurantId, days = 30) => {
			if (!restaurantId) {
				const errorMsg = "restaurantId is required";
				set({ error: errorMsg });
				throw new Error(errorMsg);
			}
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(
					`${API_URL}/storage/history/trends/daily/${restaurantId}`,
					{
						params: { days },
					}
				);
				console.log("Fetch Daily Trends Response:", response.data); // Debug log
				set({ dailyTrends: response.data, isLoading: false });
			} catch (error) {
				console.error("Fetch Daily Trends Error:", error.response || error); // Debug log
				set({ error: error.message, isLoading: false });
				throw error;
			}
		},
	}))
);
export default useConsumptionHistoryStore;
