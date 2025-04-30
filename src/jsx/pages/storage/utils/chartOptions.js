export const getChartOptions = (dates) => ({
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