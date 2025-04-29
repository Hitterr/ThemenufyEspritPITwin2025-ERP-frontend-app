import { Form, Row, Col, Card, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import useIngredientStore from "../../../store/ingredientStore";
import { apiRequest } from "../../../utils/apiRequest";
import { useEffect, useState } from "react";
const IngredientFilters = ({ onClose }) => {
  const [types, setTypes] = useState([]);
  const { filterCriteria, setFilterCriteria, resetFilters } =
    useIngredientStore();
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ [name]: value });
  };
  const handleReset = () => {
    resetFilters();
    onClose();
  };
  const fetchTypes = async () => {
    apiRequest
      .get("/categories")
      .then((response) => {
        const fetchedTypes = response.data.data;
        setTypes(fetchedTypes);
      })
      .catch((error) => {
        console.error("Error fetching types:", error);
      });
  };
  useEffect(() => {
    fetchTypes();
  }, []);
  return (
    <Card className="my-3 w-100 z" as={Col} xs={12}>
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
        <Row className="">
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={filterCriteria.search}
                onChange={handleFilterChange}
                placeholder="Search by name or type..."
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={filterCriteria.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {types.map((type) => {
                  return (
                    <option key={type._id} value={type.name}>
                      {type.name}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Availability</Form.Label>
              <Form.Control
                as="select"
                name="availability"
                value={filterCriteria.availability}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                type="number"
                name="minPrice"
                value={filterCriteria.minPrice}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                type="number"
                name="maxPrice"
                value={filterCriteria.maxPrice}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default IngredientFilters;
