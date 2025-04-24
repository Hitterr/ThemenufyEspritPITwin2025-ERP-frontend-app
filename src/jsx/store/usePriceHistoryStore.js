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
      ingredientId: "",
      supplierId: "",
    },
    isLoading: false,
    error: null,

    // Update filter criteria and refetch price histories
    setFilterCriteria: (criteria) => {
      set((state) => ({
        filterCriteria: { ...state.filterCriteria, ...criteria },
      }));
      get().fetchPriceHistories();
    },

    // Reset filter criteria and refetch price histories
    resetFilters: () => {
      set({
        filterCriteria: { restaurantId: "", ingredientId: "", supplierId: "" },
      });
      get().fetchPriceHistories();
    },

    // Fetch price histories based on filter criteria
    fetchPriceHistories: async () => {
      const { filterCriteria } = get();
      console.log("Price History Filter Criteria:", filterCriteria);
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URL}/storage/history/trends`, {
          params: {
            restaurantId: filterCriteria.restaurantId || undefined,
            ingredientId: filterCriteria.ingredientId || undefined,
            supplierId: filterCriteria.supplierId || undefined,
          },
        });
        console.log("Fetch Price Histories Response:", response.data);
        set({ priceHistories: response.data, isLoading: false });
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || `HTTP ${error.response.status}: ${error.response.statusText}`
          : error.message || "Network error or server unreachable";
        console.error("Fetch Price Histories Error:", {
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        });
        set({ error: errorMessage, isLoading: false });
      }
    },

    // Create a new price history record
    createPriceHistory: async (ingredientId, restaurantId, price, supplierId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API_URL}/storage/history/Prices`, {
          ingredientId,
          restaurantId,
          price,
          supplierId: supplierId || undefined,
        });
        set((state) => ({
          priceHistories: [response.data, ...state.priceHistories],
          isLoading: false,
        }));
        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || `HTTP ${error.response.status}: ${error.response.statusText}`
          : error.message || "Network error or server unreachable";
        console.error("Create Price History Error:", {
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        });
        set({ error: errorMessage, isLoading: false });
        return { success: false, error: errorMessage };
      }
    },

    // Fetch daily price trends for a specific ingredient and restaurant
    fetchDailyPriceTrends: async (ingredientId, restaurantId, days = 30) => {
      if (!ingredientId || !restaurantId) {
        const errorMsg = "ingredientId and restaurantId are required";
        set({ error: errorMsg });
        throw new Error(errorMsg);
      }
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(
          `${API_URL}/storage/history/trends/daily/${ingredientId}/${restaurantId}`,
          {
            params: { ingredientId, restaurantId, days },
          }
        );
        // Transform data to ensure compatibility with chart
        const transformedData = response.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString(), // Adjust based on API response
          price: parseFloat(item.price), // Ensure price is a number
        }));
        console.log("Transformed Daily Price Trends:", transformedData);
        set({ dailyPriceTrends: transformedData, isLoading: false });
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || `HTTP ${error.response.status}: ${error.response.statusText}`
          : error.message || "Network error or server unreachable";
        console.error("Fetch Daily Price Trends Error:", {
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack,
          fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        });
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },
  }))
);

export default usePriceHistoryStore;