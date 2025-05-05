import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiRequest } from '../utils/apiRequest';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const useReorderStore = create(
  devtools((set, get) => ({
    reorderData: null,
    consumptionData: [],
    forecastData: [],
    loading: false,
    error: null,

    fetchReorderRecommendation: async (stockId, restaurantId) => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get(`/reorder/reorder/${stockId}/${restaurantId}`);
        if (data.error) {
          set({ error: data.error, loading: false });
        } else {
          set({ reorderData: data, loading: false });
        }
      } catch (error) {
        set({ error: error.message || 'Failed to fetch reorder recommendation', loading: false });
      }
    },

    fetchConsumptionData: async (stockId, restaurantId) => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get(`/consumption/${stockId}/${restaurantId}`);
        if (data.error) {
          set({ error: data.error, loading: false });
        } else {
          set({ consumptionData: data, loading: false });
        }
      } catch (error) {
        set({ error: error.message || 'Failed to fetch consumption data', loading: false });
      }
    },

    fetchForecastData: async (stockId, restaurantId) => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get(`/forecast/${stockId}/${restaurantId}`);
        if (data.error) {
          set({ error: data.error, loading: false });
        } else {
          set({ forecastData: data, loading: false });
        }
      } catch (error) {
        set({ error: error.message || 'Failed to fetch forecast data', loading: false });
      }
    },

    clearReorderData: () => set({ reorderData: null, consumptionData: [], forecastData: [], error: null }),
  }))
);

export default useReorderStore;