import React, { useState, useEffect, useCallback } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import ForecastControls from "./ForecastControls";
import ForecastTable from "./ForecastTable";
import ForecastHeatmap from "./ForecastHeatmap";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

const aggregateByWeek = (predictions, stock, fetchedPrice) => {
  const weekMap = new Map();
  predictions.forEach(({ ds, yhat }) => {
    const date = new Date(ds);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = weekStart.toISOString().split("T")[0];
    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, { predicted: 0 });
    }
    weekMap.get(weekKey).predicted += Number(yhat);
  });

  const weeklyData = [];
  let remainingStock = stock;
  weekMap.forEach((week, weekKey) => {
    const predictedQty = Number(week.predicted.toFixed(2));
    remainingStock -= predictedQty;
    const missingQty = Number(Math.max(0, -remainingStock).toFixed(2));
    const quantityToOrder = missingQty;

    const estimatedCost = Number((quantityToOrder * fetchedPrice).toFixed(2));
    const varianceVsStock = Number((stock - predictedQty).toFixed(2));

    weeklyData.push({
      week: weekKey,
      predictedQty,
      missingQty,
      quantityToOrder,
      estimatedCost,
      varianceVsStock,
      isUrgent: quantityToOrder > stock * 0.5,
    });
  });

  return weeklyData;
};

const WeeklyPurchaseForecast = () => {
  const [stocks, setStocks] = useState([]);
  const [stockId, setStockId] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [currentStock, setCurrentStock] = useState(0);
  const [unit, setUnit] = useState("units");
  const [price, setPrice] = useState("prices");

  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [weeks, setWeeks] = useState(3);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/stock/getStocksInConsumptionHistory",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const stockData = data.data || [];
        setStocks(stockData);
        if (stockData.length > 0) setStockId(stockData[0]._id);
      } catch (error) {
        console.error("Error loading stocks:", error);
      }
    };
    loadStocks();
  }, []);

  const fetchPredictions = useCallback(async () => {
    if (!stockId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const days = weeks * 7;
      const startDate = new Date().toISOString().split("T")[0];
      const { data } = await axios.post(
        import.meta.env.VITE_FLASK_BACKEND_URL + "/predict/consumption",
        { stockId, days, startDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const stock = data.currentStock || 0;
        const fetchedUnit = data.unit || "units";
        const fetchedPrice = data.price || "price";

        setCurrentStock(stock);
        setUnit(fetchedUnit);
        setPrice(fetchedPrice);
        setWeeklyData(aggregateByWeek(data.predictions, stock, fetchedPrice));
      } else {
        console.error("Error in prediction:", data.error);
      }
    } catch (err) {
      console.error("Error during prediction:", err);
    } finally {
      setLoading(false);
    }
  }, [stockId, weeks]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Weekly Purchase Forecast</h2>

      <Card className="p-3 mb-4 bg-light border-0 shadow-sm">
        <h5 className="mb-2">📊 Weekly Purchase Forecast Dashboard</h5>
        <p className="text-muted mb-2">
          This section displays purchase forecasts for the upcoming weeks.
        </p>
      </Card>

      <ForecastControls
        stocks={stocks}
        stockId={stockId}
        setStockId={setStockId}
        weeks={weeks}
        setWeeks={setWeeks}
        loading={loading}
        fetchPredictions={fetchPredictions}
        viewMode={viewMode}
        setViewMode={setViewMode}
        className="mb-4"
      />

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : weeklyData.length === 0 ? (
        <p className="mt-4 text-center text-muted">No data available.</p>
      ) : (
        <div className="mt-4">
          {viewMode === "table" ? (
            <ForecastTable weeklyData={weeklyData} unit={unit} />
          ) : (
            <ForecastHeatmap
              weeklyData={weeklyData}
              currentStock={currentStock}
              formatDate={formatDate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyPurchaseForecast;
