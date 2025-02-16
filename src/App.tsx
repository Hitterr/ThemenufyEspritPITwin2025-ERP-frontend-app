import { Route, Routes } from "react-router";
import "./App.css";
import { AuthRouting } from "./app/auth/routing";
import LoginPage from "./app/auth/login/page";
function App() {
	return (
		<>
			<Routes>
				<Route index element={<LoginPage />} />
			</Routes>
			<AuthRouting />
		</>
	);
}
export default App;
