import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const wasteStore = create(
	devtools((set, get) => ({
		wasteSummary: [],
		wasteTrends: [],
		wastePercentage: null, // Nouvel état pour stocker les données de pourcentage
		filterCriteria: {
			restaurantId: "",
			startDate: "",
			endDate: "",
			category: "",
		},
		isLoading: false,
		error: null,
		// Méthode existante inchangée
		setFilterCriteria: (criteria) => {
			const updatedCriteria = {
				...get().filterCriteria,
				...criteria,
			};
			set({ filterCriteria: updatedCriteria });
		
			if (updatedCriteria.restaurantId) {
				get().fetchWasteSummary(); 
			}
		},
		
		// Méthode existante inchangée
		resetFilters: () => {
			set({
				filterCriteria: {
					restaurantId: "",
					startDate: "",
					endDate: "",
					category: "",
				},
			});
		},
		
		// Méthode existante inchangée
		fetchWasteSummary: async () => {
			const { filterCriteria } = get();
		
			if (!filterCriteria.restaurantId) {
				console.warn("No restaurantId provided to fetchWasteSummary. Skipping request.");
				return;
			}
		
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(`/waste/summary`, {
					params: {
						restaurantId: filterCriteria.restaurantId,
						startDate: filterCriteria.startDate || undefined,
						endDate: filterCriteria.endDate || undefined,
					},
				});
				set({ wasteSummary: response.data, isLoading: false });
			} catch (error) {
				console.error("Fetch Waste Summary Error:", error.response || error);
				set({ error: error.message, isLoading: false });
			}
		},
		
		// Nouvelle méthode pour récupérer les pourcentages de gaspillage
		fetchWastePercentage: async () => {
			const { filterCriteria } = get();
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(`/waste/percentage`, {
					params: {
						restaurantId: filterCriteria.restaurantId,
						startDate: filterCriteria.startDate || undefined,
						endDate: filterCriteria.endDate || undefined,
						category: filterCriteria.category || undefined,
					},
				});
				set({
					wastePercentage: response.data.data, // Stocke les données de pourcentage
					isLoading: false,
				});
			} catch (error) {
				console.error("Fetch Waste Percentage Error:", error.response || error);
				set({
					error: error.message,
					isLoading: false,
					wastePercentage: null,
				});
			}
		},
		// Méthode existante inchangée
		fetchWasteTrends: async (restaurantId, days = 7) => {
			if (!restaurantId) {
				const errorMsg = "restaurantId is required";
				set({ error: errorMsg });
				throw new Error(errorMsg);
			}
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(`/waste/trends/daily`, {
					params: {
						restaurantId,
						days,
					},
				});
				set({ wasteTrends: response.data, isLoading: false });
			} catch (error) {
				console.error("Fetch Waste Trends Error:", error.response || error);
				set({ error: error.message, isLoading: false });
			}
		},
	}))
);
export default wasteStore;

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiRequest } from "../utils/apiRequest";
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const wasteStore = create(
	devtools((set, get) => ({
		wasteSummary: [],
		wasteTrends: [],
		wastePercentage: null, // Nouvel état pour stocker les données de pourcentage
		filterCriteria: {
			restaurantId: "",
			startDate: "",
			endDate: "",
			category: "",
		},
		isLoading: false,
		error: null,
		// Méthode existante inchangée
		setFilterCriteria: (criteria) => {
			set((state) => ({
				filterCriteria: { ...state.filterCriteria, ...criteria },
			}));
			get().fetchWasteSummary();
		},
		// Méthode existante inchangée
		resetFilters: () => {
			set({
				filterCriteria: {
					restaurantId: "",
					startDate: "",
					endDate: "",
					category: "",
				},
			});
			get().fetchWasteSummary();
		},
		// Méthode existante inchangée
		fetchWasteSummary: async () => {
			const { filterCriteria } = get();
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(`/waste/summary`, {
					params: {
						restaurantId: filterCriteria.restaurantId,
						startDate: filterCriteria.startDate || undefined,
						endDate: filterCriteria.endDate || undefined,
					},
				});
				set({ wasteSummary: response.data, isLoading: false });
			} catch (error) {
				console.error("Fetch Waste Summary Error:", error.response || error);
				set({ error: error.message, isLoading: false });
			}
		},
		// Nouvelle méthode pour récupérer les pourcentages de gaspillage
		fetchWastePercentage: async () => {
			const { filterCriteria } = get();
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(`/waste/percentage`, {
					params: {
						restaurantId: filterCriteria.restaurantId,
						startDate: filterCriteria.startDate || undefined,
						endDate: filterCriteria.endDate || undefined,
						category: filterCriteria.category || undefined,
					},
				});
				set({
					wastePercentage: response.data.data, // Stocke les données de pourcentage
					isLoading: false,
				});
			} catch (error) {
				console.error("Fetch Waste Percentage Error:", error.response || error);
				set({
					error: error.message,
					isLoading: false,
					wastePercentage: null,
				});
			}
		},
		// Méthode existante inchangée
		fetchWasteTrends: async (restaurantId, days = 7) => {
			if (!restaurantId) {
				const errorMsg = "restaurantId is required";
				set({ error: errorMsg });
				throw new Error(errorMsg);
			}
			set({ isLoading: true, error: null });
			try {
				const response = await apiRequest.get(`/waste/trends/daily`, {
					params: {
						restaurantId,
						days,
					},
				});
				set({ wasteTrends: response.data, isLoading: false });
			} catch (error) {
				console.error("Fetch Waste Trends Error:", error.response || error);
				set({ error: error.message, isLoading: false });
			}
		},
	}))
);
export default wasteStore;
