import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const wasteStore = create(
  devtools((set, get) => ({
    wasteSummary: [],
    wasteTrends: [],
    filterCriteria: {
      restaurantId: "",
      startDate: "",
      endDate: "",
      category: "",
    },
    isLoading: false,
    error: null,

    setFilterCriteria: (criteria) => {
      set((state) => ({
        filterCriteria: { ...state.filterCriteria, ...criteria },
      }));
      get().fetchWasteSummary();
    },

    resetFilters: () => {
      set({
        filterCriteria: {
          restaurantId: "",
          startDate: "",
          endDate: "",
          category: "",
        },
      });
      get().fetchWasteSummary();
    },

    fetchWasteSummary: async () => {
      const { filterCriteria } = get();
      set({ isLoading: true, error: null });

      try {
        const response = await axios.get(`${API_URL}/waste/summary`, {
          params: {
            restaurantId: filterCriteria.restaurantId,
            startDate: filterCriteria.startDate || undefined,
            endDate: filterCriteria.endDate || undefined,
           
          },
        });

        set({ wasteSummary: response.data, isLoading: false });
      } catch (error) {
        console.error("Fetch Waste Summary Error:", error.response || error);
        set({ error: error.message, isLoading: false });
      }
    },

    fetchWasteTrends: async (restaurantId, days = 7) => {
      if (!restaurantId) {
        const errorMsg = "restaurantId is required";
        set({ error: errorMsg });
        throw new Error(errorMsg);
      }

      set({ isLoading: true, error: null });

      try {
        const response = await axios.get(`${API_URL}/waste/trends/daily`, {
          params: { days },
        });

        set({ wasteTrends: response.data, isLoading: false });
      } catch (error) {
        console.error("Fetch Waste Trends Error:", error.response || error);
        set({ error: error.message, isLoading: false });
      }
    },
  }))
);

export default wasteStore;
