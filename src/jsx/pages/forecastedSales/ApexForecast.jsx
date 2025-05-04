import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ForecastFilters from "./ForecastFilters";
import ForecastChart from "./ForecastChart";
import { apiRequest } from "../../utils/apiRequest";
import { Card } from "react-bootstrap";
const ApexForecast = () => {
	const [forecastData, setForecastData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [inputDays, setInputDays] = useState(7);
	const [days, setDays] = useState(7);
	const [selectedStock, setSelectedStock] = useState("");
	useEffect(() => {
		loadForecast(days);
	}, [days]);
	const loadForecast = async (daysToLoad) => {
		setLoading(true);
		try {
			const res = await apiRequest.get(
				`http://localhost:5000/api/stocks/forecast-auto/auto?days=${daysToLoad}`
			);
			setForecastData(res.data.data);
		} catch (error) {
			console.error("Error loading forecast:", error);
		}
		setLoading(false);
	};
	const handleApply = () => {
		if (!inputDays || inputDays < 1) {
			alert("Please enter a valid number of days.");
			return;
		}
		setDays(inputDays);
	};
	const filteredData = selectedStock
		? forecastData.filter((item) => item.stock === selectedStock)
		: forecastData;
	if (loading) return <LoadingSpinner />;
	return (
		<Card className="container mt-4">
			<ForecastFilters
				inputDays={inputDays}
				setInputDays={setInputDays}
				handleApply={handleApply}
				forecastData={forecastData}
				selectedStock={selectedStock}
				setSelectedStock={setSelectedStock}
			/>
			{filteredData.length === 0 ? (
				<div className="text-center text-muted">
					<i
						className="fas fa-box-open"
						style={{ fontSize: "50px", marginBottom: "10px" }}
					></i>
					<br />
					No forecast data available.
				</div>
			) : (
				<ForecastChart filteredData={filteredData} />
			)}
		</Card>
	);
};
export default ApexForecast;
