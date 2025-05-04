import { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { apiRequest } from "../../utils/apiRequest";
const Chatbot = ({ show, onHide }) => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);
	useEffect(() => {
		if (show) {
			setMessages([
				{
					text:
						"👋 Bonjour ! Je suis votre assistant. Posez-moi une question sur les fournisseurs ou les produits.",
					isUser: false,
				},
			]);
		}
	}, [show]);
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const sendMessage = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		const userMessage = { text: input, isUser: true };
		setMessages((prev) => [...prev, userMessage]);
		try {
			const response = await apiRequest.post(
				"http://localhost:5000/api/chatbot/process",
				{
					input,
				}
			);
			const botReply = {
				text: response.data.message,
				isUser: false,
			};
			setMessages((prev) => [...prev, botReply]);
		} catch (err) {
			setMessages((prev) => [
				...prev,
				{ text: "❌ Erreur lors de la réponse du chatbot.", isUser: false },
			]);
		}
		setInput("");
	};
	return (
		<Modal show={show} onHide={onHide} centered size="lg">
			<Modal.Header closeButton className=" text-white">
				<Modal.Title>
					<i className="fas fa-robot me-2"></i>Assistant Fournisseur
				</Modal.Title>
			</Modal.Header>
			<Modal.Body
				style={{
					maxHeight: "400px",
					overflowY: "auto",
					backgroundColor: "#f8f9fa",
				}}
			>
				<div className="d-flex flex-column gap-3 px-2">
					{messages.map((msg, idx) => (
						<div
							key={idx}
							className={`p-3 rounded-4 shadow-sm ${
								msg.isUser
									? "align-self-end bg-primary text-white"
									: "align-self-start bg-secondary text-white"
							}`}
							style={{ maxWidth: "75%" }}
						>
							{msg.text}
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</Modal.Body>
			<Modal.Footer className="bg-light">
				<Form className="d-flex w-100 gap-2" onSubmit={sendMessage}>
					<Form.Control
						type="text"
						value={input}
						placeholder="Posez votre question ici…"
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && sendMessage()}
						className="rounded-pill"
					/>
					<Button variant="primary" className="rounded-pill px-4">
						Envoyer
					</Button>
				</Form>
			</Modal.Footer>
		</Modal>
	);
};
export default Chatbot;
