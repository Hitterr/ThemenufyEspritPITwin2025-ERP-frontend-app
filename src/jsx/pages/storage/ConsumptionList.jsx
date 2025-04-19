import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, Form, Button, Alert, Spinner, InputGroup, Row, Col, Badge, ButtonGroup } from "react-bootstrap";
import { FaSearch, FaTimesCircle, FaUtensils, FaCarrot, FaTimes, FaFilter, FaStore, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import Swal from "sweetalert2";
import "animate.css";
import useConsumptionHistoryStore from "../../store/useConsumptionHistoryStore";

  const ConsumptionList = () => {
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showChart, setShowChart] = useState(false);
  const {consumptions, filterCriteria, setFilterCriteria, resetFilters, isLoading, error, fetchConsumptions} = useConsumptionHistoryStore();
  const itemsPerPage = 10;
  const displayedConsumptions = consumptions.slice(0, page * itemsPerPage);
  const hasMore = consumptions.length > displayedConsumptions.length;
  const chartData = useMemo(() => {
  const consumptionByDate = consumptions.reduce((acc, curr) => {
  const date = new Date(curr.createdAt).toLocaleDateString();acc[date] = (acc[date] || 0) + curr.qty;return acc;}, {});
  const dates = Object.keys(consumptionByDate).sort();
  const quantities = dates.map(date => consumptionByDate[date]);

    return {
      series: [{name: "Total Consumption", data: quantities}],
      options: {chart: {type: 'area',height: 350,toolbar: {show: true,tools: {download: true,selection: true,pan: true,reset: true}}},
        colors: ['#3a86ff'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
        type: 'gradient',gradient: {shadeIntensity: 1,opacityFrom: 0.7,opacityTo: 0.3,stops: [0, 90, 100]}},
        xaxis: {categories: dates,labels: {formatter: function(value) {return value;}}},
        yaxis: {title: { text: "Quantity Consumed" },labels: { formatter: (val) => val.toFixed(0) }},
        tooltip: {y: { formatter: (val) => `${val} units` }}}
    };}, [consumptions]);
   const handleChange = (e) => {setFilterCriteria({ [e.target.name]: e.target.value });};
    const handleDateChange = (e) => {const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };
  const handleClearInput = (field) => {setFilterCriteria({ [field]: "" });};
  const handleFilter = (e) => {e.preventDefault();setPage(1);
    fetchConsumptions({...filterCriteria,...(dateRange.start && { startDate: dateRange.start }),...(dateRange.end && { endDate: dateRange.end })});
  };
  const handleReset = () => {
    resetFilters();setDateRange({ start: "", end: "" });setPage(1);
    Swal.fire({icon: "success",title: "Filters Cleared!",text: "All filters have been reset.",timer: 1500,showConfirmButton: false,
    animation: true,customClass: { popup: "animate__animated animate__zoomIn" },});};
  const handleLoadMore = () => {setPage(prev => prev + 1);};
  useEffect(() => {fetchConsumptions();}, [fetchConsumptions]);

  return (
    <div className="container-fluid px-3 py-3">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom-0 py-3">
          <Row className="align-items-center">
            <Col>
              <h2 className="h5 mb-0 d-flex align-items-center">
                <MdOutlineInventory2 className="text-primary me-2" />
                Consumption History
                {consumptions.length > 0 && (
                  <Badge pill bg="light" text="dark" className="ms-2">{consumptions.length} records</Badge>
                )}
              </h2>
            </Col>
            <Col xs="auto">
              <ButtonGroup>
                <Button variant={showFilters ? "outline-primary" : "primary"} size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <FaFilter className="me-1" /> {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
                <Button variant={showChart ? "primary" : "outline-primary"} size="sm" onClick={() => setShowChart(!showChart)}>
                  <FaChartLine className="me-1" /> {showChart ? 'Hide' : 'Show'} Chart
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card.Header>
        {showFilters && (
          <Card.Body className="border-bottom bg-light">
            <Form onSubmit={handleFilter}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">
                      <FaStore className="me-1 text-muted" /> Restaurant ID
                    </Form.Label>
                    <InputGroup>
                      <Form.Control type="text" name="restaurantId" value={filterCriteria.restaurantId || ""} onChange={handleChange} size="sm"/>
                      {filterCriteria.restaurantId && (
                        <Button variant="outline-secondary" size="sm" onClick={() => handleClearInput("restaurantId")}>
                          <FaTimes />
                        </Button>
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">
                      <FaCarrot className="me-1 text-muted" /> Ingredient ID
                    </Form.Label>
                    <InputGroup>
                      <Form.Control type="text" name="ingredientId" value={filterCriteria.ingredientId || ""} onChange={handleChange} size="sm"/>
                      {filterCriteria.ingredientId && (
                        <Button variant="outline-secondary" size="sm" onClick={() => handleClearInput("ingredientId")}>
                          <FaTimes />
                        </Button>
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>
                 <Col xs={12} className="d-flex justify-content-end gap-2 mt-2">
                  <Button variant="outline-secondary" onClick={handleReset} size="sm">
                    <FaTimesCircle className="me-1" /> Reset
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading} size="sm">
                    {isLoading ? <Spinner as="span" animation="border" size="sm" className="me-1" /> : <FaSearch className="me-1" />}
                    Apply Filters
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        )}
        <Card.Body className="py-2 px-4">
          {error && (
            <Alert variant="danger" className="animate__animated animate__fadeIn mb-3">
              <strong>Error:</strong> {error}
            </Alert>
          )}
          {isLoading && consumptions.length === 0 && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading consumptions...</p>
            </div>
          )}
       {!isLoading && consumptions.length === 0 && !error && (
            <Alert variant="info" className="text-center mb-0">
              No consumption records found. Try adjusting your filters.
            </Alert>
          )}
        </Card.Body>
       {showChart && !isLoading && consumptions.length > 0 && (
          <Card.Body className="border-bottom">
            <ReactApexChart options={chartData.options} series={chartData.series}type="area" height={350}/>
          </Card.Body>
        )}
       {!isLoading && consumptions.length > 0 && (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4" style={{ width: '30%' }}>
                    <div className="d-flex align-items-center">
                      <FaStore className="text-primary me-2" /> Restaurant
                    </div>
                  </th>
                  <th style={{ width: '30%' }}>
                    <div className="d-flex align-items-center">
                      <FaCarrot className="text-success me-2" /> Ingredient
                    </div>
                  </th>
                  <th style={{ width: '20%' }}>Quantity</th>
                  <th style={{ width: '20%' }}>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="text-info me-2" /> Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedConsumptions.map((consumption) => (
                  <tr key={consumption._id} className="hover-bg-light">
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="icon-shape icon-sm bg-primary bg-opacity-10 text-primary rounded-circle me-3">
                          <FaStore />
                        </div>
                        <div>
                          <h6 className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                            {consumption.restaurantId?.nameRes || "Unknown"}
                          </h6>
                          <small className="text-muted">
                            ID: {consumption.restaurantId?._id || "N/A"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="icon-shape icon-sm bg-success bg-opacity-10 text-success rounded-circle me-3">
                          <FaCarrot />
                        </div>
                        <div>
                          <h6 className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                            {consumption.ingredientId?.libelle || "Unknown"}
                          </h6>
                          <small className="text-muted">
                            {consumption.ingredientId?.category || "N/A"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                          <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${Math.min(100, consumption.qty)}%` }} />
                        </div>
                        <span className="fw-bold">
                          {consumption.qty} {consumption.ingredientId?.unit || 'units'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold">
                          {new Date(consumption.createdAt).toLocaleDateString()}
                        </span>
                        <small className="text-muted">
                          {new Date(consumption.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
       {hasMore && (
          <div className="text-center mt-3 mb-3">
            <Button variant="outline-primary" onClick={handleLoadMore} disabled={isLoading}>
              {isLoading && <Spinner as="span" animation="border" size="sm" className="me-2" />}
              Load More ({consumptions.length - displayedConsumptions.length} remaining)
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConsumptionList;