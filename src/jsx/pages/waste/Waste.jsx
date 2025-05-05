import React, { useEffect, useState } from "react";
import wasteStore from "../../store/wasteStore";
import WasteFilter from "./WasteFilter";
import WasteOverview from "./WasteOverview";
import { useRestaurantQuery, useStocksQuery } from "../storage/utils/queries";
import { Alert } from "react-bootstrap";

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

  const { data: restaurants = [], isLoading: loadingRestaurants } = useRestaurantQuery();
  const [restaurantName, setRestaurantName] = useState("");
  const [dateError, setDateError] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (filterCriteria.restaurantId && !dateError) {
      (async () => {
        await fetchWasteSummary();
        await fetchWastePercentage();
      })();
    }
  }, [filterCriteria.restaurantId, filterCriteria.startDate, filterCriteria.endDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!filterCriteria.restaurantId || dateError) return;
    fetchWasteSummary();
    fetchWastePercentage();
  };

  const handleReset = () => {
    setRestaurantName("");
    setDateError(null);
    resetFilters();
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4 text-center">Track and Analyze Restaurant Waste</h3>
      <WasteFilter
        restaurantName={restaurantName}
        setRestaurantName={setRestaurantName}
        filterCriteria={filterCriteria}
        setFilterCriteria={setFilterCriteria}
        dateError={dateError}
        setDateError={setDateError}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        loadingRestaurants={loadingRestaurants}
        restaurants={restaurants}
        currentDate={currentDate}
        isLoading={isLoading}
      />

      {dateError && <Alert variant="danger">{dateError}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!isLoading && !wasteSummary.length && (
        <Alert variant="warning">No data available for selected filters.</Alert>
      )}

      <WasteOverview wasteSummary={wasteSummary} wastePercentage={wastePercentage} />
    </div>
  );
};

export default Waste;
