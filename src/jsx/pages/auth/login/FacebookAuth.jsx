const clientId = import.meta.env.VITE_FACEBOOK_APP_ID; // Replace with your Google OAuth client ID
import FacebookLogin from "react-facebook-login";
import { FaFacebook } from "react-icons/fa";
import { authStore } from "../../../store/authStore";
const FacebookAuth = () => {
	const { login } = authStore();
	const responseFacebook = (response) => {
		console.log(response);
		login(response);
	};
	return (
		<FacebookLogin
			appId={clientId}
			autoLoad={true}
			callback={responseFacebook}
			fields="name,email,picture"
			cssClass="btn btn-secondary w-100  m-0"
			buttonStyle={{ height: "40px", textAlign: "center", padding: 0 }}
			textButton=""
			icon={<FaFacebook size={20} className="mx-2" />}
		/>
	);
};
export default FacebookAuth;
