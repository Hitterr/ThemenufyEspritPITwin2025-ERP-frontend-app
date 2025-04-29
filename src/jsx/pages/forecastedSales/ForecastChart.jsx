import React from "react";
import ReactApexChart from "react-apexcharts";

const ForecastChart = ({ filteredData }) => {
  const series = [
    {
      name: "Forecasted Quantity",
      data: filteredData.map(item => item.forecastedQty),
    },
    {
      name: "Current Stock",
      data: filteredData.map(item => item.currentStock),
    }
  ];

  const options = {
    chart: {
      id: "forecastChart",
      type: "bar",
      height: 350,
      toolbar: { show: true },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    title: {
      text: filteredData.length === 1 ? `Forecast for: ${filteredData[0].ingredient}` : "Ingredient Forecast Overview",
      align: "center",
      style: {
        fontSize: "20px",
        color: "#333",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      fontSize: "13px",
      fontWeight: 400,
      labels: { colors: "#333" },
      position: "bottom",
      horizontalAlign: "center",
    },
    xaxis: {
      categories: filteredData.map(item => item.ingredient),
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#3e4954",
          fontSize: "13px",
        },
      },
    },
    fill: {
      colors: ["#EA7A9A", "#D45BFF"],
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " units";
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={350}
    />
  );
};

export default ForecastChart;
