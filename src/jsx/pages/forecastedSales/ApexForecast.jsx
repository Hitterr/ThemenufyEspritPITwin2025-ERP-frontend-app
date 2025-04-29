import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import ForecastFilters from "./ForecastFilters";
import ForecastChart from "./ForecastChart";

const ApexForecast = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputDays, setInputDays] = useState(7);
  const [days, setDays] = useState(7);
  const [selectedIngredient, setSelectedIngredient] = useState("");

  useEffect(() => {
    loadForecast(days);
  }, [days]);

  const loadForecast = async (daysToLoad) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/ingredients/forecast-auto/auto?days=${daysToLoad}`);
      setForecastData(res.data.data);
    } catch (error) {
      console.error("Error loading forecast:", error);
    }
    setLoading(false);
  };

  const handleApply = () => {
    if (!inputDays || inputDays < 1) {
      alert("Please enter a valid number of days.");
      return;
    }
    setDays(inputDays);
  };

  const filteredData = selectedIngredient
    ? forecastData.filter(item => item.ingredient === selectedIngredient)
    : forecastData;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center align-items-center mb-3">
        <h2>Ingredient Forecast</h2>
      </div>

      <ForecastFilters
        inputDays={inputDays}
        setInputDays={setInputDays}
        handleApply={handleApply}
        forecastData={forecastData}
        selectedIngredient={selectedIngredient}
        setSelectedIngredient={setSelectedIngredient}
      />

      {filteredData.length === 0 ? (
        <div className="text-center text-muted">
          <i className="fas fa-box-open" style={{ fontSize: "50px", marginBottom: "10px" }}></i><br />
          No forecast data available.
        </div>
      ) : (
        <ForecastChart filteredData={filteredData} />
      )}
    </div>
  );
};

export default ApexForecast;
