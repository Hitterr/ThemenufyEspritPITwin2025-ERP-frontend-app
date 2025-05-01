// src/App.jsx
import { useEffect, useState } from "react";
import { Button, Row, Col, Nav, Tab, Modal } from "react-bootstrap";
import { FaChartLine, FaUtensils } from "react-icons/fa";
import ConsumptionForm from "./ConsumptionForm";
import ConsumptionList from "./ConsumptionList";
import PriceHistoryList from "./PriceHistoryList";
import PriceHistoryForm from "./PriceForm";
import useConsumptionHistoryStore from "../../store/useConsumptionHistoryStore";
import usePriceHistoryStore from "../../store/usePriceHistoryStore";
const App = ({ restaurantId = "" }) => {
	const { fetchConsumptions } = useConsumptionHistoryStore();
	const { fetchPriceHistories } = usePriceHistoryStore();
	const [showConsumptionForm, setShowConsumptionForm] = useState(false);
	const [showPriceForm, setShowPriceForm] = useState(false);
	const [activeTab, setActiveTab] = useState("consumption");
	useEffect(() => {
		fetchConsumptions(restaurantId);
		fetchPriceHistories(restaurantId);
	}, [fetchConsumptions, fetchPriceHistories, restaurantId]);
	return (
		<div className="container-fluid py-4">
			<Row className="mb-4">
				<Col>
					{activeTab === "consumption" && (
						<Button
							variant="success"
							onClick={() => setShowConsumptionForm(!showConsumptionForm)}
						>
							<FaUtensils size={20} />
						</Button>
					)}
					{activeTab === "prices" && (
						<Button
							variant="success"
							onClick={() => setShowPriceForm(!showPriceForm)}
						>
							<FaChartLine size={20} />
						</Button>
					)}
				</Col>
			</Row>
			<Tab.Container
				id="dashboard-tabs"
				activeKey={activeTab}
				onSelect={(key) => setActiveTab(key)}
			>
				<Nav variant="tabs" className="mb-4">
					<Nav.Item>
						<Nav.Link eventKey="consumption">
							<FaUtensils className="me-2" />
							Consumption History
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey="prices">
							<FaChartLine className="me-2" />
							Price History
						</Nav.Link>
					</Nav.Item>
				</Nav>
				<Tab.Content>
					<Tab.Pane eventKey="consumption">
						{showConsumptionForm && (
							<Modal
								show={showConsumptionForm}
								onHide={() => setShowConsumptionForm(false)}
							>
								<ConsumptionForm
									restaurantId={restaurantId}
									onSuccess={() => {
										setShowConsumptionForm(false);
										fetchConsumptions(restaurantId);
									}}
									onCancel={() => setShowConsumptionForm(false)}
								/>
							</Modal>
						)}
						<ConsumptionList restaurantId={restaurantId} />
					</Tab.Pane>
					<Tab.Pane eventKey="prices">
						{showPriceForm && (
							<Modal show={showPriceForm} onHide={() => setShowPriceForm(false)}>
								<PriceHistoryForm
									restaurantId={restaurantId}
									onSuccess={() => {
										setShowPriceForm(false);
										fetchPriceHistories(restaurantId);
									}}
									onCancel={() => setShowPriceForm(false)}
								/>
							</Modal>
						)}
						<PriceHistoryList />
					</Tab.Pane>
				</Tab.Content>
			</Tab.Container>
		</div>
	);
};
export default App;
