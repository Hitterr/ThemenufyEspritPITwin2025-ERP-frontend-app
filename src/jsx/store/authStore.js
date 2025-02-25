import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
export const authStore = create(
	devtools(
		persist((set) => ({
			currentUser: null,
			updateCurrentUser: (userName) => {
				set(
					produce((state) => {
						state.currentUser.name = userName;
					})
				);
			},
			login: async (userdata) => {
				set(
					produce((state) => {
						state.currentUser = userdata;
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
		}))
	)
);
