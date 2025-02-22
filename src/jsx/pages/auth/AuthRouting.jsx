import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Signup from"./signup/Signup"
export default function AuthRouting() {
	return (
		<Routes>
			<Route path="login" element={<Login />}></Route>
			<Route path="signup" element={<Signup />}></Route>
		</Routes>
	);
}
