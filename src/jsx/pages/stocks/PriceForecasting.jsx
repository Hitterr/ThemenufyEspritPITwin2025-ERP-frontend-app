import { useState, useEffect } from "react";
import { Button, Modal, Spinner, Row, Col, Form } from "react-bootstrap";

export default function PriceForecasting({ stockId, restaurantId }) {
  const [show, setShow] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputDays, setInputDays] = useState(30);
  const [days, setDays] = useState(30);

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${
          import.meta.env.VITE_FLASK_BACKEND_URL
        }/stock/predict?stockId=${stockId}&restaurantId=${restaurantId}&days=${days}`
      );

      if (!response.ok) throw new Error("Prediction failed");
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || "Failed to get price prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (inputDays < 1) {
      setError("Please enter a valid number of days (at least 1).");
      return;
    }
    setError("");
    setDays(inputDays);
  };

  useEffect(() => {
    if (show) fetchPrediction();
  }, [show, days]);

  return (
    <>
      <Button variant="info" onClick={() => setShow(true)}>
        Price Forecast
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Price Forecast</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="daysInput">
                <Form.Label>Forecast Days</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={inputDays}
                  onChange={(e) =>
                    setInputDays(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleApply}>
                Apply
              </Button>
            </Col>
          </Row>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Generating forecast...</p>
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          {prediction && (
            <Row>
              <Col md={6}>
                <p>
                  <strong>Predicted Price:</strong> $
                  {prediction.predicted_price}
                </p>
                <p>
                  <strong>Confidence:</strong> {prediction.confidence}%
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>
                    Prediction Date:{" "}
                    {new Date(prediction.predicted_date).toLocaleDateString()}
                  </strong>
                </p>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
