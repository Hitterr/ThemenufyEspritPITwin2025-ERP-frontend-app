import React from "react";
import ReactApexChart from "react-apexcharts";

class InvoiceStats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Data and options for the area chart (chart1)
      areaChartData: {
        series: [
          {
            name: "Running",
            data: [20, 40, 20, 80, 40, 40, 20, 60, 60, 20, 110, 60],
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "area",
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: [4],
            colors: ["#f53c79"],
            curve: "straight",
          },
          xaxis: {
            type: "text",
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
          },
          colors: ["#f53c79"],
          markers: {
            size: [6],
            strokeWidth: [4],
            strokeColors: ["#f53c79"],
            border: 0,
            colors: ["#fff"],
            hover: {
              size: 10,
            },
          },
          yaxis: {
            title: {
              text: "",
            },
          },
        },
      },

      // Data and options for the radial bar chart (chart2)
      radialBarData: {
        series: [71, 63, 90],
        options: {
          chart: {
            type: "radialBar",
            offsetY: 0,
            offsetX: 0,
          },
          plotOptions: {
            radialBar: {
              size: undefined,
              inverseOrder: false,
              hollow: {
                margin: 0,
                size: "30%",
                background: "transparent",
              },
              track: {
                show: true,
                background: "#e1e5ff",
                strokeWidth: "10%",
                opacity: 1,
                margin: 18,
              },
            },
          },
          responsive: [
            {
              breakpoint: 830,
              options: {
                chart: {
                  offsetY: 0,
                  offsetX: 0,
                },
                legend: {
                  position: "bottom",
                  offsetX: 0,
                  offsetY: 0,
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: "20%",
                    },
                  },
                },
              },
            },
            {
              breakpoint: 800,
              options: {
                chart: {
                  offsetY: 0,
                  offsetX: 0,
                },
                legend: {
                  position: "bottom",
                  offsetX: 0,
                  offsetY: 0,
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: "10%",
                    },
                  },
                },
              },
            },
            {
              breakpoint: 768,
              options: {
                chart: {
                  offsetY: 0,
                  offsetX: 0,
                },
                legend: {
                  position: "bottom",
                  offsetX: 0,
                  offsetY: 0,
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: "30%",
                    },
                  },
                },
              },
            },
            {
              breakpoint: 330,
              options: {
                chart: {
                  offsetY: 0,
                  offsetX: 0,
                },
                legend: {
                  position: "bottom",
                  offsetX: 0,
                  offsetY: 0,
                },
                plotOptions: {
                  radialBar: {
                    hollow: {
                      size: "20%",
                    },
                  },
                },
              },
            },
          ],
          fill: {
            opacity: 1,
          },
          colors: ["#EA7A9A", "#EA7A9A", "#EA7A9A"],
          labels: ["Ticket A", "Ticket B", "Ticket C"],
          legend: {
            fontSize: "14px",
            show: true,
            position: "bottom",
          },
        },
      },
    };
  }

  render() {
    return (
      <div>
        {/* Radial Bar Chart (Pie chart first) */}
        <div id="radial-bar-chart">
          <ReactApexChart
            options={this.state.radialBarData.options}
            series={this.state.radialBarData.series}
            type="radialBar"
            height={this.props.height || 300}
          />
        </div>

        {/* Area Chart (Line chart second) */}
        <div id="area-chart">
          <ReactApexChart
            options={this.state.areaChartData.options}
            series={this.state.areaChartData.series}
            type="area"
            height={300}
          />
        </div>
      </div>
    );
  }
}

export default InvoiceStats;
