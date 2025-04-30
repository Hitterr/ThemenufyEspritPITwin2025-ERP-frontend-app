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

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  // Fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoadingRestaurants(true);
        const mockRestaurants = [
          { _id: "67f3f0c563b6aae2e5036438", nameRes: "Le Petit Bistro" },
          { _id: "67f3f0c563b6aae2e5036439", nameRes: "Sushi Master" },
          { _id: "67f3f0c563b6aae2e503643a", nameRes: "Pizza Paradise" },
        ];
        setRestaurants(mockRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      } finally {
        setLoadingRestaurants(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Fetch both summary and percentage data when restaurantId changes
  useEffect(() => {
    if (filterCriteria.restaurantId) {
      fetchWasteSummary();
      fetchWastePercentage();
    }
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
    ingredientType: <FaPizzaSlice size={30} color="#EA7A9A" />,
    wastePercentage: <FaPercentage size={30} color="#EA7A9A" />,
  };

  // Cards configuration for summary view with percentage data
  const cards = [
    {
      title: "Ingredient Type",
      value: wasteSummary[0]?.libelle || "N/A",
      icon: icons.ingredientType,
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
              <div className="col-md-3">
                <label htmlFor="restaurantName" className="form-label">
                  Restaurant Name
                </label>
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
                  <select
                    id="restaurantName"
                    name="restaurantName"
                    className="form-select"
                    value={restaurantName}
                    onChange={handleRestaurantChange}
                  >
                    <option value="">Select a restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant.nameRes}>
                        {restaurant.nameRes}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="col-md-3">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-control"
                  value={filterCriteria.startDate || ""}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-control"
                  value={filterCriteria.endDate || ""}
                  onChange={handleFilterChange}
                  min={filterCriteria.startDate}
                />
              </div>
              <div className="col-md-3 d-flex align-items-end gap-2">
                <button
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
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  title="Reset all filters"
                  style={{ borderColor: "#EA7A9A", color: "#EA7A9A" }}
                >
                  <FaUndo />
                </button>
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

      <div className="row">
        {cards.map((card, index) => (
          <div key={index} className="col-xl-3 col-xxl-6 col-sm-6">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Waste;
