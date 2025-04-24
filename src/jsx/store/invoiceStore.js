import { create } from "zustand";
import { apiRequest } from "../utils/apiRequest";
import { devtools } from "zustand/middleware";

const useInvoiceStore = create(
  devtools((set, get) => ({
    invoices: [],
    currentInvoice: {
      restaurant: "",
      supplier: "",
      items: [], // Initialize items as an empty array
    },
    loading: false,
    error: null,

    // Fetch all invoices
    fetchInvoices: async () => {
      try {
        set({ loading: true, error: null });
        const response = await apiRequest.get("/invoice");
        set({ invoices: response.data.data, loading: false });
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to fetch invoices",
          loading: false,
        });
      }
    },

    // Fetch single invoice
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

    // Create new invoice
    createInvoice: async (invoice) => {
      try {
        set({ loading: true, error: null });
        console.log(invoice);
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
    // Delete invoice
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
    // Update invoice status
    updateInvoiceStatus: async (id, status) => {
      try {
        set({ loading: true, error: null });
        const response = await apiRequest.patch(`/invoice/${id}/status`, {
          status,
        });
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: response.data.status } : inv
          ),
          currentInvoice:
            state.currentInvoice?.id === id
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
    setInvoiceRestaurant: (restaurantId) => {
      try {
        set({ loading: true, error: null });
        set((state) => {
          const updatedInvoice = {
            ...state.currentInvoice,
            restaurant: restaurantId,
          };
          return {
            currentInvoice: updatedInvoice,
            loading: false,
          };
        });
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
        set((state) => {
          const updatedInvoice = {
            ...state.currentInvoice,
            supplier: supplierId,
          };
          return {
            currentInvoice: updatedInvoice,
            loading: false,
          };
        });
      } catch (error) {
        console.error(error);
        set({
          error:
            error.response?.data?.message || "Failed to set invoice supplier",
          loading: false,
        });
      }
    },
    // Add invoice item
    addInvoiceItem: (item) => {
      try {
        set({ loading: true, error: null });
        set((state) => {
          if (state.currentInvoice.items) {
            const updatedInvoice = {
              ...state.currentInvoice,
              items: [...state.currentInvoice.items, item],
            };
            return {
              currentInvoice: updatedInvoice,
              loading: false,
            };
          }
        });
      } catch (error) {
        console.error(error);
        set({
          error: error.response?.data?.message || "Failed to add invoice item",
          loading: false,
        });
      }
    },

    // Update invoice item
    updateInvoiceItem: async (itemId, updates) => {
      try {
        set({ loading: true, error: null });
        const response = await apiRequest.put(
          `/invoice/items/${itemId}`,
          updates
        );
        set((state) => {
          const updatedInvoice = state.currentInvoice
            ? {
                ...state.currentInvoice,
                items: state.currentInvoice.items.map((item) =>
                  item.id === itemId ? { ...item, ...response.data } : item
                ),
              }
            : state.currentInvoice;

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

    // Delete invoice item
    deleteInvoiceItem: (itemId) => {
      try {
        set({ loading: true, error: null });

        set((state) => {
          const updatedInvoice = state.currentInvoice
            ? {
                ...state.currentInvoice,
                items: state.currentInvoice.items.filter(
                  (item) => item.ingredient !== itemId
                ),
              }
            : state.currentInvoice;

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

    // Local state actions
    setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
    clearError: () => set({ error: null }),
  }))
);

export default useInvoiceStore;
