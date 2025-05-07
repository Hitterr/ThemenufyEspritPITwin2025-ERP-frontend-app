import { create } from "zustand";
import { apiRequest } from "../utils/apiRequest";

const API_URL = "http://localhost:5000/api/restaurant";
const useRestaurantStore = create((set) => ({
  restaurants: [],
  purchaseOrders: [],
  purchaseOrderFile: null,
  fetchRestaurants: async () => {
    try {
      const { data } = await apiRequest.get(API_URL);
      set({ restaurants: data.data });
    } catch (error) {
      console.error("Erreur fetchRestaurants:", error.message);
    }
  },
  addRestaurant: async (restaurantData) => {
    try {
      const { data } = await apiRequest.post(API_URL, restaurantData);
      set((state) => ({
        restaurants: [...state.restaurants, data.data],
      }));
      return true;
    } catch (error) {
      console.error("Erreur addRestaurant:", error.message);
      return false;
    }
  },
  updateRestaurant: async (id, restaurantData) => {
    try {
      const { data } = await apiRequest.put(`${API_URL}/${id}`, restaurantData);
      set((state) => ({
        restaurants: state.restaurants.map((restaurant) =>
          restaurant._id === id ? data.data : restaurant
        ),
      }));
      return true;
    } catch (error) {
      console.error("Erreur updateRestaurant:", error.message);
      return false;
    }
  },
  deleteRestaurant: async (id) => {
    try {
      await apiRequest.delete(`${API_URL}/${id}`);
      set((state) => ({
        restaurants: state.restaurants.filter(
          (restaurant) => restaurant._id !== id
        ),
      }));
      return true;
    } catch (error) {
      console.error("Erreur deleteRestaurant:", error.message);
      return false;
    }
  },
  generatePurchaseOrder: async (restaurantId, format = "pdf") => {
    try {
      // Fetch orders for display
      const jsonResponse = await apiRequest.get(
        `http://localhost:5000/api/supplier-orders/purchase-order/${restaurantId}`,
        { params: { format: "json" } }
      );
      set({ purchaseOrders: jsonResponse.data.orders });

      // Fetch file for download
      const fileResponse = await apiRequest.get(
        `http://localhost:5000/api/supplier-orders/purchase-order/${restaurantId}`,
        {
          params: { format },
          responseType: "blob",
        }
      );
      const mimeType =
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const blob = new Blob([fileResponse.data], { type: mimeType });
      const fileName = `purchase_order_${restaurantId}_${Date.now()}.${format}`;
      set({ purchaseOrderFile: { blob, fileName } });

      return { success: true, message: "Purchase order generated", file: { blob, fileName } };
    } catch (error) {
      console.error("Erreur generatePurchaseOrder:", error.message);
      return { success: false, message: error.response?.data?.message || "Failed to generate purchase order" };
    }
  },
  clearPurchaseOrders: () => {
    set({ purchaseOrders: [], purchaseOrderFile: null });
  },
}));
export default useRestaurantStore;
