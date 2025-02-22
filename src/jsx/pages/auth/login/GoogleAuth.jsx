const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
const GoogleAuth = () => {
	const { login } = authStore();
	const navigate = useNavigate();
	return (
		<div className="">
			<GoogleOAuthProvider clientId={clientId}>
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						const user = jwtDecode(credentialResponse.credential);
						login(user);
						navigate("/");
					}}
					shape="rectangular"
					onError={() => {
						console.log("Login Failed");
					}}
				/>
				;
			</GoogleOAuthProvider>
		</div>
	);
};
export default GoogleAuth;
