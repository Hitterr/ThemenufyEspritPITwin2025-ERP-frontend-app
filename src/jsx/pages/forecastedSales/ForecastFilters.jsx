import React from "react";
import { Form, Button, InputGroup, Card } from "react-bootstrap";

const ForecastFilters = ({ inputDays, setInputDays, handleApply, forecastData, selectedIngredient, setSelectedIngredient }) => {
  return (
    <Card className="p-4 shadow-sm mb-4">
      <h5 className="mb-3">Forecast Settings</h5>
      <InputGroup className="mb-3">
        <Form.Control
          type="number"
          min="1"
          value={inputDays}
          onChange={(e) => setInputDays(e.target.value)}
          placeholder="Enter number of days"
        />
        <Button variant="primary" onClick={handleApply}>
          Apply
        </Button>
      </InputGroup>

      <Form.Select
        className="mb-3"
        value={selectedIngredient}
        onChange={(e) => setSelectedIngredient(e.target.value)}
      >
        <option value="">-- Select an Ingredient --</option>
        {forecastData.map(item => (
          <option key={item.ingredient} value={item.ingredient}>
            {item.ingredient}
          </option>
        ))}
      </Form.Select>
    </Card>
  );
};

export default ForecastFilters;
