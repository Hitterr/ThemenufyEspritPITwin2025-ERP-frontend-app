// src/pages/Waste/Waste.js

import React, { useEffect } from "react";
import wasteStore from "../../store/wasteStore";
import ChartDonught3 from "../../components/Sego/Home/donught";
import { FaTrashAlt, FaDollarSign, FaWeight, FaTags, FaFilter, FaUndo , FaPizzaSlice } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Waste = () => {
  const {
    wasteSummary,
    filterCriteria,
    setFilterCriteria,
    resetFilters,
    fetchWasteSummary,
    isLoading,
    error,
  } = wasteStore();

  useEffect(() => {
    fetchWasteSummary();
  }, [fetchWasteSummary]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWasteSummary();
  };

  const icons = {
    totalItems: <FaTrashAlt size={30} color="#EA7A9A" />,
    totalCost: <FaDollarSign size={30} color="#EA7A9A" />,
    totalQuantity: <FaWeight size={30} color="#EA7A9A" />,
    uniqueCategories: <FaTags size={30} color="#EA7A9A" />,
    ingredientType: <FaPizzaSlice size={30} color="#EA7A9A" />,
  };

  const cards = [

    {
        title: "ingredient type",
        value: `${wasteSummary[0]?.libelle?.toLocaleString() || 0}`,
        icon: icons.ingredientType,
      
      },

    {
      title: "Total Waste Quantity",
      value: `${wasteSummary[0]?.totalWaste?.toLocaleString() || 0}`,
      icon: icons.totalQuantity,
    },

  

    {
      title: "Total Waste Cost",
      value: `$${wasteSummary[0]?.totalCost?.toLocaleString() || 0}`,
      icon: icons.totalCost,
    },
  ];

  return (
    <div className="container-fluid">
      {/* Filtres améliorés */}
      <div className="card mb-4" style={{ borderColor: '#F6B4AF' }}>
        <div className="card-header" style={{ backgroundColor: '#EA7A9A', color: 'white' }}>
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filter Options
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label htmlFor="restaurantId" className="form-label">
                  Restaurant ID
                </label>
                <input
                  type="text"
                  id="restaurantId"
                  name="restaurantId"
                  className="form-control"
                  placeholder="Enter restaurant ID"
                  value={filterCriteria.restaurantId || ""}
                  onChange={handleFilterChange}
                />
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
                  style={{ backgroundColor: '#EA7A9A', borderColor: '#EA7A9A', color: 'white' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Applying...' : 'Apply Filters'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={resetFilters}
                  title="Reset all filters"
                  style={{ borderColor: '#EA7A9A', color: '#EA7A9A' }}
                >
                  <FaUndo />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="spinner-border" style={{ color: '#EA7A9A' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <div className="flex-grow-1">{error}</div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => wasteStore.setState({ error: null })}
            aria-label="Close"
          />
        </div>
      )}

      {/* Cards */}
      <div className="row">
        {cards.map((card, index) => (
          <div key={index} className="col-xl-3 col-xxl-6 col-sm-6">
            <div className="card" style={{ 
              background: `linear-gradient(135deg, #EA7A9A 0%, #F6B4AF 100%)`,
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <div className="card-body">
                <div className="media align-items-center">
                  <div className="media-body me-2">
                    <h2 className="text-white font-w600">{card.value}</h2>
                    <span className="text-white">{card.title}</span>
                  </div>
                  <div className="d-inline-block position-relative donut-chart-sale">
                    <ChartDonught3
                      backgroundColor="#FFFFFF"
                      backgroundColor2="#F6B4AF"
                      height="100"
                      width="100"
                      value={card.percentage}
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