import { Card, Table } from "react-bootstrap";
import "animate.css";
import { useConsumptionsQuery } from "./utils/queries";
import ConsumptionLineChart from "./components/ConsumptionLineChart";
// Extracted chart options for better organization
const getChartOptions = (dates) => ({
	chart: {
		type: "area",
		height: 350,
		toolbar: {
			show: true,
			tools: { download: true, selection: true, pan: true, reset: true },
		},
	},
	colors: ["#3a86ff"],
	dataLabels: { enabled: false },
	stroke: { curve: "smooth", width: 3 },
	fill: {
		type: "gradient",
		gradient: {
			shadeIntensity: 1,
			opacityFrom: 0.7,
			opacityTo: 0.3,
			stops: [0, 90, 100],
		},
	},
	xaxis: {
		categories: dates,
		labels: { formatter: (value) => value },
	},
	yaxis: {
		title: { text: "Quantity Consumed" },
		labels: { formatter: (val) => val.toFixed(0) },
	},
	tooltip: { y: { formatter: (val) => `${val} units` } },
});
const ConsumptionList = () => {
	const { data: consumptions, isLoading, isFetched } = useConsumptionsQuery();
	if (isLoading) return <div>Loading...</div>;
	return (
		<Card>
			<Card.Body>
				<ConsumptionLineChart />
				<Table>
					<thead>
						<tr>
							<th>Date</th>
							<th>Stock</th>
							<th>Quantity Consumed</th>
							<th>Restaurant</th>
						</tr>
					</thead>
					<tbody>
						{isFetched &&
							consumptions &&
							consumptions.map((each) => (
								<tr key={each?._id}>
									<td>{new Date(each?.createdAt).toLocaleDateString()}</td>
									<td>{each?.stockId?.libelle}</td>
									<td>
										{each?.qty}
										<span className="mx-2">{each?.stockId?.unit} </span>
									</td>
									<td>{each?.restaurantId?.nameRes}</td>
								</tr>
							))}
					</tbody>
				</Table>
			</Card.Body>
		</Card>
	);
};
export default ConsumptionList;
