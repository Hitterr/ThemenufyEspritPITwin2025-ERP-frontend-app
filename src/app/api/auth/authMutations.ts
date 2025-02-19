import { apiRequest } from "@/lib/apiRequest";
import { useMutation } from "@tanstack/react-query";
const loginFn = async (userData: { email: string; password: string }) =>
	apiRequest.post(import.meta.env.VITE_API_URI + "/login", userData);
export const useLoginMutation = () => {
	return useMutation({ mutationFn: loginFn });
};
