import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_URL + "/stock";
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
      // Search filter (name and type)
      if (filterCriteria.search) {
        const searchLower = filterCriteria.search.toLowerCase();
        filtered = filtered.filter(
          (ing) =>
            ing.libelle.toLowerCase().includes(searchLower) ||
            ing.type.name.toLowerCase().includes(searchLower)
        );
      }
      // Type filter
      if (filterCriteria.type) {
        filtered = filtered.filter(
          (ing) =>
            ing.type.name.toLowerCase() === filterCriteria.type.toLowerCase()
        );
      }
      // Availability filter
      if (filterCriteria.availability !== "all") {
        const isAvailable = filterCriteria.availability === "available";
        filtered = filtered.filter((ing) => ing.disponibility === isAvailable);
      }
      // Price range filter
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
    // Modify fetchStocks to initialize filteredStocks
    fetchStocks: async (page = 1) => {
      try {
        const filters = get().filterCriteria;
        const { data } = await axios.get(API_URL, {
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
        const { data } = await axios.get(`${API_URL}/${id}`);
        return data.data;
      } catch (error) {
        console.error("Error fetching stock:", error.message);
        return null;
      }
    },
    addStock: async (stockData) => {
      try {
        const { data } = await axios.post(API_URL, stockData);
        set((state) => {
          const newStocks = [...state.stocks, data.data];
          return {
            stocks: newStocks,
            filteredStocks: newStocks,
          };
        });
        get().applyFilters(); // Reapply filters after adding
        return true;
      } catch (error) {
        console.error("Error adding stock:", error.message);
        return false;
      }
    },
    updateStock: async (id, stockData) => {
      try {
        // Ensure numeric values before sending to API
        const dataToSend = {
          ...stockData,
          quantity: parseInt(stockData.quantity),
          price: parseFloat(stockData.price),
          maxQty: parseInt(stockData.maxQty),
          minQty: parseInt(stockData.minQty),
        };
        const { data } = await axios.put(`${API_URL}/${id}`, dataToSend);
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
        await axios.delete(`${API_URL}/${id}`);
        set((state) => {
          const remainingStocks = state.stocks.filter(
            (stock) => stock._id !== id
          );
          return {
            stocks: remainingStocks,
            filteredStocks: remainingStocks,
          };
        });
        get().applyFilters(); // Reapply filters after deleting
        return true;
      } catch (error) {
        console.error("Error deleting stock:", error.message);
        return false;
      }
    },
    increaseQuantity: async (id, amount) => {
      try {
        const { data } = await axios.patch(`${API_URL}/${id}/increase`, {
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
        const { data } = await axios.patch(`${API_URL}/${id}/decrease`, {
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
  }))
);
export default useStockStore;
