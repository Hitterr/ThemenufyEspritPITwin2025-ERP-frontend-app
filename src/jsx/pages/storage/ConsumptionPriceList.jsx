import React, { useEffect, useState, useMemo } from "react";
import {Card,Form, Button,Alert,Spinner,InputGroup,Row,Col,Badge,ButtonGroup,OverlayTrigger,Tooltip,} from "react-bootstrap";
import {FaSearch,FaTimesCircle,FaDollarSign,FaChartLine,FaFilter,FaStore,FaCalendarAlt, FaCarrot,FaBoxes} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
import Swal from "sweetalert2";
import "animate.css";
import usePriceHistoryStore from "../../store/usePriceHistoryStore";
import BarChart6 from "../../../jsx/components/charts/Chartjs/bar6";

const PriceHistoryList = ({ restaurantId = "" }) => {
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [days, setDays] = useState(30);

  const {priceHistories,dailyPriceTrends,filterCriteria,isLoading,error,setFilterCriteria,resetFilters,fetchPriceHistories,fetchDailyPriceTrends,
  } = usePriceHistoryStore();

  const itemsPerPage = 10;
  const displayedPrices = priceHistories.slice(0, page * itemsPerPage);
  const hasMore = priceHistories.length > displayedPrices.length;

  // Calcul des statistiques
  const stats = useMemo(() => {
    if (priceHistories.length === 0) {
      return {
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        priceChange: 0,
        totalRecords: 0,
      };
    }

    const prices = priceHistories.map((p) => p.price);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calcul de la variation de prix (dernier prix - premier prix)
    const sortedByDate = [...priceHistories].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const priceChange =
      sortedByDate.length > 1
        ? sortedByDate[sortedByDate.length - 1].price - sortedByDate[0].price
        : 0;

    return {
      averagePrice: averagePrice.toFixed(2),minPrice: minPrice.toFixed(2),maxPrice: maxPrice.toFixed(2),
      priceChange: priceChange.toFixed(2),totalRecords: priceHistories.length,
    };
  }, [priceHistories]);

  const handleChange = (e) => {setFilterCriteria({ [e.target.name]: e.target.value });};

  const handleClearInput = (field) => {if (field === "restaurantId" && restaurantId) return;setFilterCriteria({ [field]: "" });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    setFilterCriteria({
      restaurantId: restaurantId || filterCriteria.restaurantId,
      ingredientId: filterCriteria.ingredientId,
      supplierId: filterCriteria.supplierId,
    });
  };

  const handleReset = () => {
    resetFilters();
    setPage(1);
    setDays(30);
    setShowChart(false);
    Swal.fire({
      icon: "success",
      title: "Filters Cleared!",
      timer: 1500,
      showConfirmButton: false,
    });
  };
  useEffect(() => {
    fetchPriceHistories();
  }, [fetchPriceHistories, restaurantId]);



  return (
    <div className="container-fluid px-3 py-3">
      <Card className="border-0 shadow-sm">
        
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
                      <Form.Control
                        type="text"
                        name="restaurantId"
                        value={filterCriteria.restaurantId}
                        onChange={handleChange}
                        size="sm"
                        disabled={!!restaurantId}
                        aria-describedby="restaurantIdHelp"
                      />
                      {filterCriteria.restaurantId && !restaurantId && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleClearInput("restaurantId")}
                          aria-label="Clear restaurant ID"
                        >
                          <FaTimesCircle />
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
                      <Form.Control
                        type="text"
                        name="ingredientId"
                        value={filterCriteria.ingredientId}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Enter ingredient ID"
                        aria-describedby="ingredientIdHelp"
                      />
                      {filterCriteria.ingredientId && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleClearInput("ingredientId")}
                          aria-label="Clear ingredient ID"
                        >
                          <FaTimesCircle />
                        </Button>
                      )}
                    </InputGroup>
                  
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">
                      <FaBoxes className="me-1 text-muted" /> Supplier ID
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="supplierId"
                        value={filterCriteria.supplierId}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Enter supplier ID (optional)"
                        aria-describedby="supplierIdHelp"
                      />
                      {filterCriteria.supplierId && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleClearInput("supplierId")}
                          aria-label="Clear supplier ID"
                        >
                          <FaTimesCircle />
                        </Button>
                      )}
                    </InputGroup>
                  
                  </Form.Group>
                </Col>
                {showChart && (
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-bold">
                        <FaCalendarAlt className="me-1 text-muted" /> Days to show
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={days}
                        onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 30))}
                        min="1"
                        max="365"
                        size="sm"
                        aria-describedby="daysHelp"
                      />
                   
                    </Form.Group>
                  </Col>
                )}
                <Col xs={12} className="d-flex justify-content-end gap-2 mt-2">
                  <Button
                    variant="outline-secondary"
                    onClick={handleReset}
                    size="sm"
                    aria-label="Reset filters"
                  >
                    <FaTimesCircle className="me-1" /> Reset
                  </Button>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Apply filters to refresh data</Tooltip>}
                  >
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}
                      size="sm"
                      aria-label="Apply filters"
                    >
                      {isLoading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-1"
                        />
                      ) : (
                        <FaSearch className="me-1" />
                      )}
                      Apply Filters
                    </Button>
                  </OverlayTrigger>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        )}

        {/* Section des statistiques */}
        {priceHistories.length > 0 && (
          <Card.Body className="border-bottom bg-light py-3">
            <h5 className="mb-3 d-flex align-items-center">
              <FaChartLine className="text-primary me-2" /> Statistics
            </h5>
            <Row className="g-3">
              <Col xs={6} md={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <FaDollarSign className="text-success me-2" />
                      <div>
                        <small className="text-muted">Average Price</small>
                        <h6 className="mb-0">${stats.averagePrice}</h6>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <FaDollarSign className="text-danger me-2" />
                      <div>
                        <small className="text-muted">Min Price</small>
                        <h6 className="mb-0">${stats.minPrice}</h6>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <FaDollarSign className="text-warning me-2" />
                      <div>
                        <small className="text-muted">Max Price</small>
                        <h6 className="mb-0">${stats.maxPrice}</h6>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={6} md={3}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <MdTrendingUp
                        className={`me-2 ${
                          stats.priceChange >= 0 ? "text-success" : "text-danger"
                        }`}
                      />
                      <div>
                        <small className="text-muted">Price Change</small>
                        <h6 className="mb-0">
                          {stats.priceChange >= 0 ? "+" : "-"}${Math.abs(stats.priceChange)}
                        </h6>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        )}

        <Card.Body className="py-2 px-4">
          {error && (
            <Alert
              variant="danger"
              className="animate__animated animate__fadeIn mb-3"
            >
              <strong>Error:</strong> {error}
            </Alert>
          )}
          {isLoading && priceHistories.length === 0 && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading price history...</p>
            </div>
          )}
          {!isLoading && priceHistories.length === 0 && !error && (
            <Alert variant="info" className="text-center mb-0">
              No price records found. Try adjusting your filters.
            </Alert>
          )}
        </Card.Body>

        {showChart && (
          <Card.Body className="border-bottom">
            {isLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading chart data...</p>
              </div>
            ) : dailyPriceTrends.length > 0 ? (
              <>
                <h5 className="mb-3">Price Trend Chart</h5>
                <div style={{ position: "relative", height: "400px", width: "100%" }}>
                  <BarChart6 dailyPriceTrends={dailyPriceTrends} />
                </div>
              </>
            ) : (
              <Alert variant="info" className="text-center">
                No trend data available for the selected ingredient and period. Please ensure valid ingredient and restaurant IDs are provided.
              </Alert>
            )}
          </Card.Body>
        )}

        {!isLoading && priceHistories.length > 0 && (
          <div className="table-responsive">
            <table
              className="table table-hover align-middle mb-0"
              aria-label="Price history table"
            >
              <thead className="bg-light">
                <tr>
                  <th className="ps-4" style={{ width: "20%" }}>
                    <div className="d-flex align-items-center">
                      <FaStore className="text-primary me-2" /> Restaurant
                    </div>
                  </th>
                  <th style={{ width: "20%" }}>
                    <div className="d-flex align-items-center">
                      <FaCarrot className="text-success me-2" /> Ingredient
                    </div>
                  </th>
                  <th style={{ width: "20%" }}>
                    <div className="d-flex align-items-center">
                      <FaBoxes className="text-warning me-2" /> Supplier
                    </div>
                  </th>
                  <th style={{ width: "15%" }}>
                    <div className="d-flex align-items-center">
                      <FaDollarSign className="text-danger me-2" /> Price
                    </div>
                  </th>
                  <th style={{ width: "15%" }}>
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="text-info me-2" /> Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedPrices.map((price) => (
                  <tr key={price._id} className="hover-bg-light">
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="icon-shape icon-sm bg-primary bg-opacity-10 text-primary rounded-circle me-3">
                          <FaStore />
                        </div>
                        <div>
                          <h6
                            className="mb-0 text-truncate"
                            style={{ maxWidth: "150px" }}
                          >
                            {price.restaurantId?.nameRes || "Unknown"}
                          </h6>
                          <small className="text-muted">
                            ID: {price.restaurantId?._id || "N/A"}
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
                          <h6
                            className="mb-0 text-truncate"
                            style={{ maxWidth: "150px" }}
                          >
                            {price.ingredientId?.libelle || "Unknown"}
                          </h6>
                          <small className="text-muted">
                            {price.ingredientId?.category || "N/A"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="icon-shape icon-sm bg-warning bg-opacity-10 text-warning rounded-circle me-3">
                          <FaBoxes />
                        </div>
                        <div>
                          <h6
                            className="mb-0 text-truncate"
                            style={{ maxWidth: "150px" }}
                          >
                            {price.supplierId?.name || "Unknown"}
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold text-success">
                          ${price.price.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold">
                          {new Date(price.createdAt).toLocaleDateString()}
                        </span>
                        <small className="text-muted">
                          {new Date(price.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PriceHistoryList;