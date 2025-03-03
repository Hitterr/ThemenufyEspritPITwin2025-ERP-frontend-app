const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { authStore } from "../../../store/authStore";
import { Col } from "react-bootstrap";
const GoogleAuth = () => {
	const { googleLogin } = authStore();
	return (
		<Col>
			<GoogleOAuthProvider clientId={clientId}>
				<GoogleLogin
					onSuccess={async (credentialResponse) => {
						// const user = jwtDecode(credentialResponse.credential);
						// login(user);
						// navigate("/");
						console.log("📢 [GoogleAuth.jsx:18]", credentialResponse);
						await googleLogin(credentialResponse.credential);
					}}
					size="large"
					shape="rectangular"
					type="standard"
					text=" sign_in_with_google"
					theme="outline"
					onError={() => {
						console.log("Login Failed");
					}}
				/>
				;
			</GoogleOAuthProvider>
		</Col>
	);
};
export default GoogleAuth;
