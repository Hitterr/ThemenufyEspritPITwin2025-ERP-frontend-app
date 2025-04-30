import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/supplier";

const useSupplierStore = create(
  devtools((set, get) => ({
    suppliers: [],
    filteredSuppliers: [],
    pagination: {
      total: 0,
      pages: 1,
      page: 1,
      limit: 10,
      hasNext: false,
      hasPrev: false,
    },
    filterCriteria: {
      search: "",
      status: "",
      page: 1,
      limit: 10,
    },
    globalStats: {
      active: 0,
      pending: 0,
      suspended: 0,
      inactive: 0,
      total: 0,
      totalRestaurantsLinked: 0,
    },

    setFilterCriteria: (criteria) => {
      set((state) => ({
        filterCriteria: { ...state.filterCriteria, ...criteria },
      }));
      get().fetchSuppliers();
    },
    resetFilters: () => {
      set({
        filterCriteria: {
          search: "",
          status: "",
          page: 1,
          limit: 10,
        },
      });
    },

    fetchSuppliers: async () => {
      try {
        const { filterCriteria } = get();
        const params = {
          page: filterCriteria.page,
          limit: filterCriteria.limit,
          ...(filterCriteria.status && { status: filterCriteria.status }),
        };
        const { data } = await axios.get(API_URL, { params });
        let suppliers = data.data;

        if (filterCriteria.search) {
          const searchLower = filterCriteria.search.toLowerCase();
          suppliers = suppliers.filter(
            (sup) =>
              sup.name.toLowerCase().includes(searchLower) ||
              sup.contact.email.toLowerCase().includes(searchLower)
          );
        }

        set({
          suppliers: suppliers,
          filteredSuppliers: suppliers,
          pagination: data.pagination,
        });
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        set({
          suppliers: [],
          filteredSuppliers: [],
          pagination: {
            total: 0,
            pages: 1,
            page: 1,
            limit: 10,
            hasNext: false,
            hasPrev: false,
          },
        });
      }
    },

    fetchGlobalStats: async () => {
      try {
        const { data } = await axios.get(`${API_URL}/stats`);

        // Log the API response for debugging
        console.log("Global Stats API Response:", data);

        // Initialize default stats
        const defaultStats = {
          active: 0,
          pending: 0,
          suspended: 0,
          inactive: 0,
          totalRestaurantsLinked: 0,
        };

        // Process API response
        if (Array.isArray(data.data)) {
          data.data.forEach((stat) => {
            if (stat._id === "active") defaultStats.active = stat.count;
            else if (stat._id === "pending") defaultStats.pending = stat.count;
            else if (stat._id === "suspended")
              defaultStats.suspended = stat.count;
            else if (stat._id === "inactive")
              defaultStats.inactive = stat.count;
            // Check for both possible keys
            else if (
              stat._id === "totalRestaurantsLinked" ||
              stat._id === "restaurantsLinked"
            ) {
              defaultStats.totalRestaurantsLinked = stat.count;
            }
          });
        }

        // Calculate total suppliers
        const total =
          defaultStats.active +
          defaultStats.pending +
          defaultStats.suspended +
          defaultStats.inactive;

        set({
          globalStats: {
            ...defaultStats,
            total,
          },
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        set({
          globalStats: {
            active: 0,
            pending: 0,
            suspended: 0,
            inactive: 0,
            total: 0,
            totalRestaurantsLinked: 0,
          },
        });
      }
    },

    getSupplierById: async (id) => {
      try {
        const { data: supplierData } = await axios.get(`${API_URL}/${id}`);
        const supplier = supplierData.data;

        const { data: stocksData } = await axios.get(`${API_URL}/${id}/stocks`);
        const supplierStocks = stocksData.data;

        const stocks = supplierStocks.map((supplierStock) => ({
          _id: supplierStock.stockId._id,
          name: supplierStock.stockId.libelle,
          pricePerUnit: supplierStock.pricePerUnit,
          leadTimeDays: supplierStock.leadTimeDays,
          type: supplierStock.stockId.type,
          unit: supplierStock.stockId.unit,
        }));

        return { ...supplier, stocks };
      } catch (error) {
        console.error("Error fetching supplier:", error);
        return null;
      }
    },

    addSupplier: async (supplierData) => {
      try {
        const { data } = await axios.post(API_URL, supplierData);
        return true;
      } catch (error) {
        console.error("Error adding supplier:", error);
        return false;
      }
    },

    updateSupplier: async (id, supplierData) => {
      try {
        const { data } = await axios.put(`${API_URL}/${id}`, supplierData);
        return true;
      } catch (error) {
        console.error("Error updating supplier:", error);
        return false;
      }
    },

    deleteSupplier: async (id) => {
      try {
        await axios.delete(`${API_URL}/${id}`);
        return true;
      } catch (error) {
        console.error("Error deleting supplier:", error);
        return false;
      }
    },

    linkStock: async (supplierId, data) => {
      try {
        const { data: responseData } = await axios.post(
          `${API_URL}/${supplierId}/link-stock`,
          data
        );
        if (responseData.success) {
          const { data: stocksData } = await axios.get(
            `${API_URL}/${supplierId}/stocks`
          );
          const updatedStocks = stocksData.data.map((supplierStock) => ({
            _id: supplierStock.stockId._id,
            name: supplierStock.stockId.libelle,
            pricePerUnit: supplierStock.pricePerUnit,
            leadTimeDays: supplierStock.leadTimeDays,
            type: supplierStock.stockId.type,
            unit: supplierStock.stockId.unit,
          }));

          set((state) => ({
            suppliers: state.suppliers.map((supplier) =>
              supplier._id === supplierId
                ? { ...supplier, stocks: updatedStocks }
                : supplier
            ),
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error linking stock:", error);
        return false;
      }
    },

    unlinkStock: async (supplierId, stockId) => {
      try {
        const { data: responseData } = await axios.delete(
          `${API_URL}/${supplierId}/stocks/${stockId}`
        );
        if (responseData.success) {
          const { data: stocksData } = await axios.get(
            `${API_URL}/${supplierId}/stocks`
          );
          const updatedStocks = stocksData.data.map((supplierStock) => ({
            _id: supplierStock.stockId._id,
            name: supplierStock.stockId.libelle,
            pricePerUnit: supplierStock.pricePerUnit,
            leadTimeDays: supplierStock.leadTimeDays,
            type: supplierStock.stockId.type,
            unit: supplierStock.stockId.unit,
          }));

          set((state) => ({
            suppliers: state.suppliers.map((supplier) =>
              supplier._id === supplierId
                ? { ...supplier, stocks: updatedStocks }
                : supplier
            ),
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error unlinking stock:", error);
        return false;
      }
    },
    getDeliveryStats: async (startDate, endDate) => {
      try {
        const { data } = await axios.get(`${API_URL}/delivery-stats`, {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        });
        console.log("Delivery Stats API Response:", data); // Debug log
        return data.data || [];
      } catch (error) {
        console.error(
          "Error fetching delivery stats:",
          error.response?.data || error.message
        );
        return [];
      }
    },

    bulkUpdateSupplierStocks: async (supplierId, stocks) => {
      try {
        const { data: responseData } = await axios.patch(
          `${API_URL}/${supplierId}/stocks/bulk`,
          { stocks }
        );
        if (responseData.success) {
          const { data: stocksData } = await axios.get(
            `${API_URL}/${supplierId}/stocks`
          );
          const updatedStocks = stocksData.data.map((supplierStock) => ({
            _id: supplierStock.stockId._id,
            name: supplierStock.stockId.libelle,
            pricePerUnit: supplierStock.pricePerUnit,
            leadTimeDays: supplierStock.leadTimeDays,
            type: supplierStock.stockId.type,
            unit: supplierStock.stockId.unit,
          }));

          set((state) => ({
            suppliers: state.suppliers.map((supplier) =>
              supplier._id === supplierId
                ? { ...supplier, stocks: updatedStocks }
                : supplier
            ),
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error bulk updating stocks:", error);
        return false;
      }
    },
  }))
);

export default useSupplierStore;
