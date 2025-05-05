import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
const API_URL = "/stock";
const useStockStore = create(
  devtools((set, get) => ({
    stocks: [],
    filteredStocks: [],
    filterCriteria: {
      search: "",
      type: "",
      availability: "all",
      minPrice: "",
      maxPrice: "",
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10,
    },
    suppliersComparison: [], // State for supplier comparison
    fetchError: "", // State for error handling
    setFilterCriteria: (criteria) => {
      set((state) => ({
        filterCriteria: { ...state.filterCriteria, ...criteria },
      }));
      get().applyFilters();
    },
    resetFilters: () => {
      set((state) => ({
        filterCriteria: {
          search: "",
          type: "",
          availability: "all",
          minPrice: "",
          maxPrice: "",
        },
        filteredStocks: state.stocks,
      }));
    },
    applyFilters: () => {
      const { stocks, filterCriteria } = get();
      let filtered = [...stocks];
      if (filterCriteria.search) {
        const searchLower = filterCriteria.search.toLowerCase();
        filtered = filtered.filter(
          (ing) =>
            ing.libelle.toLowerCase().includes(searchLower) ||
            ing.type.name.toLowerCase().includes(searchLower)
        );
      }
      if (filterCriteria.type) {
        filtered = filtered.filter(
          (ing) => ing.type.name.toLowerCase() === filterCriteria.type.toLowerCase()
        );
      }
      if (filterCriteria.availability !== "all") {
        const isAvailable = filterCriteria.availability === "available";
        filtered = filtered.filter((ing) => ing.disponibility === isAvailable);
      }
      if (filterCriteria.minPrice !== "") {
        filtered = filtered.filter(
          (ing) => ing.price >= Number(filterCriteria.minPrice)
        );
      }
      if (filterCriteria.maxPrice !== "") {
        filtered = filtered.filter(
          (ing) => ing.price <= Number(filterCriteria.maxPrice)
        );
      }
      set({ filteredStocks: filtered });
    },
    fetchStocks: async (page = 1) => {
      try {
        const filters = get().filterCriteria;
        const { data } = await apiRequest.get(API_URL, {
          params: { page: page, ...filters },
        });
        set({
          stocks: data.data,
          filteredStocks: data.data,
          pagination: data.pagination,
        });
      } catch (error) {
        console.error("Error fetching stocks:", error.message);
      }
    },
    getStockById: async (id) => {
      try {
        const { data } = await apiRequest.get(`${API_URL}/${id}`);
        return data.data;
      } catch (error) {
        console.error("Error fetching stock:", error.message);
        return null;
      }
    },
    addStock: async (stockData) => {
      try {
        const { data } = await apiRequest.post(API_URL, stockData);
        set((state) => {
          const newStocks = [...state.stocks, data.data];
          return {
            stocks: newStocks,
            filteredStocks: newStocks,
          };
        });
        get().applyFilters();
        return true;
      } catch (error) {
        console.error("Error adding stock:", error.message);
        return false;
      }
    },
    updateStock: async (id, stockData) => {
      try {
        const dataToSend = {
          ...stockData,
          quantity: parseInt(stockData.quantity),
          price: parseFloat(stockData.price),
          maxQty: parseInt(stockData.maxQty),
          minQty: parseInt(stockData.minQty),
        };
        const { data } = await apiRequest.put(`${API_URL}/${id}`, dataToSend);
        set((state) => {
          const updatedStocks = state.stocks.map((stock) =>
            stock._id === id ? data.data : stock
          );
          return {
            stocks: updatedStocks,
            filteredStocks: updatedStocks,
          };
        });
        get().applyFilters();
        return true;
      } catch (error) {
        console.error("Error updating stock:", error.message);
        return false;
      }
    },
    deleteStock: async (id) => {
      try {
        await apiRequest.delete(`${API_URL}/${id}`);
        set((state) => {
          const remainingStocks = state.stocks.filter((stock) => stock._id !== id);
          return {
            stocks: remainingStocks,
            filteredStocks: remainingStocks,
          };
        });
        get().applyFilters();
        return true;
      } catch (error) {
        console.error("Error deleting stock:", error.message);
        return false;
      }
    },
    increaseQuantity: async (id, amount) => {
      try {
        const { data } = await apiRequest.patch(`${API_URL}/${id}/increase`, {
          amount,
        });
        set((state) => ({
          stocks: state.stocks.map((stock) =>
            stock._id === id ? data.data : stock
          ),
        }));
        return true;
      } catch (error) {
        console.error("Error increasing quantity:", error.message);
        return false;
      }
    },
    decreaseQuantity: async (id, amount) => {
      try {
        const { data } = await apiRequest.patch(`${API_URL}/${id}/decrease`, {
          amount,
        });
        set((state) => ({
          stocks: state.stocks.map((stock) =>
            stock._id === id ? data.data : stock
          ),
        }));
        return true;
      } catch (error) {
        console.error("Error decreasing quantity:", error.message);
        return false;
      }
    },
    // Updated action to fetch supplier comparison with cache refresh
    fetchSuppliersForStock: async (stockId) => {
      try {
        const { data } = await apiRequest.get(`${API_URL}/${stockId}/suppliers`);
        if (data.success && Array.isArray(data.data)) {
          set({ suppliersComparison: data.data, fetchError: "" });
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch suppliers";
        console.error("Error fetching suppliers:", errorMessage);
        set({ suppliersComparison: [], fetchError: errorMessage });
      }
    },
    clearSuppliersComparison: () => {
      set({ suppliersComparison: [], fetchError: "" });
    },
    // New action to refresh suppliers after linking/updating
    refreshSuppliersForStock: async (stockId) => {
      await get().fetchSuppliersForStock(stockId);
    },
  }))
);
export default useStockStore;