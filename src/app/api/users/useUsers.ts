import { apiRequest } from "@/lib/apiRequest";
import { useQuery } from "@tanstack/react-query";
const fetchUsers = async () => {
	const response = await apiRequest.get("/users");
	if (response.status != 200) {
		throw new Error("Network response was not ok");
	}
	return response.data;
};
export const useUsers = () => {
	return useQuery({
		queryKey: ["users"], // Unique key for the query
		queryFn: fetchUsers, // Function to fetch data
	});
};
