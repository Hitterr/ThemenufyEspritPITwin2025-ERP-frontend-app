import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
export const authStore = create(
	devtools((set) => ({
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
		logout: async () => {},
	}))
);
