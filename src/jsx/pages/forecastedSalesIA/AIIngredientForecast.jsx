import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Card, Row, Col } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import SummaryCards from "./SummaryCards";

const AIIngredientForecast = () => {
  const [stocks, setStocks] = useState([]);
  const [stockId, setStockId] = useState("");
  const [days, setDays] = useState(7);
  const [predictions, setPredictions] = useState([]);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalMissing, setTotalMissing] = useState(0);
  const [chartType, setChartType] = useState("bar");
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const itemsPerPage = 7; // Nombre de jours par page

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/stock/getStocksInConsumptionHistory", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStocks(res.data.data || []);
        if (res.data.data.length > 0) setStockId(res.data.data[0]._id);
      } catch (error) {
        console.error("Error loading stocks:", error);
      }
    };
    loadStocks();
  }, []);

  const handleForecast = async () => {
    if (!stockId || days < 1) return alert("Enter valid input");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/predict",
        { stockId, days },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const currentStock = res.data.currentStock || 0;
        setStock(currentStock);
        setTotalMissing(res.data.missingQty);

        // Calculate cumulative demand and missing quantity per day
        let remainingStock = currentStock;
        const enriched = res.data.predictions.map((p) => {
          const yhat = Number(p.yhat.toFixed(2));
          remainingStock -= yhat;
          const missingQty = Math.max(0, -remainingStock);
          return {
            ...p,
            yhat,
            missingQty: Number(missingQty.toFixed(2)),
          };
        });

        setPredictions(enriched);
        setCurrentPage(1); // Réinitialiser à la première page après une nouvelle prévision
      } else {
        console.error("Error in prediction:", res.data.error);
      }
    } catch (err) {
      console.error("Error during prediction:", err);
    }
    setLoading(false);
  };

  const totalForecasted = predictions.reduce((sum, p) => sum + p.yhat, 0);

  // Calculer les données à afficher pour la page actuelle
  const totalPages = Math.ceil(predictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPredictions = predictions.slice(startIndex, endIndex);

  const chartOptions = {
    chart: {
      type: chartType,
      toolbar: { show: true },
    },
    xaxis: {
      categories: paginatedPredictions.map((p) => new Date(p.ds).toLocaleDateString()),
      labels: {
        rotate: -45,
        style: { fontSize: "10px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(2),
        style: { colors: "#3e4954", fontSize: "13px" },
      },
    },
    dataLabels: {
      enabled: chartType === "bar",
      formatter: (val) => val.toFixed(2),
      style: { fontSize: "10px", colors: ["#fff"] },
    },
    fill: {
      colors: ["#EA7A9A", "#D45BFF"],
      opacity: 1,
    },
    stroke: { curve: "smooth", width: 2 }, // Smooth line for line chart
    tooltip: {
      x: { format: "dd/MM/yyyy" },
      y: { formatter: (val) => `${val.toFixed(2)} units` },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%", // Largeur des barres ajustée pour moins de jours
        endingShape: "rounded",
      },
    },
    legend: { position: "bottom" },
  };

  const chartSeries = [
    { name: "Predicted Quantity", data: paginatedPredictions.map((p) => p.yhat) },
    { name: "Missing Quantity", data: paginatedPredictions.map((p) => p.missingQty) },
  ];

  // Fonctions pour naviguer entre les pages
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">AI Stock Forecast</h2>

      <Card className="p-3 mb-4 bg-light border-0 shadow-sm">
        <h5 className="mb-2">🧾 What does this chart show?</h5>
        <p className="text-muted mb-2">
          This forecast estimates how much of the selected stock you'll need over the next{" "}
          <strong>{days}</strong> days based on historical consumption.
        </p>
        <div className="d-flex align-items-center gap-3">
          <span
            style={{
              backgroundColor: "#EA7A9A",
              color: "white",
              padding: "5px 10px",
              borderRadius: "10px",
              fontSize: "0.85rem",
            }}
          >
            Forecast
          </span>
          <span
            style={{
              backgroundColor: "#D45BFF",
              color: "white",
              padding: "5px 10px",
              borderRadius: "10px",
              fontSize: "0.85rem",
            }}
          >
            Missing
          </span>
        </div>
      </Card>

      <Card className="p-4 mb-4 shadow-sm">
        <Row className="align-items-center g-3">
          <Col md={6}>
            <Form.Select value={stockId} onChange={(e) => setStockId(e.target.value)}>
              {stocks.map((stock) => (
                <option key={stock._id} value={stock._id}>
                  {stock.libelle}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              placeholder="Days"
              value={days}
              min="1"
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </Col>
          <Col md={3}>
            <Button
              variant="primary"
              onClick={handleForecast}
              disabled={loading}
              className="w-100"
            >
              {loading ? "Forecasting..." : "Generate Forecast"}
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Form.Check
              type="switch"
              id="chart-type-switch"
              label={chartType === "bar" ? "Switch to Line Chart" : "Switch to Bar Chart"}
              checked={chartType === "line"}
              onChange={() => setChartType(chartType === "bar" ? "line" : "bar")}
            />
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : predictions.length === 0 ? (
        <p className="text-center text-muted">No forecast available.</p>
      ) : (
        <>
          {stock >= totalForecasted ? (
            <div className="alert alert-success text-center fw-semibold">
              ✅ Stock is sufficient! You have{" "}
              <strong>{(stock - totalForecasted).toFixed(2)} units</strong> more than
              needed.
            </div>
          ) : (
            <div className="alert alert-warning text-center fw-semibold">
              ⚠️ Low Stock Alert: You’re missing{" "}
              <strong>{totalMissing.toFixed(2)} units</strong> to meet the forecasted
              demand.
            </div>
          )}

          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type={chartType}
            height={350}
          />

          {/* Boutons de pagination */}
          {predictions.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="outline-primary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="mx-2"
              >
                Previous
              </Button>
              <span className="align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="mx-2"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <SummaryCards
        stock={stock}
        totalForecasted={totalForecasted}
        totalMissing={totalMissing}
      />
    </div>
  );
};

export default AIIngredientForecast;