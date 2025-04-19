import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import ConsumptionForm from "./ConsumptionForm";
import ConsumptionList from "./ConsumptionList";
import useConsumptionHistoryStore from "../../store/useConsumptionHistoryStore";

const App = () => {
  const restaurantId = "";
  const { fetchConsumptions } = useConsumptionHistoryStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchConsumptions();
  }, [fetchConsumptions]);

  return (
    <div className="container-fluid py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2">Consumption Dashboard</h1>
        </Col>
        <Col className="text-end">
          <Button 
            variant="success" 
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus className="me-1" /> Add Consumption
          </Button>
        </Col>
      </Row>
 {showForm && (
        <Card className="mb-4">
          <Card.Body>
            <ConsumptionForm 
              onSuccess={() => {
                setShowForm(false);
                fetchConsumptions();
              }} 
              onCancel={() => setShowForm(false)}
            />
          </Card.Body>
        </Card>
      )}
     <Card>
        <Card.Body>
          <ConsumptionList />
        </Card.Body>
      </Card>
       </div>
  );
};

export default App;