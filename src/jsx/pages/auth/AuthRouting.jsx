import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import ForgotPassword from "./reset-password/ForgotPassword";
import Logout from './logout/Logout';
export default function AuthRouting() {
	return (
		<Routes>
			<Route path="login" element={<Login />}></Route>
			<Route path="forgotPassword" element={<ForgotPassword />}></Route>
			<Route path="logOut" element={<Logout />}></Route>
		</Routes>
	);
}
