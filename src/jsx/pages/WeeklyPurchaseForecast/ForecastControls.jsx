import { Row, Col, Button, Form } from "react-bootstrap";
import StockSelector from "./StockSelector";

const ForecastControls = ({
  stocks,
  stockId,
  setStockId,
  weeks,
  setWeeks,
  loading,
  fetchPredictions,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="p-3 bg-light rounded shadow-sm">
      <Row className="g-3 align-items-center">
        <Col md={5}>
          <StockSelector
            stocks={stocks}
            stockId={stockId}
            setStockId={setStockId}
          />
        </Col>

        <Col md={3} className="d-flex flex-column justify-content-end h-100">
  <Form.Group controlId="weeksInput" className="w-100">
    <Form.Control
      type="number"
      min="1"
      value={weeks}
      onChange={(e) =>
        setWeeks(Math.max(1, parseInt(e.target.value) || 1))
      }
      style={{ height: "38px" }}
    />
  </Form.Group>
</Col>


        <Col md={3}>
          <Button
            variant="primary"
            onClick={fetchPredictions}
            disabled={loading}
            className="w-100"
          >
            {loading ? "Loading..." : "Generate Forecast"}
          </Button>
        </Col>

        
      </Row>
      <Row className="g-3 align-items-center">
    





        <Col className="mt-4"  md={3}>
          <Form.Check
            type="switch"
            id="view-mode-switch"
            label={
              viewMode === "table" ? "Switch to Heatmap" : "Switch to Table"
            }
            checked={viewMode === "heatmap"}
            onChange={() =>
              setViewMode(viewMode === "table" ? "heatmap" : "table")
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default ForecastControls;
