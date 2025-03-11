import { Button, Container } from "react-bootstrap";
import { authStore } from "../../store/authStore";
export default function Test() {
	const { currentUser, updateCurrentUser } = authStore();
	return (
		<Container>
			{" "}
			<h1 className="text-center">ZUSTAND TEST EXAMPLE By {currentUser.name} !</h1>
			<Button onClick={() => updateCurrentUser("Username")}>
				update currentUser !{" "}
			</Button>
			<hr></hr>
		</Container>
	);
}
