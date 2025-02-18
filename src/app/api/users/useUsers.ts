// src/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
const api = import.meta.env.VITE_API_URI + "/users";
const fetchUsers = async () => {
	const response = await fetch(api);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
};
export const useUsers = () => {
	return useQuery({
		queryKey: ["users"], // Unique key for the query
		queryFn: fetchUsers, // Function to fetch data
	});
};
