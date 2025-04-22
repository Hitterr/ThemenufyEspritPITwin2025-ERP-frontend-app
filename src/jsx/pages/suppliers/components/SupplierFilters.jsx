import { Form, Row, Col, Card, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import useSupplierStore from "../../../store/supplierStore";

const SupplierFilters = ({ onClose }) => {
  const { filterCriteria, setFilterCriteria, resetFilters, fetchSuppliers } = useSupplierStore();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ [name]: value });
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await fetchSuppliers(); // Trigger search when Enter is pressed
    }
  };

  const handleReset = async () => {
    resetFilters();
    await fetchSuppliers();
    onClose();
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
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Search Suppliers</Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={filterCriteria.search || ''}
                onChange={handleFilterChange}
                onKeyPress={handleKeyPress}
                placeholder="Search by name or email..."
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={filterCriteria.status || ''}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SupplierFilters;