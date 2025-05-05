import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useConsumptionsQuery } from "../utils/queries";
/* import {Chart, PointElement} from 'chart.js';
Chart.register(PointElement); */
/* import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
//import faker from 'faker';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
 */
import { format } from "date-fns";
export const ConsumptionLineChart = () => {
	const { data: consumptions } = useConsumptionsQuery({ ee: "ee" });
	console.log(consumptions);
	const data = {
		defaultFontFamily: "Poppins",
		labels: consumptions?.map((each) => format(each?.createdAt, "dd/MM/yyyy")),
		datasets: [
			{
				label: "My First dataset",
				data: [25, 20, 50, 41, 55, 45, 70],
				borderColor: "rgba(234, 122, 154,1)",
				borderWidth: "2",
				//pointBackgroundColor: "rgba(64, 24, 157, 1)",
				backgroundColor: "rgba(234, 122, 154,0)",
				tension: 0.4,
			},
		],
	};
	const options = {
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			y: {
				min: 0,
				max: 100,
				ticks: {
					beginAtZero: true,
					padding: 0,
				},
			},
			x: {
				ticks: {
					padding: 0,
				},
				gridLines: {
					display: false,
					drawBorder: false,
				},
			},
		},
	};
	return (
		<>
			<Line data={data} options={options} />
		</>
	);
};
export default ConsumptionLineChart;
