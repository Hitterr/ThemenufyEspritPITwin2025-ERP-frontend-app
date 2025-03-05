const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Replace with your Google OAuth client ID
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { authStore } from "../../../store/authStore";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const GoogleAuth = () => {
  const { googleLogin } = authStore();
  const navigate = useNavigate();
  return (
    <Col>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              console.log("📢 [GoogleAuth.jsx:18]", credentialResponse);
              await googleLogin(credentialResponse.credential);
              navigate("/");
            } catch (error) {}
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
