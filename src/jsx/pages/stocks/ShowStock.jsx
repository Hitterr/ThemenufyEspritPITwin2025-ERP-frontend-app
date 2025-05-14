import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useStockStore from "../../store/stockStore";
import { FaPencilAlt } from "react-icons/fa";
import { MoveLeft } from "lucide-react";
import EditStock from "./EditStock";
import PriceForecasting from "./PriceForecasting";
import StockVolatility from "./StockVolatility";
import { authStore } from "../../store/authStore";

const ShowStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = authStore();
  const {
    getStockById,
    stocks,
    fetchSuppliersForStock,
    suppliersComparison,
    fetchError,
    clearSuppliersComparison,
  } = useStockStore();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuppliers, setShowSuppliers] = useState(false);

  useEffect(() => {
    loadStock();
  }, [id, stocks]);

  const loadStock = () => {
    const data = stocks.find((ing) => ing._id === id);
    if (data) {
      setStock(data);
    } else {
      navigate("/stock");
    }
    setLoading(false);
  };

  const handleFetchSuppliers = async () => {
    if (!showSuppliers) {
      clearSuppliersComparison();
      await fetchSuppliersForStock(id);
    }
    setShowSuppliers((prev) => !prev); // Toggle visibility
  };

  // Check if stock is close to minQty (within 10% or equal/less)
  const isLowStockWarning =
    stock && stock.quantity <= stock.minQty * 1.1 && stock.quantity > 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stock) {
    return <div>Stock not found</div>;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">{stock.libelle} Details</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Basic Information</h5>
              <hr />
              <div className="mb-3">
                <strong>Name:</strong> {stock.libelle}
              </div>
              <div className="mb-3">
                <strong>Type:</strong> {stock?.type?.name || "-"}
              </div>
              <div className="mb-3">
                <strong>Price:</strong> ${stock.price}
              </div>
              <div className="mb-3">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    stock.disponibility ? "badge-success" : "badge-danger"
                  }`}
                >
                  {stock.disponibility ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Quantity Management</h5>
              <hr />
              <div className="mb-3">
                <strong>Current Quantity:</strong> {stock.quantity} {stock.unit}
              </div>
              <div className="mb-3">
                <strong>Inventory:</strong> {stock.inventory} {stock.unit}
              </div>
              <div className="mb-3">
                <strong>Minimum Quantity:</strong> {stock.minQty} {stock.unit}
              </div>
              <div className="mb-3">
                <strong>Maximum Quantity:</strong> {stock.maxQty} {stock.unit}
              </div>
              <div className="mb-3">
                <span
                  className={`badge ${
                    stock.quantity > stock.minQty
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {stock.quantity > stock.minQty ? "Stock OK" : "Low Stock"}
                </span>
                {isLowStockWarning && (
                  <span className="badge badge-warning ms-2">
                    Warning: Approaching Minimum Quantity
                  </span>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <h5 className="text-primary">Price Prediction & Volatility</h5>
          <hr />
          <Col lg={3} sm={4} xs={6}>
            <PriceForecasting
              stockId={stock._id}
              restaurantId={currentUser?.user?.restaurant._id}
            />
          </Col>
          <Col lg={3} sm={4} xs={6}>
            <StockVolatility
              stockId={stock._id}
              restaurantId={currentUser?.user?.restaurant._id}
            />
          </Col>
        </Row>
        {/* Supplier Comparison Section */}
        <Row className="mt-4">
          <Col>
            <div className="mb-4">
              <h5 className="text-primary">Supplier Comparison</h5>
              <hr />
              <Button
                variant="primary"
                onClick={handleFetchSuppliers}
                className="mb-3"
              >
                {showSuppliers ? "Hide Suppliers" : "Show Suppliers"}
              </Button>
              {fetchError && (
                <div className="alert alert-danger" role="alert">
                  {fetchError}
                </div>
              )}
              {showSuppliers &&
                suppliersComparison.length === 0 &&
                !fetchError && (
                  <div className="alert alert-info" role="alert">
                    No active suppliers found for this stock.
                  </div>
                )}
              {showSuppliers && suppliersComparison.length > 0 && (
                <div className="table-responsive">
                  <Table className="table-hover">
                    <thead>
                      <tr>
                        <th>Supplier Name</th>
                        <th>Email</th>
                        <th>Price/Unit</th>
                        <th>Lead Time (Days)</th>
                        <th>MOQ</th>
                        <th>Quality Score</th>
                        <th>Composite Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliersComparison.map((supplier, index) => (
                        <tr key={index}>
                          <td>{supplier.supplierName}</td>
                          <td>{supplier.supplierEmail}</td>
                          <td>${supplier.pricePerUnit.toFixed(2)}</td>
                          <td>{supplier.leadTimeDays}</td>
                          <td>{supplier.moq}</td>
                          <td>{supplier.qualityScore}</td>
                          <td>{supplier.compositeScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mt-4 row justify-content-start">
          <Col lg={2} sm={4} xs={6}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => navigate("/stock")}
            >
              <MoveLeft size={20} />
            </Button>
          </Col>
          <Col lg={2} sm={4} xs={6}>
            <EditStock idIng={id} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ShowStock;
