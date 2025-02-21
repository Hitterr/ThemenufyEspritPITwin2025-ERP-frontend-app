import { Container } from "react-bootstrap";
import { useCombinedStore } from "../../store/store";
import { useEffect } from "react";
export default function Test() {
	const { list, fetchTodos, addTodo, currentUser } = useCombinedStore();
	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);
	return (
		<Container>
			{" "}
			<h1 className="text-center">ZUSTAND TEST EXAMPLE By {currentUser.name} !</h1>
			<hr></hr>
			<h2>Todos:</h2>
			<ul>
				{list.map((todo, index) => (
					<li key={index}>{todo.title}</li>
				))}
			</ul>
			<button onClick={async () => await addTodo("New Todo")}>Add Todo</button>
		</Container>
	);
}
