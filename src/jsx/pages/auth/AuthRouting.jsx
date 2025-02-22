import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./login/Login";
import { authStore } from "../../store/authStore";
import { useEffect } from "react";
export default function AuthRouting() {
	const { currentUser } = authStore();
	const navigate = useNavigate();
	useEffect(() => {
		if (currentUser == null) {
			navigate("/login");
		} else {
			navigate("/");
		}
	}, [currentUser]);
	return (
		<Routes>
			<Route path="login" element={<Login />}></Route>
		</Routes>
	);
}
