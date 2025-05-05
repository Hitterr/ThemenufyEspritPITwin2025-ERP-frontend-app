import ReactApexChart from "react-apexcharts";
import { formatDate } from "../../utils/formatDate";

// Génère un dégradé HEX entre deux couleurs
const interpolateColor = (color1, color2, factor) => {
  const hex = (c) => c.replace("#", "");
  const r1 = parseInt(hex(color1).slice(0, 2), 16);
  const g1 = parseInt(hex(color1).slice(2, 4), 16);
  const b1 = parseInt(hex(color1).slice(4, 6), 16);
  const r2 = parseInt(hex(color2).slice(0, 2), 16);
  const g2 = parseInt(hex(color2).slice(2, 4), 16);
  const b2 = parseInt(hex(color2).slice(4, 6), 16);
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

const ForecastHeatmap = ({ weeklyData }) => {
  const categories = weeklyData.map((d) => formatDate(d.week));

  const allValues = weeklyData.flatMap((d) => [
    d.predictedQty,
    d.missingQty,
    d.quantityToOrder,
  ]);
  const maxVal = Math.max(...allValues);
  const steps = 6;
  const stepSize = maxVal / steps;

const baseStart = "#F5A09A"; 
const baseEnd = "#D8472F";   


  const colorRanges = [
    { from: 0, to: 0, color: "#ffffff", name: "Zero" },
    ...Array.from({ length: steps }, (_, i) => {
      const from = Math.round(1 + i * stepSize);
      const to = i === steps - 1 ? Infinity : Math.round((i + 1) * stepSize);
      const color = interpolateColor(baseStart, baseEnd, i / (steps - 1));
      return { from, to, color };
    }),
  ];

  const chartOptions = {
    chart: { type: "heatmap", toolbar: { show: false } },
    dataLabels: {
      enabled: true,
      style: { colors: ["#fff"] },
      formatter: (val) => (val === 0 ? "" : val),
    },
    xaxis: { categories },
    yaxis: { labels: { style: { fontWeight: 500 } } },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        useFillColorAsStroke: false,
        radius: 4,
        colorScale: {
          ranges: colorRanges,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "13px",
      },
    },
  };

  const chartSeries = [
    {
      name: "Predicted Qty",
      data: weeklyData.map((d) => ({
        x: formatDate(d.week),
        y: Number(d.predictedQty),
      })),
    },
    {
      name: "Missing Qty",
      data: weeklyData.map((d) => ({
        x: formatDate(d.week),
        y: Number(d.missingQty),
      })),
    },
    {
      name: "Quantity to Order",
      data: weeklyData.map((d) => ({
        x: formatDate(d.week),
        y: Number(d.quantityToOrder),
      })),
    },
  ];

  return (
    <div style={{ overflowX: "auto", minWidth: "700px" }}>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="heatmap"
        height={450}
      />
    </div>
  );
};

export default ForecastHeatmap;
