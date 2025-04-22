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
      total: 0,
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

        // First fetch paginated results
        const { data } = await axios.get(API_URL, { params });
        
        // Then calculate stats from pagination info
        const stats = {
          total: data.pagination.total,
          active: Math.round((data.pagination.total * 0.7)), // Example - replace with actual stats logic
          pending: Math.round((data.pagination.total * 0.1)),
          suspended: Math.round((data.pagination.total * 0.1)),
          inactive: Math.round((data.pagination.total * 0.1)),
          totalRestaurantsLinked: Math.round((data.pagination.total * 0.5)),
        };

        set({
          suppliers: data.data,
          filteredSuppliers: data.data,
          allFilteredSuppliers: Array(data.pagination.total).fill({}), // Placeholder
          pagination: data.pagination,
          globalStats: stats
        });
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        set({ 
          suppliers: [], 
          filteredSuppliers: [],
          allFilteredSuppliers: [],
          pagination: { 
            total: 0, 
            pages: 1, 
            page: 1, 
            limit: 10, 
            hasNext: false, 
            hasPrev: false 
          },
          globalStats: {
            active: 0,
            pending: 0,
            suspended: 0,
            inactive: 0,
            total: 0,
            totalRestaurantsLinked: 0,
          }
        });
      }
    },
    getSupplierById: async (id) => {
      try {
        const { data: supplierData } = await axios.get(`${API_URL}/${id}`);
        const supplier = supplierData.data;

        const { data: ingredientsData } = await axios.get(`${API_URL}/${id}/ingredients`);
        const supplierIngredients = ingredientsData.data;

        const ingredients = supplierIngredients.map((supplierIngredient) => ({
          _id: supplierIngredient.ingredientId._id,
          name: supplierIngredient.ingredientId.libelle,
          pricePerUnit: supplierIngredient.pricePerUnit,
          leadTimeDays: supplierIngredient.leadTimeDays,
          type: supplierIngredient.ingredientId.type,
          unit: supplierIngredient.ingredientId.unit,
        }));

        return { ...supplier, ingredients };
      } catch (error) {
        console.error("Error fetching supplier:", error.message, error.response?.data);
        return null;
      }
    },
    addSupplier: async (supplierData) => {
      try {
        const { data } = await axios.post(API_URL, supplierData);
        return { success: true, data };
      } catch (error) {
        console.error("Error adding supplier:", error.message, error.response?.data);
        return { success: false, error: error.response?.data?.message || error.message };
      }
    },
    updateSupplier: async (id, supplierData) => {
      try {
        const { data } = await axios.put(`${API_URL}/${id}`, supplierData);
        return { success: true, data };
      } catch (error) {
        console.error("Error updating supplier:", error.message, error.response?.data);
        return { success: false, error: error.response?.data?.message || error.message };
      }
    },
    deleteSupplier: async (id) => {
      try {
        await axios.delete(`${API_URL}/${id}`);
        return { success: true };
      } catch (error) {
        console.error("Error deleting supplier:", error.message, error.response?.data);
        return { success: false, error: error.response?.data?.message || error.message };
      }
    },
    linkIngredient: async (supplierId, data) => {
      try {
        const response = await axios.post(`${API_URL}/${supplierId}/link-ingredient`, data);
        
        if (response.data.success) {
          const updatedSupplier = await get().getSupplierById(supplierId);
          set((state) => ({
            suppliers: state.suppliers.map(s => 
              s._id === supplierId ? updatedSupplier : s
            )
          }));
          return { success: true };
        }
        return { success: false };
      } catch (error) {
        console.error("Error linking ingredient:", error.message, error.response?.data);
        return { success: false, error: error.response?.data?.message || error.message };
      }
    },
    unlinkIngredient: async (supplierId, ingredientId) => {
      try {
        await axios.delete(`${API_URL}/${supplierId}/ingredients/${ingredientId}`);
        const updatedSupplier = await get().getSupplierById(supplierId);
        set((state) => ({
          suppliers: state.suppliers.map(s => 
            s._id === supplierId ? updatedSupplier : s
          )
        }));
        return { success: true };
      } catch (error) {
        console.error("Error unlinking ingredient:", error.message, error.response?.data);
        return { success: false, error: error.response?.data?.message || error.message };
      }
    },
    bulkUpdateSupplierIngredients: async (supplierId, ingredients) => {
      try {
        await axios.patch(`${API_URL}/${supplierId}/ingredients/bulk`, { ingredients });
        const updatedSupplier = await get().getSupplierById(supplierId);
        set((state) => ({
          suppliers: state.suppliers.map(s => 
            s._id === supplierId ? updatedSupplier : s
          )
        }));
        return { success: true };
      } catch (error) {
        console.error("Error bulk updating ingredients:", error.message, error.response?.data);
        return { success: false, error: error.response?.data?.message || error.message };
      }
    },
    fetchGlobalStats: async () => {
      try {
        const { data } = await axios.get(`${API_URL}/stats`);
        const stats = data.data.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, { active: 0, pending: 0, suspended: 0 });

        set({
          globalStats: { 
            ...stats, 
            total: Object.values(stats).reduce((sum, count) => sum + count, 0) 
          },
        });
      } catch (error) {
        console.error("Error fetching stats:", error.message, error.response?.data);
        set({ 
          globalStats: { 
            active: 0, 
            pending: 0, 
            suspended: 0, 
            total: 0 
          } 
        });
      }
    }
  }))
);

export default useSupplierStore;