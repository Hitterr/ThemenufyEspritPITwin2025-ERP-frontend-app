import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiRequest } from '../utils/apiRequest';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const useReorderStore = create(
  devtools((set, get) => ({
    reorderData: null,
    consumptionData: [],
    forecastData: [],
    stocks: [],
    restaurants: [],
    supplierName: null,
    loading: false,
    error: null,

    // Fetch valid restaurants for dropdowns
    fetchRestaurants: async () => {
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get('/restaurant');
        console.log('Restaurants API response:', data);
        set({ restaurants: data.data || data || [], loading: false });
      } catch (error) {
        console.error('Restaurants fetch error:', error.response?.data || error.message);
        set({
          error: error.response?.data?.message || 'Failed to fetch restaurants. Check if /api/restaurant exists.',
          loading: false,
          restaurants: [],
        });
      }
    },

    // Fetch valid stocks for dropdowns, filtered by restaurantId
    fetchStocks: async (restaurantId) => {
      console.log('Fetching stocks for restaurantId:', restaurantId || 'None');
      set({ stocks: [], loading: true, error: null }); // Clear stocks immediately
      if (!restaurantId) {
        set({ loading: false });
        return;
      }
      try {
        const { data } = await apiRequest.get(`/stock?restaurantId=${restaurantId}`);
        console.log('Stocks API response for restaurantId:', restaurantId, data);
        const stocks = data.data || data || [];
        // Validate that all stocks have the correct restaurant field
        const validStocks = stocks.filter((stock) => stock.restaurant === restaurantId);
        if (validStocks.length < stocks.length) {
          console.warn('Some stocks returned do not match restaurantId:', {
            invalidStocks: stocks.filter((stock) => stock.restaurant !== restaurantId),
          });
        }
        set({ stocks: validStocks, loading: false });
        console.log('Fetched stocks:', validStocks.map((stock) => ({ _id: stock._id, libelle: stock.libelle, restaurant: stock.restaurant })));
      } catch (error) {
        console.error('Stocks fetch error:', error.response?.data || error.message);
        set({
          error: error.response?.data?.message || 'Failed to fetch stocks. Check if /api/stock exists.',
          loading: false,
          stocks: [],
        });
      }
    },

    // Fetch supplier details by ID
    fetchSupplier: async (supplierId) => {
      if (!supplierId) {
        set({ supplierName: null });
        return;
      }
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get(`/supplier/${supplierId}`);
        console.log('Supplier API response:', data);
        set({ supplierName: data.data?.name || data.name || 'Unknown Supplier', loading: false });
      } catch (error) {
        console.error('Supplier fetch error:', error.response?.data || error.message);
        set({
          error: error.response?.data?.message || 'Failed to fetch supplier details.',
          loading: false,
          supplierName: 'Unknown Supplier',
        });
      }
    },

    // Fetch reorder recommendation
    fetchReorderRecommendation: async (stockId, restaurantId) => {
      const { stocks } = get();
      const selectedStock = stocks.find((stock) => stock._id === stockId);
      if (!selectedStock) {
        set({
          error: `Invalid stockId: ${stockId} not found for restaurantId: ${restaurantId}`,
          loading: false,
        });
        return;
      }
      console.log('Fetching reorder recommendation for stock:', { _id: stockId, libelle: selectedStock.libelle, restaurant: restaurantId });
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get(`/reorder/reorder/${stockId}/${restaurantId}`);
        if (data.error) {
          set({ error: data.error, loading: false });
        } else {
          set({
            reorderData: {
              stock: data.stock,
              order_date: data.order_date,
              quantity: data.quantity,
              supplier_id: data.supplier_id,
              unit: data.unit,
              alert: data.alert,
            },
            consumptionData: data.consumption || [],
            forecastData: data.forecast || [],
            loading: false,
          });
          if (data.supplier_id) {
            get().fetchSupplier(data.supplier_id);
          }
        }
      } catch (error) {
        set({
          error: error.response?.data?.message || 'Failed to fetch reorder recommendation',
          loading: false,
        });
      }
    },

    // Fetch consumption data
    fetchConsumptionData: async (stockId, restaurantId) => {
      const { stocks } = get();
      if (!stocks.find((stock) => stock._id === stockId)) {
        set({
          error: `Invalid stockId: ${stockId} not found for restaurantId: ${restaurantId}`,
          loading: false,
        });
        return;
      }
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get(`/reorder/consumption/${stockId}/${restaurantId}`);
        if (data.error) {
          set({ error: data.error, loading: false });
        } else {
          set({ consumptionData: data.data || [], loading: false });
        }
      } catch (error) {
        set({
          error: error.response?.data?.message || 'Failed to fetch consumption data',
          loading: false,
        });
      }
    },

    // Fetch forecast data
    fetchForecastData: async (stockId, restaurantId) => {
      const { stocks } = get();
      if (!stocks.find((stock) => stock._id === stockId)) {
        set({
          error: `Invalid stockId: ${stockId} not found for restaurantId: ${restaurantId}`,
          loading: false,
        });
        return;
      }
      set({ loading: true, error: null });
      try {
        const { data } = await apiRequest.get(`/reorder/forecast/${stockId}/${restaurantId}`);
        if (data.error) {
          set({ error: data.error, loading: false });
        } else {
          set({ forecastData: data.data || [], loading: false });
        }
      } catch (error) {
        set({
          error: error.response?.data?.message || 'Failed to fetch forecast data',
          loading: false,
        });
      }
    },

    // Clear data
    clearReorderData: () => {
      console.log('Clearing reorder data');
      set({
        reorderData: null,
        consumptionData: [],
        forecastData: [],
        supplierName: null,
        error: null,
      });
    },
  }))
);

export default useReorderStore;