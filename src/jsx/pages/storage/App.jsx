// src/App.jsx
import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Nav, Tab } from "react-bootstrap";
import { FaPlus, FaChartLine, FaUtensils, FaDollarSign } from "react-icons/fa";
import ConsumptionForm from "./ConsumptionForm";
import ConsumptionList from "./ConsumptionList";
import PriceHistoryList from "./ConsumptionPriceList"
import PriceHistoryForm from"./PriceForm"
import useConsumptionHistoryStore from "../../store/useConsumptionHistoryStore";
import usePriceHistoryStore from "../../store/usePriceHistoryStore";

const App = ({ restaurantId = "" }) => {
  const { fetchConsumptions } = useConsumptionHistoryStore();
  const { fetchPriceHistories } = usePriceHistoryStore();
  const [showConsumptionForm, setShowConsumptionForm] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [activeTab, setActiveTab] = useState("consumption");

  useEffect(() => {
    fetchConsumptions(restaurantId);
    fetchPriceHistories(restaurantId);
  }, [fetchConsumptions, fetchPriceHistories, restaurantId]);

  return (
    <div className="container-fluid py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2">Restaurant Dashboard</h1>
        </Col>
        <Col className="text-end">
          {activeTab === "consumption" && (
            <Button
              variant="success"
              onClick={() => setShowConsumptionForm(!showConsumptionForm)}
            >
              <FaPlus className="me-1" /> Add Consumption
            </Button>
          )}
          {activeTab === "prices" && (
            <Button
              variant="success"
              onClick={() => setShowPriceForm(!showPriceForm)}
            >
              <FaPlus className="me-1" /> Add Price
            </Button>
          )}
        </Col>
      </Row>

      <Tab.Container
        id="dashboard-tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
      >
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="consumption">
              <FaUtensils className="me-2" />
              Consumption History
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="prices">
              <FaChartLine className="me-2" />
              Price History
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="consumption">
            {showConsumptionForm && (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <ConsumptionForm
                    restaurantId={restaurantId}
                    onSuccess={() => {
                      setShowConsumptionForm(false);
                      fetchConsumptions(restaurantId);
                    }}
                    onCancel={() => setShowConsumptionForm(false)}
                  />
                </Card.Body>
              </Card>
            )}
            <Card className="shadow-sm">
              <Card.Body>
                <ConsumptionList restaurantId={restaurantId} />
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="prices">
            {showPriceForm && (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <PriceHistoryForm
                    restaurantId={restaurantId}
                    onSuccess={() => {
                      setShowPriceForm(false);
                      fetchPriceHistories(restaurantId);
                    }}
                    onCancel={() => setShowPriceForm(false)}
                  />
                </Card.Body>
              </Card>
            )}
            <PriceHistoryList restaurantId={restaurantId} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default App;