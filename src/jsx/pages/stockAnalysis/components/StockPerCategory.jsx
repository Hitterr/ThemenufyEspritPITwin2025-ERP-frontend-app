import React from "react";
import ReactApexChart from "react-apexcharts";

const StockPerCategory = ({ data }) => {
  const options = {
    chart: {
      type: "bar",
      height: 230,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 5,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#EA7A9A"],
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    dataLabels: {
      enabled: false,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758", "#304758", "#304758", "#304758", "#304758"],
        margin: "20px",
      },
      formatter: function (val) {
        return val + " items";
      },
    },
    stroke: {
      show: false,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    yaxis: {
      lines: {
        show: false,
      },
      title: {
        text: "Number of Items",
      },
    },
    xaxis: {
      categories: data?.map((item) => item.category) || [],
      position: "bottom",
      labels: {
        rotate: -45,
        rotateAlways: false,
      },
      title: {
        text: "Categories",
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " items";
        },
      },
    },
  };

  const series = [
    {
      name: "Items Count",
      data: data?.map((item) => item.count) || [],
    },
  ];

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default StockPerCategory;
