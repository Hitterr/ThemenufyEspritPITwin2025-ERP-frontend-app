import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useConsumptionsQuery } from "../utils/queries";
import { format } from "date-fns";
export const ConsumptionLineChart = () => {
  const { data: consumptions } = useConsumptionsQuery({});
  console.log(consumptions);
  const groupedData = consumptions?.reduce((acc, entry) => {
    const stockId = entry?.stockId?._id;
    if (stockId) {
      acc[stockId] = acc[stockId] || [];
      acc[stockId].push(entry);
    }
    return acc;
  }, {});

  const colors = ["#3a86ff", "#ff006e", "#8338ec", "#fb5607"];
  const data = {
    defaultFontFamily: "Poppins",
    labels: consumptions?.map((each) => format(each?.createdAt, "dd/MM/yyyy")),
    datasets: Object.values(groupedData || {}).map((group, index) => ({
      label: group[0]?.stockId?.libelle || `Stock ${index + 1}`,
      data: group.map((entry) => entry?.qty),
      borderColor: colors[index % colors.length],
      borderWidth: 2,
      backgroundColor: "rgba(234, 122, 154,0)",
      tension: 0.4,
    })),
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
    scales: {
      y: {
        min: 0,
        max: Math.max(...(consumptions?.map((each) => each?.qty) || [0])) + 10,
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
