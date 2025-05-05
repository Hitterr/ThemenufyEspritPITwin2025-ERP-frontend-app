import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaFilter, FaUndo } from "react-icons/fa";

const WasteFilter = ({
  restaurantName,
  setRestaurantName,
  filterCriteria,
  setFilterCriteria,
  dateError,
  setDateError,
  handleSubmit,
  handleReset,
  loadingRestaurants,
  restaurants,
  currentDate,
  isLoading,
}) => {
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filterCriteria, [name]: value };
    const today = new Date(currentDate);
    const start = updated.startDate ? new Date(updated.startDate) : null;
    const end = updated.endDate ? new Date(updated.endDate) : null;

    let errorMsg = null;
    if (start && start > today) errorMsg = "Start date cannot be in the future.";
    else if (end && end > today) errorMsg = "End date cannot be in the future.";
    else if (start && end && end < start) errorMsg = "End date cannot be before start date.";

    setDateError(errorMsg);
    setFilterCriteria(updated);
  };

  return (
    <div className="card mb-4" style={{ borderColor: "#F6B4AF" }}>
      <div className="card-header" style={{ backgroundColor: "#f58275", color: "white" }}>
        <h5 className="mb-0"><FaFilter className="me-2" /> Filter Options</h5>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3 align-items-end">
            <Form.Group as={Col} md={3}>
              <Form.Label>Restaurant Name</Form.Label>
              {loadingRestaurants ? (
                <div className="form-control">Loading restaurants...</div>
              ) : (
                <Form.Select
                value={restaurantName}
                onChange={(e) => {
                  const selected = e.target.value;
                  setRestaurantName(selected);
                  const found = restaurants.find((r) => r.nameRes === selected);
              
                  if (found && found._id) {
                    setFilterCriteria({
                      ...filterCriteria,
                      restaurantId: found._id,
                    });
                  } else {
                    setFilterCriteria({
                      ...filterCriteria,
                      restaurantId: "",
                    });
                  }
                }}
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r.nameRes}>{r.nameRes}</option>
                ))}
              </Form.Select>
              
              )}
            </Form.Group>

            <Form.Group as={Col} md={3}>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={filterCriteria.startDate || ""}
                max={currentDate}
                onChange={handleDateChange}
              />
            </Form.Group>

            <Form.Group as={Col} md={3}>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={filterCriteria.endDate || ""}
                min={filterCriteria.startDate}
                max={currentDate}
                onChange={handleDateChange}
              />
            </Form.Group>

            <Col md={3} className="d-flex gap-2">
              <Button
                type="submit"
                disabled={isLoading || !filterCriteria.restaurantId || dateError}
                style={{ backgroundColor: "#f58275", borderColor: "#EA7A9A" }}
                className="w-100"
              >
                {isLoading ? "Applying..." : "Apply Filters"}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleReset}
                title="Reset filters"
                style={{ borderColor: "#EA7A9A", color: "#EA7A9A" }}
              >
                <FaUndo />
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default WasteFilter;
