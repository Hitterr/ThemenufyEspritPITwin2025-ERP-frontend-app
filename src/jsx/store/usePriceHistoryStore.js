import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const usePriceHistoryStore = create(
  devtools((set, get) => ({
    priceHistories: [],
    dailyPriceTrends: [],
    filterCriteria: {
      restaurantId: "",
      stockId: "",
      invoiceId: "",
      supplierId: "",
    },
    isLoading: false,
    error: null,

    // Fetch price histories
    fetchPriceHistories: async () => {
      const { filterCriteria } = get();
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}/storage/history/trends`, {
          params: {
            restaurantId: filterCriteria.restaurantId || undefined,
            stockId: filterCriteria.stockId || undefined,
            invoiceId: filterCriteria.invoiceId || undefined,
            supplierId: filterCriteria.supplierId || undefined,
          },
        });
        set({ priceHistories: response.data, isLoading: false });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        set({ error: errorMessage, isLoading: false });
      }
    },

    // Create price history
    createPriceHistory: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(
          `${API_URL}/storage/history/Prices`,
          {
            stockId: data.stockId,
            restaurantId: data.restaurantId,
            price: parseFloat(data.price),
            invoiceId: data.invoiceId,
            supplierId: data.supplierId || null,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status >= 400) {
          throw new Error(
            response.data?.message || "Failed to create price history"
          );
        }

        set((state) => ({
          priceHistories: [response.data, ...state.priceHistories],
          isLoading: false,
        }));

        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to create price history";
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    },

    // Update filter criteria
    setFilterCriteria: (newCriteria) => {
      set((state) => ({
        filterCriteria: { ...state.filterCriteria, ...newCriteria },
      }));
    },

    // Reset filters
    resetFilters: () => {
      set({
        filterCriteria: {
          restaurantId: "",
          stockId: "",
          invoiceId: "",
          supplierId: "",
        },
      });
    },

    // Fetch daily price trends
    fetchDailyPriceTrends: async () => {
      const { filterCriteria } = get();
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(
          `${API_URL}/storage/history/daily-trends`,
          {
            params: {
              restaurantId: filterCriteria.restaurantId || undefined,
              stockId: filterCriteria.stockId || undefined,
              supplierId: filterCriteria.supplierId || undefined,
            },
          }
        );
        set({ dailyPriceTrends: response.data, isLoading: false });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        set({ error: errorMessage, isLoading: false });
      }
    },
  }))
);

export default usePriceHistoryStore;
