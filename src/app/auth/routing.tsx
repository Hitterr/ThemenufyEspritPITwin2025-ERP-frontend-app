import { Route, Routes } from "react-router";
import LoginPage from "./login/page";
import DashboardPage from "./dashboard/page";
import SignUpPage from "./signup/page";
import UsersPage from "./dashboard/users/page";
export const AuthRouting = () => {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />}></Route>
			<Route path="/signup" element={<SignUpPage />}></Route>
			<Route path="/dashboard" element={<DashboardPage />}>
				<Route path="users" element={<UsersPage />}></Route>
			</Route>
		</Routes>
	);
};
