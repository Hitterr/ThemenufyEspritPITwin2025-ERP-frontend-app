import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/supplier";
console.log("API_URL:", API_URL);

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
      restaurantId: "",
      page: 1,
      limit: 10,
    },
    setFilterCriteria: (criteria) => {
      set((state) => ({
        filterCriteria: { ...state.filterCriteria, ...criteria },
      }));
      get().fetchSuppliers(); // Fetch suppliers with updated filters
    },
    resetFilters: () => {
      set({
        filterCriteria: {
          search: "",
          status: "",
          restaurantId: "",
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
          ...(filterCriteria.restaurantId && { restaurantId: filterCriteria.restaurantId }),
        };
        const { data } = await axios.get(API_URL, { params });
        let suppliers = data.data;

        // Apply client-side search filter
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
        console.error("Error fetching suppliers:", error.message, error.response?.data);
        set({ suppliers: [], filteredSuppliers: [], pagination: { total: 0, pages: 1, page: 1, limit: 10, hasNext: false, hasPrev: false } });
      }
    },
    getSupplierById: async (id) => {
      try {
        // Fetch supplier details
        const { data: supplierData } = await axios.get(`${API_URL}/${id}`);
        const supplier = supplierData.data;

        // Fetch linked ingredients for the supplier
        const { data: ingredientsData } = await axios.get(`${API_URL}/${id}/ingredients`);
        const supplierIngredients = ingredientsData.data;

        // Map the supplierIngredients to match the expected format for the UI
        const ingredients = supplierIngredients.map((supplierIngredient) => ({
          _id: supplierIngredient.ingredientId._id,
          name: supplierIngredient.ingredientId.libelle, // Use 'libelle' as the name
          pricePerUnit: supplierIngredient.pricePerUnit,
          leadTimeDays: supplierIngredient.leadTimeDays,
          type: supplierIngredient.ingredientId.type,
          unit: supplierIngredient.ingredientId.unit,
        }));

        // Merge the ingredients into the supplier object
        return { ...supplier, ingredients };
      } catch (error) {
        console.error("Error fetching supplier:", error.message, error.response?.data);
        return null;
      }
    },
    addSupplier: async (supplierData) => {
      try {
        console.log("Sending POST /supplier with data:", supplierData);
        const { data } = await axios.post(API_URL, supplierData);
        console.log("POST /supplier response:", data);
        return true;
      } catch (error) {
        console.error("Error adding supplier:", error.message, error.response?.data);
        return false;
      }
    },
    updateSupplier: async (id, supplierData) => {
      try {
        const { data } = await axios.put(`${API_URL}/${id}`, supplierData);
        return true;
      } catch (error) {
        console.error("Error updating supplier:", error.message, error.response?.data);
        return false;
      }
    },
    deleteSupplier: async (id) => {
      try {
        await axios.delete(`${API_URL}/${id}`);
        return true;
      } catch (error) {
        console.error("Error deleting supplier:", error.message, error.response?.data);
        return false;
      }
    },
    linkIngredient: async (supplierId, data) => {
      try {
        const { data: responseData } = await axios.post(`${API_URL}/${supplierId}/link-ingredient`, data);
        if (responseData.success) {
          // Fetch the updated ingredients list to ensure accuracy
          const { data: ingredientsData } = await axios.get(`${API_URL}/${supplierId}/ingredients`);
          const updatedIngredients = ingredientsData.data.map((supplierIngredient) => ({
            _id: supplierIngredient.ingredientId._id,
            name: supplierIngredient.ingredientId.libelle,
            pricePerUnit: supplierIngredient.pricePerUnit,
            leadTimeDays: supplierIngredient.leadTimeDays,
            type: supplierIngredient.ingredientId.type,
            unit: supplierIngredient.ingredientId.unit,
          }));

          set((state) => ({
            suppliers: state.suppliers.map((supplier) =>
              supplier._id === supplierId
                ? { ...supplier, ingredients: updatedIngredients }
                : supplier
            ),
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error linking ingredient:", error.message, error.response?.data);
        return false;
      }
    },
    unlinkIngredient: async (supplierId, ingredientId) => {
      try {
        const { data: responseData } = await axios.delete(`${API_URL}/${supplierId}/ingredients/${ingredientId}`);
        if (responseData.success) {
          // Fetch the updated ingredients list to ensure accuracy
          const { data: ingredientsData } = await axios.get(`${API_URL}/${supplierId}/ingredients`);
          const updatedIngredients = ingredientsData.data.map((supplierIngredient) => ({
            _id: supplierIngredient.ingredientId._id,
            name: supplierIngredient.ingredientId.libelle,
            pricePerUnit: supplierIngredient.pricePerUnit,
            leadTimeDays: supplierIngredient.leadTimeDays,
            type: supplierIngredient.ingredientId.type,
            unit: supplierIngredient.ingredientId.unit,
          }));

          set((state) => ({
            suppliers: state.suppliers.map((supplier) =>
              supplier._id === supplierId
                ? { ...supplier, ingredients: updatedIngredients }
                : supplier
            ),
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error unlinking ingredient:", error.message, error.response?.data);
        return false;
      }
    },
  }))
);

export default useSupplierStore;