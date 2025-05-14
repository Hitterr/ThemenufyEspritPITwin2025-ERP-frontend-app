import React, { useEffect, useState } from "react";
import wasteStore from "../../store/wasteStore";
import ChartDonught3 from "../../components/Sego/Home/donught";
import {
  FaTrashAlt,
  FaDollarSign,
  FaWeight,
  FaFilter,
  FaUndo,
  FaPizzaSlice,
  FaPercentage,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../utils/apiRequest";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useRestaurantQuery, useStocksQuery } from "../storage/utils/queries";
import { authStore } from "./../../store/authStore";
const Waste = () => {
  const {
    wasteSummary,
    wastePercentage,
    filterCriteria,
    setFilterCriteria,
    resetFilters,
    fetchWasteSummary,
    fetchWastePercentage,
    isLoading,
    error,
  } = wasteStore();
  const { data: restaurants, isLoading: loadingRestaurants } =
    useRestaurantQuery();
  const { currentUser } = authStore();
  const { data: stocks, isLoading: loadingStocks } = useStocksQuery();
  const [restaurantName, setRestaurantName] = useState("");

  // Fetch both summary and percentage data when restaurantId changes
  useEffect(() => {
    fetchWasteSummary();
    fetchWastePercentage();
  }, [filterCriteria, fetchWasteSummary, fetchWastePercentage]);

  const handleRestaurantChange = (e) => {
    const selectedName = e.target.value;
    setRestaurantName(selectedName);
    const selectedRestaurant = restaurants.find(
      (r) => r.nameRes === selectedName
    );
    setFilterCriteria({
      ...filterCriteria,
      restaurantId: selectedRestaurant?._id || "",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({
      ...filterCriteria,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filterCriteria.restaurantId) {
      fetchWasteSummary();
      fetchWastePercentage();
    }
  };

  const handleReset = () => {
    setRestaurantName("");
    resetFilters();
  };

  const icons = {
    totalItems: <FaTrashAlt size={30} color="#EA7A9A" />,
    totalCost: <FaDollarSign size={30} color="#EA7A9A" />,
    totalQuantity: <FaWeight size={30} color="#EA7A9A" />,
    stockType: <FaPizzaSlice size={30} color="#EA7A9A" />,
    wastePercentage: <FaPercentage size={30} color="#EA7A9A" />,
  };

  // Cards configuration for summary view with percentage data
  const cards = [
    {
      title: "Stock Type",
      value: wasteSummary[0]?.libelle || "N/A",
      icon: icons.stockType,
    },
    {
      title: "Total Waste Quantity",
      value: wasteSummary[0]?.totalWaste?.toLocaleString() || "0",
      icon: icons.totalQuantity,
    },
    {
      title: "Total Waste Cost",
      value: `$${wasteSummary[0]?.totalCost?.toLocaleString() || "0"}`,
      icon: icons.totalCost,
    },
    {
      title: "Global Waste Percentage",
      value: `${(wastePercentage?.summary?.globalWastePercentage || 0).toFixed(
        2
      )}%`,
      icon: icons.wastePercentage,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="card mb-4" style={{ borderColor: "#F6B4AF" }}>
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#EA7A9A", color: "white" }}
        >
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter Options
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <Form.Group className="col-md-3">
                <Form.Label htmlFor="restaurantName" className="form-label">
                  Restaurant Name
                </Form.Label>
                {loadingRestaurants ? (
                  <div className="form-control">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Loading restaurants...</span>
                  </div>
                ) : (
                  <Form.Control
                    as="select"
                    id="restaurantName"
                    name="restaurantName"
                    className="form-select"
                    value={restaurantName}
                    defaultValue={currentUser.user.restaurant._id}
                    onChange={handleRestaurantChange}
                  >
                    <option
                      key={currentUser.user.restaurant._id}
                      value={currentUser.user.restaurant.nameRes}
                    >
                      {currentUser.user.restaurant.nameRes}
                    </option>
                  </Form.Control>
                )}
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label htmlFor="startDate" className="form-label">
                  Start Date
                </Form.Label>
                <Form.Control
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-control"
                  value={filterCriteria.startDate || "01/01/2000"}
                  defaultValue={"01/01/2000"}
                  onChange={handleFilterChange}
                />
              </Form.Group>
              <Form.Group className="col-md-3">
                <Form.Label htmlFor="endDate" className="form-label">
                  End Date
                </Form.Label>
                <Form.Control
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-control"
                  value={filterCriteria.endDate || ""}
                  onChange={handleFilterChange}
                  min={filterCriteria.startDate}
                />
              </Form.Group>
              <div className="col-md-3 d-flex align-items-end gap-2">
                <Button
                  type="submit"
                  className="btn flex-grow-1"
                  style={{
                    backgroundColor: "#EA7A9A",
                    borderColor: "#EA7A9A",
                    color: "white",
                  }}
                  disabled={isLoading || !filterCriteria.restaurantId}
                >
                  {isLoading ? "Applying..." : "Apply Filters"}
                </Button>
                <Button
                  type="button"
                  variant="secondary-outline"
                  onClick={handleReset}
                  title="Reset all filters"
                  style={{ borderColor: "#EA7A9A", color: "#EA7A9A" }}
                >
                  <FaUndo />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div
            className="spinner-border"
            style={{ color: "#EA7A9A" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <div className="flex-grow-1">{error}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => wasteStore.setState({ error: null })}
            aria-label="Close"
          />
        </div>
      )}

      <Row className="">
        {cards.map((card, index) => (
          <Col key={index} xs={10} sm={5} lg={4}>
            <div
              className="card"
              style={{
                background: `linear-gradient(135deg, #EA7A9A 0%, #F6B4AF 100%)`,
                border: "none",
                borderRadius: "0.5rem",
                boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
              }}
            >
              <div className="card-body">
                <div className="media align-items-center">
                  <div className="media-body me-2">
                    <h2 className="text-white font-w600">{card.value}</h2>
                    <span className="text-white">{card.title}</span>
                    {card.subText && (
                      <p className="text-white mb-0 small">{card.subText}</p>
                    )}
                  </div>
                  <div className="d-inline-block position-relative donut-chart-sale">
                    <ChartDonught3
                      backgroundColor="#FFFFFF"
                      backgroundColor2="#F6B4AF"
                      height="100"
                      width="100"
                      value={
                        card.value.includes("%")
                          ? parseFloat(card.value) || 0
                          : 0
                      }
                    />
                    <small className="text-white">{card.icon}</small>
                    <span className="circle bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Waste;
