import { Form, Button, InputGroup } from "react-bootstrap";
const ForecastFilters = ({
	inputDays,
	setInputDays,
	handleApply,
	forecastData,
	selectedStock,
	setSelectedStock,
}) => {
	return (
		<div className="p-4  mb-4">
			<h5 className="mb-3">Forecast Settings</h5>
			<InputGroup className="mb-3">
				<Form.Control
					type="number"
					min="1"
					value={inputDays}
					onChange={(e) => setInputDays(e.target.value)}
					placeholder="Enter number of days"
				/>
				<Button variant="primary" onClick={handleApply}>
					Apply
				</Button>
			</InputGroup>
			<Form.Select
				className="mb-3"
				value={selectedStock}
				onChange={(e) => setSelectedStock(e.target.value)}
			>
				<option value="">-- Select an Stock --</option>
				{forecastData.map((item) => (
					<option key={item.stock} value={item.stock}>
						{item.stock}
					</option>
				))}
			</Form.Select>
		</div>
	);
};
export default ForecastFilters;
