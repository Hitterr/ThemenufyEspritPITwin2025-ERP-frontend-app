import { useState, useEffect } from "react";
import { Button, Modal, Spinner, Badge } from "react-bootstrap";

export default function StockVolatility({ stockId, restaurantId }) {
  const [show, setShow] = useState(false);
  const [volatilityData, setVolatilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVolatility = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${
          import.meta.env.VITE_FLASK_BACKEND_URL
        }/stock/volatility?stockId=${stockId}&restaurantId=${restaurantId}`
      );

      if (!response.ok) throw new Error("Volatility check failed");
      const data = await response.json();
      setVolatilityData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to get volatility data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchVolatility();
  }, [show]);

  const getVolatilityClassColor = () => {
    if (!volatilityData) return "secondary";
    switch (volatilityData.volatility_class.toLowerCase()) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Button variant="warning" onClick={() => setShow(true)} className="ms-2">
        Volatility Check
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Price Volatility Analysis</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Analyzing volatility...</p>
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}

          {volatilityData && (
            <div className="text-center">
              <h5>
                <Badge bg={getVolatilityClassColor()} className="mb-3">
                  {volatilityData.volatility_class.toUpperCase()} VOLATILITY
                </Badge>
              </h5>
              <p className="mb-1">
                Confidence Level: {(volatilityData.confidence * 100).toFixed(1)}
                %
              </p>
              <small className="text-muted">
                Based on historical price data analysis
              </small>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
