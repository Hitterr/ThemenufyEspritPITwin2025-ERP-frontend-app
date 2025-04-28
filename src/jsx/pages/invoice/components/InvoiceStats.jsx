import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import useInvoiceStore from "../../../store/invoiceStore";
import { format } from "date-fns";

class InvoiceStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      period: "month", // Default period
      startDate: new Date(new Date().getFullYear(), 0, 1), // Default: Start of current year
      endDate: new Date(), // Default: Today
      areaChartData: {
        series: [
          { name: "Pending", data: [] },
          { name: "Delivered", data: [] },
          { name: "Cancelled", data: [] },
        ],
        options: {
          chart: {
            height: 350,
            type: "area",
            toolbar: { show: false },
          },
          dataLabels: { enabled: false },
          stroke: {
            width: [4],
            colors: ["#f53c79", "#36A2EB", "#FFCE56"],
            curve: "straight",
          },
          xaxis: {
            type: "text",
            categories: [],
          },
          colors: ["#f53c79", "#36A2EB", "#FFCE56"],
          markers: {
            size: [6],
            strokeWidth: [4],
            strokeColors: ["#f53c79", "#36A2EB", "#FFCE56"],
            border: 0,
            colors: ["#fff"],
            hover: { size: 10 },
          },
          yaxis: {
            title: { text: "Number of Invoices" },
          },
        },
      },
      radialBarData: {
        series: [0, 0, 0],
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
                chart: { offsetY: 0, offsetX: 0 },
                legend: { position: "bottom", offsetX: 0, offsetY: 0 },
                plotOptions: { radialBar: { hollow: { size: "20%" } } },
              },
            },
            {
              breakpoint: 800,
              options: {
                chart: { offsetY: 0, offsetX: 0 },
                legend: { position: "bottom", offsetX: 0, offsetY: 0 },
                plotOptions: { radialBar: { hollow: { size: "10%" } } },
              },
            },
            {
              breakpoint: 768,
              options: {
                chart: { offsetY: 0, offsetX: 0 },
                legend: { position: "bottom", offsetX: 0, offsetY: 0 },
                plotOptions: { radialBar: { hollow: { size: "30%" } } },
              },
            },
            {
              breakpoint: 330,
              options: {
                chart: { offsetY: 0, offsetX: 0 },
                legend: { position: "bottom", offsetX: 0, offsetY: 0 },
                plotOptions: { radialBar: { hollow: { size: "20%" } } },
              },
            },
          ],
          fill: { opacity: 1 },
          colors: ["#f53c79", "#36A2EB", "#FFCE56"],
          labels: ["Pending", "Delivered", "Cancelled"],
          legend: {
            fontSize: "14px",
            show: true,
            position: "bottom",
          },
        },
      },
    };
  }

  componentDidMount() {
    this.fetchStats();
  }

  fetchStats = async () => {
    const { period, startDate, endDate } = this.state;
    const fetchInvoiceStats = useInvoiceStore.getState().fetchInvoiceStats;

    try {
      await fetchInvoiceStats({ period, startDate, endDate });
      const invoiceStats = useInvoiceStore.getState().invoiceStats.data;

      // Update Radial Bar Chart
      const radialSeries = [
        invoiceStats.statusCounts.pending || 0,
        invoiceStats.statusCounts.delivered || 0,
        invoiceStats.statusCounts.cancelled || 0,
      ];

      // Update Area Chart
      const periods = invoiceStats.periodCounts.map((item) => {
        switch (period) {
          case "week":
            return `Week ${item.period}`;
          case "month":
            return format(new Date(2023, item.period - 1, 1), "MMM");
          case "year":
            return item.period.toString();
          default:
            return format(new Date(item.period), "yyyy-MM-dd");
        }
      });

      const pendingData = invoiceStats.periodCounts.map(
        (item) => (item.pending?.paid || 0) + (item.pending?.nopaid || 0)
      );
      const deliveredData = invoiceStats.periodCounts.map(
        (item) => (item.delivered?.paid || 0) + (item.delivered?.nopaid || 0)
      );
      const cancelledData = invoiceStats.periodCounts.map(
        (item) => (item.cancelled?.paid || 0) + (item.cancelled?.nopaid || 0)
      );

      this.setState({
        radialBarData: {
          ...this.state.radialBarData,
          series: radialSeries,
        },
        areaChartData: {
          ...this.state.areaChartData,
          series: [
            { name: "Pending", data: pendingData },
            { name: "Delivered", data: deliveredData },
            { name: "Cancelled", data: cancelledData },
          ],
          options: {
            ...this.state.areaChartData.options,
            xaxis: {
              ...this.state.areaChartData.options.xaxis,
              categories: periods,
            },
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  handlePeriodChange = (event) => {
    this.setState({ period: event.target.value }, this.fetchStats);
  };

  handleDateChange = (field) => (date) => {
    this.setState({ [field]: date }, this.fetchStats);
  };

  render() {
    const { period, startDate, endDate } = this.state;

    return (
      <div>
        {/* Controls for Period and Date Range */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            Period:
            <select value={period} onChange={this.handlePeriodChange}>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>
          <label style={{ marginLeft: "20px" }}>
            Start Date:
            <input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) =>
                this.handleDateChange("startDate")(new Date(e.target.value))
              }
            />
          </label>
          <label style={{ marginLeft: "20px" }}>
            End Date:
            <input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) =>
                this.handleDateChange("endDate")(new Date(e.target.value))
              }
            />
          </label>
        </div>

        {/* Radial Bar Chart */}
        <div id="radial-bar-chart">
          <ReactApexChart
            options={this.state.radialBarData.options}
            series={this.state.radialBarData.series}
            type="radialBar"
            height={this.props.height || 300}
          />
        </div>

        {/* Area Chart */}
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
