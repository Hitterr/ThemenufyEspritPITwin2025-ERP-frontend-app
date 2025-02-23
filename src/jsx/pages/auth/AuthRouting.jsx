import { Route, Routes } from "react-router-dom";
import Login from "./login/Login";
import Profile from "./profile/Profile";
export default function AuthRouting() {
	return (
		<Routes>
			<Route path="login" element={<Login />}></Route>
		
		</Routes>
	);
}
