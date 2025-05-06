import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import useReorderStore from '../../../store/useReorderStore';

const ReorderChart = () => {
  const { consumptionData, forecastData, loading, error, fetchConsumptionData, fetchForecastData } = useReorderStore();

  useEffect(() => {
    fetchConsumptionData('671234567890123456789005', '671234567890123456789001');
    fetchForecastData('671234567890123456789005', '671234567890123456789001');
  }, [fetchConsumptionData, fetchForecastData]);

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div className="error" style={{ color: 'red' }}>Error: {error}</div>;
  }

  // Combine consumption and forecast data for charting
  const chartData = consumptionData.map((c) => ({
    date: c.ds,
    consumption: c.y,
    forecast: forecastData.find((f) => f.ds === c.ds)?.yhat || null,
  })).concat(
    forecastData
      .filter((f) => !consumptionData.some((c) => c.ds === f.ds))
      .map((f) => ({
        date: f.ds,
        consumption: null,
        forecast: f.yhat,
      }))
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="reorder-chart" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Stock Consumption and Forecast</h2>
      {chartData.length === 0 ? (
        <p>No data available for chart.</p>
      ) : (
        <LineChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis label={{ value: 'Quantity (l)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value, name) => [`${value} l`, name]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="#8884d8"
            name="Consumption"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#82ca9d"
            name="Forecast"
            connectNulls={false}
          />
        </LineChart>
      )}
    </div>
  );
};

export default ReorderChart;