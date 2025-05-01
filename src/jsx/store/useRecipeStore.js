import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const useRecipeStore = create(
	devtools((set, get) => ({
		recipes: [],
		loading: false,
		error: null,
		fetchRecipes: async () => {
			set({ loading: true, error: null });
			try {
				const { data } = await apiRequest.get(`/recipe`);
				if (data.success) {
					set({ recipes: data.data, loading: false });
				} else {
					set({ error: "Failed to fetch recipes", loading: false });
				}
			} catch (error) {
				set({ error: error.message, loading: false });
			}
		},
	}))
);
export default useRecipeStore;
