import { create } from "zustand";
import { apiRequest } from "../utils/apiRequest";
import { devtools } from "zustand/middleware";

const useInvoiceStore = create(
  devtools((set, get) => ({
    invoices: [],
    filteredInvoices: [],
    currentInvoice: {
      restaurant: "",
      supplier: "",
      items: [],
    },
    loading: false,
    error: null,
    filterCriteria: {
      search: "",
      status: "all",
      createdBy: "",
      invoiceNumber: "",
    },

    // === SETTERS ===
    setInvoiceRestaurant: (restaurantId) => {
      try {
        set({ loading: true, error: null });
        set((state) => ({
          currentInvoice: {
            ...state.currentInvoice,
            restaurant: restaurantId,
          },
          loading: false,
        }));
      } catch (error) {
        console.error(error);
        set({
          error:
            error.response?.data?.message || "Failed to set invoice restaurant",
          loading: false,
        });
      }
    },

    setInvoiceSupplier: (supplierId) => {
      try {
        set({ loading: true, error: null });
        set((state) => ({
          currentInvoice: {
            ...state.currentInvoice,
            supplier: supplierId,
          },
          loading: false,
        }));
      } catch (error) {
        console.error(error);
        set({
          error:
            error.response?.data?.message || "Failed to set invoice supplier",
          loading: false,
        });
      }
    },

    setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
    clearError: () => set({ error: null }),

    // === FETCHING ===
    fetchInvoices: async () => {
      try {
        set({ loading: true, error: null });
        const response = await apiRequest.get("/invoice");
        set({ invoices: response.data.data, loading: false });
        get().applyFilters();
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to fetch invoices",
          loading: false,
        });
      }
    },

    fetchInvoiceById: async (id) => {
      try {
        set({ loading: true, error: null });
        const response = await apiRequest.get(`/invoice/${id}`);
        set({ currentInvoice: response.data.data, loading: false });
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to fetch invoice",
          loading: false,
        });
      }
    },

    // === CRUD INVOICE ===
    createInvoice: async (invoice) => {
      try {
        console.log(invoice);
        set({ loading: true, error: null });
        const response = await apiRequest.post("/invoice", invoice);
        set((state) => ({
          invoices: [...state.invoices, response.data.data],
          currentInvoice: {},
          loading: false,
        }));
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to create invoice",
          loading: false,
        });
        throw error;
      }
    },

    deleteInvoice: async (id) => {
      try {
        set({ loading: true, error: null });
        await apiRequest.delete(`/invoice/${id}`);
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv._id !== id),
          currentInvoice: {},
          loading: false,
        }));
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to delete invoice",
          loading: false,
        });
      }
    },

    updateInvoiceStatus: async (id, status) => {
      try {
        set({ loading: true, error: null });
        const response = await apiRequest.patch(`/invoice/${id}/status`, {
          status,
        });
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv._id === id ? { ...inv, status: response.data.status } : inv
          ),
          currentInvoice:
            state.currentInvoice?._id === id
              ? { ...state.currentInvoice, status: response.data.status }
              : state.currentInvoice,
          loading: false,
        }));
      } catch (error) {
        set({
          error:
            error.response?.data?.message || "Failed to update invoice status",
          loading: false,
        });
      }
    },

    // === INVOICE ITEMS ===
    addInvoiceItem: (item) => {
      try {
        set({ loading: true, error: null });
        set((state) => {
          const updatedInvoice = {
            ...state.currentInvoice,
            items: [...(state.currentInvoice.items || []), item],
          };
          return {
            currentInvoice: updatedInvoice,
            loading: false,
          };
        });
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to add invoice item",
          loading: false,
        });
      }
    },

    deleteInvoiceItem: (itemId) => {
      try {
        set({ loading: true, error: null });
        set((state) => {
          const updatedInvoice = {
            ...state.currentInvoice,
            items: state.currentInvoice.items.filter(
              (item) => item.ingredient !== itemId
            ),
          };
          return {
            currentInvoice: updatedInvoice,
            loading: false,
          };
        });
      } catch (error) {
        set({
          error:
            error.response?.data?.message || "Failed to delete invoice item",
          loading: false,
        });
      }
    },

    updateInvoiceItem: async (itemId, updates) => {
      try {
        set({ loading: true, error: null });
        const response = await apiRequest.put(
          `/invoice/items/${itemId}`,
          updates
        );

        set((state) => {
          const updatedInvoice = {
            ...state.currentInvoice,
            items: state.currentInvoice.items.map((item) =>
              item.id === itemId ? { ...item, ...response.data } : item
            ),
          };
          return {
            currentInvoice: updatedInvoice,
            loading: false,
          };
        });
      } catch (error) {
        set({
          error:
            error.response?.data?.message || "Failed to update invoice item",
          loading: false,
        });
      }
    },

    // === FILTERS ===
    setFilterCriteria: (criteria) => {
      set((state) => ({
        filterCriteria: { ...state.filterCriteria, ...criteria },
      }));
      get().applyFilters();
    },

    applyFilters: () => {
      const { invoices, filterCriteria } = get();
      let filtered = [...invoices];

      if (filterCriteria.invoiceNumber) {
        const searchLower = filterCriteria.invoiceNumber.toLowerCase();
        filtered = filtered.filter((inv) =>
          inv.invoiceNumber.toLowerCase().includes(searchLower)
        );
      }

      if (filterCriteria.createdBy) {
        const createdByLower = filterCriteria.createdBy.toLowerCase();
        filtered = filtered.filter(
          (inv) =>
            inv.created_by.firstName.toLowerCase().includes(createdByLower) ||
            inv.created_by.lastName.toLowerCase().includes(createdByLower)
        );
      }

      if (filterCriteria.status !== "all") {
        filtered = filtered.filter(
          (inv) =>
            inv.status?.toLowerCase() === filterCriteria.status.toLowerCase()
        );
      }

      set({ filteredInvoices: filtered });
    },

    resetFilters: () => {
      set((state) => ({
        filterCriteria: {
          search: "",
          status: "all",
          createdBy: "",
          invoiceNumber: "",
        },
        filteredInvoices: state.invoices,
      }));
    },
  }))
);

export default useInvoiceStore;
