import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./login/Login";
import { authStore } from "../../store/authStore";
import { useEffect, useMemo } from "react";
import ForgotPassword from "./reset-password/ForgotPassword";
import Signup from "./signup/Signup";
export default function AuthRouting() {
	const { currentUser } = authStore();
	const location = useLocation();
	const availableRoutes = useMemo(
		() => ["/login", "/forgotPassword", "/signup"],
		[]
	);
	const navigate = useNavigate();
	useEffect(() => {
		if (currentUser == null && !availableRoutes.includes(location.pathname)) {
			navigate("/login");
		} else if (currentUser && availableRoutes.includes(location.pathname)) {
			navigate("/");
		}
	}, [currentUser, navigate, availableRoutes, location.pathname]);
	return (
		<Routes>
			<Route path="login" element={<Login />}></Route>
			<Route path="forgotPassword" element={<ForgotPassword />}></Route>
			<Route path="signup" element={<Signup />}></Route>
		</Routes>
	);
}
