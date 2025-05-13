import { Form, Row, Col, Card, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import useInvoiceStore from "../../../store/invoiceStore";

const InvoiceFilters = ({ onClose }) => {
  const { filterCriteria, setFilterCriteria, resetFilters } = useInvoiceStore();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ [name]: value });
  };

  const handleReset = () => {
    resetFilters();
    onClose();
  };

  return (
    <Card
      className="mb-3 mx-auto shadow"
      style={{
        width: "600px",
        maxWidth: "100%",
        borderRadius: "15px",
        border: "1px solid #F47F72",
      }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between mb-4 align-items-center">
          <h5 className="mb-0" style={{ color: "#F47F72" }}>
            Filters
          </h5>
          <Button
            style={{
              backgroundColor: "#2E2E6A",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0",
            }}
            onClick={handleReset}
          >
            <FaTimes color="white" />
          </Button>
        </div>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#F47F72" }}>
                Invoice Number
              </Form.Label>
              <Form.Control
                type="text"
                name="invoiceNumber"
                value={filterCriteria.invoiceNumber || ""}
                onChange={handleFilterChange}
                placeholder="Search by invoice number..."
                style={{
                  border: "1px solid #F47F72",
                  borderRadius: "8px",
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: "#F47F72" }}>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={filterCriteria.status || "all"}
                onChange={handleFilterChange}
                style={{
                  border: "1px solid #F47F72",
                  borderRadius: "8px",
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default InvoiceFilters;
