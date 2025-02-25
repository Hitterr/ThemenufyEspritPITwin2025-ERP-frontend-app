const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { authStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import { Col } from "react-bootstrap";
const GoogleAuth = () => {
	const { login } = authStore();
	const navigate = useNavigate();
	return (
		<Col>
			<GoogleOAuthProvider clientId={clientId}>
				<GoogleLogin
					onSuccess={(credentialResponse) => {
						const user = jwtDecode(credentialResponse.credential);
						login(user);
						navigate("/");
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
