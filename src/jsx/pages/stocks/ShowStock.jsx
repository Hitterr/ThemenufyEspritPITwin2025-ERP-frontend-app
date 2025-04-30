import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useStockStore from "../../store/stockStore";
import { FaPencilAlt } from "react-icons/fa";
import { MoveLeft } from "lucide-react";
import EditStock from "./EditStock";
const ShowStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStockById, stocks } = useStockStore();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
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
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4 row justify-content-start ">
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
