import { create } from "zustand";
import { apiRequest } from "../utils/apiRequest";
import { devtools } from "zustand/middleware";

export const useUserStore = create(
  devtools((set) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
      try {
        set({ loading: true });
        const response = await apiRequest.get("/users");
        set({ users: response.data.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    addUser: async (userData) => {
      try {
        set({ loading: true });
        const response = await apiRequest.post("/users", userData);
        set((state) => ({
          users: [...state.users, response.data.data],
          loading: false,
        }));
        return true;
      } catch (error) {
        set({ error: error.message, loading: false });
        return false;
      }
    },

    updateUser: async (userId, userData) => {
      try {
        set({ loading: true });
        const response = await apiRequest.put(`/users/${userId}`, userData);
        set((state) => ({
          users: state.users.map((user) =>
            user._id === userId ? response.data.data : user
          ),
          loading: false,
        }));
        return true;
      } catch (error) {
        set({ error: error.message, loading: false });
        return false;
      }
    },

    deleteUser: async (userId) => {
      try {
        set({ loading: true });
        await apiRequest.delete(`/users/${userId}`);
        set((state) => ({
          users: state.users.filter((user) => user._id !== userId),
          loading: false,
        }));
        return true;
      } catch (error) {
        set({ error: error.message, loading: false });
        return false;
      }
    },
  }))
);

export default useUserStore;
