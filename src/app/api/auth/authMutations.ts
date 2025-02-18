import { apiRequest } from "@/lib/apiRequest";
import { useMutation } from "@tanstack/react-query";
const loginFn = async (userData: { email: string; password: string }) => {
	apiRequest.post("/login", userData);
};
export const useLoginMutation = () => {
	return useMutation({ mutationFn: loginFn });
};
