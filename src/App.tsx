import { Route, Routes } from "react-router";
import "./App.css";
import { AuthRouting } from "./app/auth/routing";
import LoginPage from "./app/auth/login/page";
import { ThemeProvider } from "./components/theme-provider";
function App() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<Routes>
				<Route index element={<LoginPage />} />
			</Routes>
			<AuthRouting />
		</ThemeProvider>
	);
}
export default App;
