import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup, Spinner, Card, Badge, Row, Col } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import SummaryCards from "./SummaryCards";

const AIIngredientForecast = () => {
  const [ingredients, setIngredients] = useState([]);
  const [ingredientId, setIngredientId] = useState("");
  const [days, setDays] = useState(7);
  const [predictions, setPredictions] = useState([]);
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ingredient");
        setIngredients(res.data.data || []);
        if (res.data.data.length > 0) {
          setIngredientId(res.data.data[0]._id);
        }
      } catch (error) {
        console.error("Error loading ingredients:", error);
      }
    };
    loadIngredients();
  }, []);

  const handleForecast = async () => {
    if (!ingredientId || days < 1) return alert("Enter valid input");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/predict", {
        ingredientId,
        days,
      });

      const stockRes = await axios.get(`http://localhost:5000/api/ingredient/${ingredientId}`);
      const currentStock = stockRes.data?.data?.quantity || 0;
      setStock(currentStock);

      const enriched = res.data.predictions.map((p) => ({
        ...p,
        yhat: Number(p.yhat.toFixed(2)),
        missingQty: Math.max(0, Number(p.yhat.toFixed(2)) - currentStock),
      }));

      setPredictions(enriched);
    } catch (err) {
      console.error("Error during prediction:", err);
    }
    setLoading(false);
  };

  const totalMissing = predictions.reduce((sum, p) => sum + p.missingQty, 0);
  const totalForecasted = predictions.reduce((sum, p) => sum + p.yhat, 0);

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: true },
    },
    xaxis: {
      categories: predictions.map((p) => new Date(p.ds).toLocaleDateString()),
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(2),
        style: { colors: "#3e4954", fontSize: "13px" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(2),
      style: { fontSize: "12px", colors: ["#fff"] },
    },
    fill: {
      colors: ["#EA7A9A", "#D45BFF"],
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(2)} units`,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    legend: { position: "bottom" },
  };

  const chartSeries = [
    {
      name: "Predicted Quantity",
      data: predictions.map((p) => p.yhat),
    },
    {
      name: "Missing Quantity",
      data: predictions.map((p) => p.missingQty),
    },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">AI Ingredient Forecast</h2>

      <Card className="p-3 mb-4 bg-light border-0 shadow-sm">
  <h5 className="mb-2">🧾 What does this chart show?</h5>
  <p className="text-muted mb-2">
    This forecast estimates how much of the selected ingredient you'll need over the next{" "}
    <strong>{days}</strong> days based on historical consumption.
  </p>
  <div className="d-flex align-items-center gap-3">
    <span style={{ backgroundColor: "#EA7A9A", color: "white", padding: "5px 10px", borderRadius: "10px", fontSize: "0.85rem" }}>
    Forecast
    </span>
    <span style={{ backgroundColor: "#D45BFF", color: "white", padding: "5px 10px", borderRadius: "10px", fontSize: "0.85rem" }}>
    Missing
    </span>
  </div>
</Card>


      <Card className="p-4 mb-4 shadow-sm">
        <Row className="align-items-center g-3">
          <Col md={6}>
            <Form.Select value={ingredientId} onChange={(e) => setIngredientId(e.target.value)}>
              {ingredients.map((ingredient) => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.libelle}
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
            <Button variant="primary" onClick={handleForecast} disabled={loading} className="w-100">
              {loading ? "Forecasting..." : "Generate Forecast"}
            </Button>
          </Col>
        </Row>
       
      </Card>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : predictions.length === 0 ? (
        <p className="text-center text-muted">No forecast available.</p>
      ) : (
        <>
          {totalMissing > 0 && (
            <div className="alert alert-warning text-center fw-semibold">
              ⚠️ Low Stock Alert: You’re missing <strong>{totalMissing.toFixed(2)} units</strong> to meet the forecasted demand.
            </div>
          )}
          <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
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
