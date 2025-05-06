import { useState } from "react";
import { Row, Col, Button, Form, Collapse } from "react-bootstrap";
import StockSelector from "./StockSelector";

const ForecastFilters = ({
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="text-end mb-3">
        <Button
          variant="outline-secondary"
          onClick={() => setOpen(!open)}
          aria-controls="forecast-filters"
          aria-expanded={open}
        >
          {open ? "Masquer les filtres" : "Afficher les filtres"}
        </Button>
      </div>

      <Collapse in={open}>
        <div id="forecast-filters">
          <div className="p-3 bg-light rounded shadow-sm mb-4">
            <Row className="g-3 align-items-center">
              <Col md={4}>
                <StockSelector stocks={stocks} stockId={stockId} setStockId={setStockId} />
              </Col>

              <Col md={2}>
                <Form.Group controlId="weeksInput">
                  <Form.Label>Nombre de semaines</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={weeks}
                    onChange={(e) =>
                      setWeeks(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Button
                  variant="danger"
                  onClick={fetchPredictions}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Chargement..." : "Générer la prévision"}
                </Button>
              </Col>

              <Col md={3}>
                <Form.Check
                  type="switch"
                  id="view-mode-switch"
                  label={
                    viewMode === "table" ? "Basculer vers Heatmap" : "Basculer vers Tableau"
                  }
                  checked={viewMode === "heatmap"}
                  onChange={() =>
                    setViewMode(viewMode === "table" ? "heatmap" : "table")
                  }
                />
              </Col>
            </Row>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default ForecastFilters;
