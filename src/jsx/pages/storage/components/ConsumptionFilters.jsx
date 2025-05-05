import React from 'react';
import { Form, Button, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { FaStore, FaCarrot, FaUtensils, FaTimes, FaTimesCircle, FaSearch } from 'react-icons/fa';

const ConsumptionFilters = ({ 
  filterCriteria, 
  restaurants, 
  stocks, 
  isLoading, 
  onFilter, 
  onChange, 
  onReset, 
  onClearInput 
}) => {
  return (
    <Form onSubmit={onFilter}>
      <Row className="g-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small fw-bold">
              <FaStore className="me-1 text-muted" /> Restaurant
            </Form.Label>
            <InputGroup>
              <Form.Select
                name="restaurantId"
                value={filterCriteria.restaurantId}
                onChange={onChange}
              >
                <option value="">Select Restaurant</option>
                {restaurants?.map(restaurant => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.nameRes}
                  </option>
                ))}
              </Form.Select>
              {filterCriteria.restaurantId && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onClearInput("restaurantId")}
                >
                  <FaTimes />
                </Button>
              )}
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small fw-bold">
              <FaCarrot className="me-1 text-muted" /> Stock Item
            </Form.Label>
            <InputGroup>
              <Form.Select
                name="stockId"
                value={filterCriteria.stockId}
                onChange={onChange}
              >
                <option value="">Select Stock</option>
                {stocks?.map(stock => (
                  <option key={stock._id} value={stock._id}>
                    {stock.libelle}
                  </option>
                ))}
              </Form.Select>
              {filterCriteria.stockId && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onClearInput("stockId")}
                >
                  <FaTimes />
                </Button>
              )}
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label className="small fw-bold">
              <FaUtensils className="me-1 text-muted" /> Order ID
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="ordreId"
                value={filterCriteria.ordreId}
                onChange={onChange}
                placeholder="Enter Order ID"
              />
              {filterCriteria.ordreId && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onClearInput("ordreId")}
                >
                  <FaTimes />
                </Button>
              )}
            </InputGroup>
          </Form.Group>
        </Col>

        <Col xs={12} className="d-flex justify-content-end gap-2">
          <Button variant="outline-secondary" onClick={onReset} size="sm">
            <FaTimesCircle className="me-1" /> Reset
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading} size="sm">
            {isLoading ? (
              <Spinner as="span" animation="border" size="sm" className="me-1" />
            ) : (
              <FaSearch className="me-1" />
            )}
            Apply Filters
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ConsumptionFilters;