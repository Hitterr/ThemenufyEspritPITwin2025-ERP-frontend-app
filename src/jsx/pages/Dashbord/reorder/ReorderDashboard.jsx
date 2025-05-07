import React, { useEffect } from 'react';
import { Card, Col, Form, Row, Alert } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import useReorderStore from '../../../store/useReorderStore';

const ReorderDashboard = () => {
  const {
    reorderData,
    consumptionData,
    forecastData,
    stocks,
    restaurants,
    supplierName,
    loading,
    error,
    fetchStocks,
    fetchRestaurants,
    fetchReorderRecommendation,
    fetchConsumptionData,
    fetchForecastData,
    clearReorderData,
  } = useReorderStore();

  const [stockId, setStockId] = React.useState('');
  const [restaurantId, setRestaurantId] = React.useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    console.log('Restaurant changed to:', restaurantId || 'None');
    setStockId(''); // Reset stockId immediately
    clearReorderData(); // Clear all reorder-related data
    if (restaurantId) {
      fetchStocks(restaurantId);
    } else {
      fetchStocks(''); // Clear stocks for no restaurant
    }
  }, [restaurantId, fetchStocks, clearReorderData]);

  // Ensure stockId is valid when stocks change
  useEffect(() => {
    if (stockId && !stocks.find((stock) => stock._id === stockId)) {
      console.log('Resetting stockId: Current stockId', stockId, 'not found in stocks:', stocks.map(s => s._id));
      setStockId('');
      clearReorderData();
    }
  }, [stocks, stockId, clearReorderData]);

  useEffect(() => {
    if (stockId && restaurantId && stocks.find((stock) => stock._id === stockId)) {
      console.log('Triggering API calls for stockId:', stockId, 'restaurantId:', restaurantId);
      fetchReorderRecommendation(stockId, restaurantId);
      fetchConsumptionData(stockId, restaurantId);
      fetchForecastData(stockId, restaurantId);
    } else if (!stockId) {
      clearReorderData();
    }
  }, [stockId, restaurantId, stocks, fetchReorderRecommendation, fetchConsumptionData, fetchForecastData, clearReorderData]);

  // Debug logging to verify stocks in dropdown
  useEffect(() => {
    console.log('Current state - restaurantId:', restaurantId || 'None');
    console.log('Stocks for dropdown:', stocks.length > 0 ? stocks.map((stock) => ({
      _id: stock._id,
      libelle: stock.libelle,
      restaurant: stock.restaurant,
    })) : 'No stocks available');
    console.log('Selected stockId:', stockId || 'None');
  }, [restaurantId, stocks, stockId]);

  // Prepare data for ApexCharts
  const allDates = [
    ...new Set([
      ...consumptionData.map((c) => c.ds),
      ...forecastData.map((f) => f.ds),
    ]),
  ].sort((a, b) => new Date(a) - new Date(b));

  const consumptionSeries = allDates.map((date) => {
    const consumptionEntry = consumptionData.find((c) => c.ds === date);
    return consumptionEntry ? consumptionEntry.y : null;
  });

  const forecastSeries = allDates.map((date) => {
    const forecastEntry = forecastData.find((f) => f.ds === date);
    return forecastEntry ? forecastEntry.yhat : null;
  });

  const chartOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [4, 4],
      colors: ['#f53c79', '#82ca9d'],
      curve: 'straight',
    },
    xaxis: {
      type: 'datetime',
      categories: allDates,
      labels: {
        formatter: (value) => new Date(value).toLocaleDateString(),
      },
    },
    colors: ['#f53c79', '#82ca9d'],
    markers: {
      size: [6, 6],
      strokeWidth: [4, 4],
      strokeColors: ['#f53c79', '#82ca9d'],
      border: 0,
      colors: ['#fff', '#fff'],
      hover: {
        size: 10,
      },
    },
    yaxis: {
      title: {
        text: 'Quantity',
      },
      labels: {
        formatter: (value) => (value !== null ? value.toFixed(2) : 'N/A'),
      },
    },
    tooltip: {
      x: {
        formatter: (value) => new Date(value).toLocaleDateString(),
      },
      y: {
        formatter: (value) => (value !== null ? value.toFixed(2) : 'N/A'),
      },
    },
    legend: {
      position: 'top',
    },
  };

  const chartSeries = [
    {
      name: 'Consumption',
      data: consumptionSeries,
    },
    {
      name: 'Forecast',
      data: forecastSeries,
    },
  ];

  return (
    <Card className="p-5">
      <h2>Reorder Optimization</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <p>Loading...</p>}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Restaurant</Form.Label>
            <Form.Select
              value={restaurantId}
              onChange={(e) => {
                console.log('Selecting restaurant:', e.target.value);
                setRestaurantId(e.target.value);
              }}
              disabled={loading || !Array.isArray(restaurants) || restaurants.length === 0}
            >
              <option value="">Select a restaurant</option>
              {Array.isArray(restaurants) &&
                restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.nameRes}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Select Stock</Form.Label>
            <Form.Select
              value={stockId}
              onChange={(e) => {
                console.log('Stock selected:', e.target.value);
                setStockId(e.target.value);
              }}
              disabled={loading || !restaurantId || !Array.isArray(stocks) || stocks.length === 0}
            >
              <option value="">Select a stock</option>
              {Array.isArray(stocks) &&
                stocks.map((stock) => (
                  <option key={stock._id} value={stock._id}>
                    {stock.libelle}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {reorderData && (
        <div className="mb-4">
          <h4>Reorder Recommendation for {reorderData.stock}</h4>
          {reorderData.alert && <Alert variant="warning">{reorderData.alert}</Alert>}
          <p><strong>Order Date:</strong> {new Date(reorderData.order_date).toLocaleDateString()}</p>
          <p><strong>Quantity:</strong> {reorderData.quantity} {reorderData.unit}</p>
          <p>
            <strong>Supplier Name:</strong>{' '}
            {loading ? 'Loading...' : (supplierName || 'Unknown Supplier')}
          </p>
        </div>
      )}
      {(consumptionData.length > 0 || forecastData.length > 0) && (
        <div>
          <h4>Consumption and Forecast</h4>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={350}
          />
        </div>
      )}
    </Card>
  );
};

export default ReorderDashboard;