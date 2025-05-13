import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { usePriceHistoryQuery } from "../utils/queries";
import { format } from "date-fns";

const PriceHistoryLineChart = () => {
  const { data: priceHistory } = usePriceHistoryQuery();

  const colors = ["#3a86ff", "#ff006e", "#8338ec", "#fb5607"];
  const groupedData = priceHistory?.reduce((acc, entry) => {
    const stockId = entry?.stockId?._id;
    if (stockId) {
      acc[stockId] = acc[stockId] || [];
      acc[stockId].push(entry);
    }
    return acc;
  }, {});

  const data = {
    labels: [
      ...priceHistory?.map((entry) => format(entry?.createdAt, "dd/MM/yyyy")),
    ],
    datasets: Object.values(groupedData || {}).map((group, index) => ({
      label: group[0]?.stockId?.libelle || `Stock ${index + 1}`,
      data: group.map((entry) => entry?.price),
      borderColor: colors[index % colors.length],
      borderWidth: 2,
      tension: 0.4,
      fill: false,
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
        title: { display: true, text: "Price" },
        ticks: { callback: (value) => `$${value}` },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default PriceHistoryLineChart;
