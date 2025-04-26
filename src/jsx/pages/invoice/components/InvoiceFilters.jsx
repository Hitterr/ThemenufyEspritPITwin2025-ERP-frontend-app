import { Form, Row, Col, Card, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import useInvoiceStore from "../../../store/invoiceStore";

const InvoiceFilters = ({ onClose }) => {
  const { filterCriteria, setFilterCriteria, resetFilters } = useInvoiceStore();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ [name]: value }); // Updates the filter criteria based on the input name
  };

  const handleReset = () => {
    resetFilters(); // Resets the filter criteria in the store
    onClose(); // Closes the filter panel
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between mb-3">
          <h5 className="mb-0">Filters</h5>
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="me-2"
              onClick={handleReset}
            >
              <FaTimes className="me-1" /> Reset
            </Button>
            <Button variant="light" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <Row>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Search by Invoice Number</Form.Label>
              <Form.Control
                type="text"
                name="invoiceNumber"
                value={filterCriteria.invoiceNumber || ""}
                onChange={handleFilterChange}
                placeholder="Search by invoice number..."
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={filterCriteria.status || "all"}
                onChange={handleFilterChange}
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
