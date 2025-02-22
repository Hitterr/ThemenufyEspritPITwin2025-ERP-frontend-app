const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { authStore } from "../../../store/authStore";
const GoogleAuth = () => {
	const { login } = authStore();
	return (
		<div className="">
			<GoogleOAuthProvider clientId={clientId}>
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						console.log(credentialResponse);
						const user = jwtDecode(credentialResponse.credential);
						login(user);
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
