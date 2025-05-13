import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import useInvoiceStore from "../../../store/invoiceStore";
import { format } from "date-fns";
import { Dropdown } from "react-bootstrap";

class InvoiceStats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      period: "month",
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(),
      statusCounts: {
        pending: 0,
        delivered: 0,
        cancelled: 0,
      },
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
      error: null, // For error handling
    };

    // Refs to manage focus
    this.startDateInputRef = React.createRef();
    this.endDateInputRef = React.createRef();
  }

  componentDidMount() {
    this.fetchStats();
  }

  fetchStats = async () => {
    const { period, startDate, endDate } = this.state;
    const fetchInvoiceStats = useInvoiceStore.getState().fetchInvoiceStats;

    try {
      if (
        !startDate ||
        !endDate ||
        isNaN(startDate.getTime()) ||
        isNaN(endDate.getTime())
      ) {
        throw new Error("Invalid date range");
      }

      await fetchInvoiceStats({ period, startDate, endDate });
      const invoiceStats = useInvoiceStore.getState().invoiceStats.data;

      if (!invoiceStats) {
        throw new Error("No data returned from stats API");
      }

      const statusCounts = {
        pending: invoiceStats.statusCounts.pending || 0,
        delivered: invoiceStats.statusCounts.delivered || 0,
        cancelled: invoiceStats.statusCounts.cancelled || 0,
      };

      const periods = invoiceStats.periodCounts.map((item) => {
        switch (period) {
          case "week":
            return `Week ${item.period}`;
          case "month":
            return format(new Date(2023, item.period - 1, 1), "MMM");
          case "year":
            return item.period.toString();
          case "day":
            const date = new Date(item.period);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid date value for period: ${item.period}`);
              return "Invalid Date"; // Fallback
            }
            return format(date, "yyyy-MM-dd");
          default:
            return "Unknown Period";
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
        statusCounts,
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
        error: null,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      const errorMessage = error.message.includes("Invalid time value")
        ? "Invalid date format in statistics data"
        : error.message || "Failed to fetch statistics";
      this.setState({ error: errorMessage });
    }
  };

  handlePeriodChange = (newPeriod) => {
    this.setState({ period: newPeriod.toLowerCase() }, () => {
      this.fetchStats();
    });
  };

  handleDateChange = (field) => (event) => {
    const date = new Date(event.target.value);
    if (!isNaN(date)) {
      this.setState({ [field]: date }, () => {
        this.fetchStats();
      });
    }
  };

  handleDateFocus = (field) => () => {
    if (field === "startDate" && this.startDateInputRef.current) {
      this.startDateInputRef.current.focus();
    } else if (field === "endDate" && this.endDateInputRef.current) {
      this.endDateInputRef.current.focus();
    }
  };

  render() {
    const { period, startDate, endDate, statusCounts, error } = this.state;

    return (
      <div>
        {/* Controls for Period and Date Range */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <Dropdown className="dropdown mt-sm-0 mt-3">
            <Dropdown.Toggle
              type="button"
              className="btn btn-primary light dropdown-toggle"
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Dropdown.Toggle>
            <Dropdown.Menu
              className="dropdown-menu dropdown-menu-right"
              align="end"
            >
              <Dropdown.Item onClick={() => this.handlePeriodChange("month")}>
                Month
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.handlePeriodChange("day")}>
                Day
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.handlePeriodChange("week")}>
                Week
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.handlePeriodChange("year")}>
                Year
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <div className="input-group">
            <label className="input-group-text bg-primary text-white">
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={this.handleDateChange("startDate")}
              onFocus={this.handleDateFocus("startDate")}
              ref={this.startDateInputRef}
            />
          </div>

          <div className="input-group">
            <label className="input-group-text bg-primary text-white">
              End Date
            </label>
            <input
              type="date"
              className="form-control"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={this.handleDateChange("endDate")}
              onFocus={this.handleDateFocus("endDate")}
              ref={this.endDateInputRef}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Card-Based Status Counts */}
        <div className="row">
          {/* Pending Card */}
          <div className="col-xl-3 col-xxl-4 col-lg-6 col-sm-6 mb-3">
            <div className="widget-stat card bg-warning">
              <div className="card-body p-4">
                <div className="media">
                  <span className="me-3">
                    <i className="la la-hourglass-start"></i>
                  </span>
                  <div className="media-body text-white">
                    <p className="mb-1">Pending</p>
                    <h3 className="text-white">{statusCounts.pending}</h3>
                    <div className="progress mb-2 bg-primary">
                      <div
                        className="progress-bar progress-animated bg-light"
                        style={{
                          width: `${Math.min(statusCounts.pending * 10, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivered Card */}
          <div className="col-xl-3 col-xxl-4 col-lg-6 col-sm-6 mb-3">
            <div className="widget-stat card bg-success">
              <div className="card-body p-4">
                <div className="media">
                  <span className="me-3">
                    <i className="la la-check-circle"></i>
                  </span>
                  <div className="media-body text-white">
                    <p className="mb-1">Delivered</p>
                    <h3 className="text-white">{statusCounts.delivered}</h3>
                    <div className="progress mb-2 bg-primary">
                      <div
                        className="progress-bar progress-animated bg-light"
                        style={{
                          width: `${Math.min(
                            statusCounts.delivered * 10,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cancelled Card */}
          <div className="col-xl-3 col-xxl-4 col-lg-6 col-sm-6 mb-3">
            <div className="widget-stat card bg-danger">
              <div className="card-body p-4">
                <div className="media">
                  <span className="me-3">
                    <i className="la la-times-circle"></i>
                  </span>
                  <div className="media-body text-white">
                    <p className="mb-1">Cancelled</p>
                    <h3 className="text-white">{statusCounts.cancelled}</h3>
                    <div className="progress mb-2 bg-primary">
                      <div
                        className="progress-bar progress-animated bg-light"
                        style={{
                          width: `${Math.min(
                            statusCounts.cancelled * 10,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart */}
        <div id="area-chart" style={{ marginTop: "20px" }}>
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
