import { Card, Row, Col, Button } from "react-bootstrap";

const BulkUpdateStatsStep = ({ bulkUpdateStats, onPrev, onBack }) => (
  <section>
    <Row className="g-3">
      <Col lg={2} sm={6}>
        <Card style={{ background: "linear-gradient(to right, #FF7A7A, #FFC07A)" }}>
          <Card.Body>
            <div className="media align-items-center">
              <div className="media-body me-2">
                <h2 className="text-white font-w600">{bulkUpdateStats.updatedCount}</h2>
                <span className="text-white">Ingredients Updated</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={2} sm={6}>
        <Card style={{ background: "linear-gradient(to right, #FF7A7A, #FFC07A)" }}>
          <Card.Body>
            <div className="media align-items-center">
              <div className="media-body me-2">
                <h2 className="text-white font-w600">{bulkUpdateStats.avgPriceAfterUpdate}</h2>
                <span className="text-white">Avg Price per Unit</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={2} sm={6}>
        <Card style={{ background: "linear-gradient(to right, #FF7A7A, #FFC07A)" }}>
          <Card.Body>
            <div className="media align-items-center">
              <div className="media-body me-2">
                <h2 className="text-white font-w600">{bulkUpdateStats.avgLeadTimeAfterUpdate}</h2>
                <span className="text-white">Avg Lead Time (Days)</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={2} sm={6}>
        <Card style={{ background: "linear-gradient(to right, #FF7A7A, #FFC07A)" }}>
          <Card.Body>
            <div className="media align-items-center">
              <div className="media-body me-2">
                <h2 className="text-white font-w600">{bulkUpdateStats.totalPriceChange}</h2>
                <span className="text-white">Total Price Change</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={2} sm={6}>
        <Card style={{ background: "linear-gradient(to right, #FF7A7A, #FFC07A)" }}>
          <Card.Body>
            <div className="media align-items-center">
              <div className="media-body me-2">
                <h2 className="text-white font-w600">{bulkUpdateStats.totalLeadTimeChange}</h2>
                <span className="text-white">Total Lead Time Change</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <div className="text-end toolbar toolbar-bottom p-2">
      <Button className="btn btn-secondary sw-btn-prev me-1" onClick={onPrev}>
        Prev
      </Button>
      <Button className="btn btn-primary sw-btn-next ms-1" onClick={onBack}>
        Back to Linked Ingredients
      </Button>
    </div>
  </section>
);

export default BulkUpdateStatsStep;