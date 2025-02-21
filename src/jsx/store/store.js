// storeComposer.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { produce } from "immer";
import axios from "axios";
import { authStore } from "./authStore";
// Todo Store
const createTodoStore = (set) => ({
	list: [],
	fetchTodos: async () => {
		const response = await fetch(
			"https://jsonplaceholder.typicode.com/todos?_limit=10"
		);
		set({ list: await response.json() });
	},
	addTodo: async (text) => {
		try {
			const response = await axios.post(
				"https://jsonplaceholder.typicode.com/todos",
				{
					title: text,
					completed: false,
				}
			);
			set(
				produce((state) => {
					state.list.push(response.data); // Add the new todo to the state
				})
			);
		} catch (error) {
			console.error("Error adding todo:", error);
		}
	},
});
// Combine Stores
export const useCombinedStore = create(
	devtools((set) => ({
		...createTodoStore(set),
		...authStore(set),
	}))
);
export default useCombinedStore;
