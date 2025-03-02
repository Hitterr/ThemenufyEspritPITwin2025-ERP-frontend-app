import axios from "axios";
import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
const apiRequest = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL,
});
export const authStore = create(
	devtools(
		devtools(
			persist((set) => ({
				currentUser: {
					firstName: "Hadil",
					lastName: "Bouhachem",
					// role: "admin",
					email: "hadil.bouhachem@example.com",
					phone: "12345678",
					address: "2036 Soukra",
					employee: {
						salary: 2500,
					},
					restaurant: {
						name: "Restaurant #1",
					},
					image: "images/avatar/1.jpg",
				},
				profile: {
					tab: "About",
				},
				setActiveTab: (tab) => {
					set(
						produce((state) => {
							state.profile.tab = tab;
						})
					);
				},
				updateProfile: (userData) => {
					set(
						produce((state) => {
							state.currentUser = {
								...state.currentUser,
								...userData,
								employee: {
									...state.currentUser.employee,
									...userData.employee,
								},
								restaurant: {
									...state.currentUser.restaurant,
									...userData.restaurant,
								},
							};
						})
					);
				},
				login: async (userdata) => {
					const res = await apiRequest.post("/auth/login/email", userdata);
					set(
						produce((state) => {
							if (res.data.data) state.currentUser = res.data.data;
						})
					);
				},
				signup: async () => {},
				logout: async () => {
					set(
						produce((state) => {
							state.currentUser = null;
						})
					);
				},
				googleLogin: async (token_id) => {
					console.log("📢 [authStore.js:72]", token_id);
				},
			}))
		)
	)
);
