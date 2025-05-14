import { useState } from "react";
import { Card, Form, Button, Alert, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaCarrot, FaSortNumericUp } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRestaurantQuery, useStocksQuery } from "./utils/queries";
import { apiRequest } from "../../utils/apiRequest";
import { useQueryClient } from "@tanstack/react-query";
const ConsumptionForm = ({ onCancel }) => {
  const navigate = useNavigate();
  const { data: restaurants, isLoading: loadingRestaurants } =
    useRestaurantQuery();
  const { data: stocks, isLoading: loadingStocks } = useStocksQuery();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    stockId: "",
    ordreId: "680c09fb195cebecf6b71273",
    qty: "",
    wastageQty: 0,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (!value.trim()) {
      newErrors[name] = `${name.replace(/Id$/, " ID")} is required`;
    } else if (name === "qty" && (isNaN(value) || value <= 0)) {
      newErrors[name] = "Quantity must be a positive number";
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key].trim()) {
        newErrors[key] = `${key.replace(/Id$/, " ID")} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await apiRequest.post(
        "http://localhost:5000/api/storage/history/consumptions",
        formData
      );
      setMessage("Consumption created successfully!");
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Consumption recorded successfully",
        timer: 2000,
      });
      queryClient.invalidateQueries("consumptions");

      setFormData({
        restaurantId: "",
        stockId: "",
        ordreId: "",
        qty: "",
        wastageQty: 0,
      });
      setErrors({});
      navigate("/storage");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setMessage(`Error: ${errorMsg}`);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
      });
    }
  };
  return (
    <>
      <Card.Header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <Card.Title className="text-xl font-bold flex items-center">
          <FaUtensils className="mr-2" /> Record Consumption
        </Card.Title>
      </Card.Header>
      <Card.Body className="p-6">
        {message && (
          <Alert
            variant={message.includes("Error") ? "danger" : "success"}
            className="mb-4"
          >
            {message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="font-semibold flex items-center">
              <FaUtensils className="mr-2 text-blue-500" /> Stock ID
            </Form.Label>
            <Form.Control
              as="select"
              name="stockId"
              value={formData.stockId}
              onChange={handleChange}
              placeholder="Enter restaurant ID"
              className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
              isInvalid={!!errors.stockId}
              required
            >
              <option value="">-- Select a stock --</option>
              {stocks &&
                stocks.map((each) => {
                  return (
                    <option key={each._id} value={each._id}>
                      {each.libelle}
                    </option>
                  );
                })}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.stockId}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="font-semibold flex items-center">
              <FaCarrot className="mr-2 text-blue-500" /> Ordre ID
            </Form.Label>
            <Form.Control
              type="text"
              name="ordreId"
              value={formData.ordreId}
              defaultValue={"680c09fb195cebecf6b71273"}
              onChange={handleChange}
              placeholder="Enter stock ID"
              className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
              isInvalid={!!errors.ordreId}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.ordreId}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="font-semibold flex items-center">
              <FaSortNumericUp className="mr-2 text-blue-500" /> Quantity
            </Form.Label>
            <Form.Control
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
              isInvalid={!!errors.qty}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.qty}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="font-semibold flex items-center">
              <FaSortNumericUp className="mr-2 text-blue-500" /> Wastage QTY
            </Form.Label>
            <Form.Control
              type="number"
              name="wastageQty"
              defaultValue={formData.wastageQty}
              onChange={handleChange}
              placeholder="Enter quantity"
              className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
              isInvalid={!!errors.wastageQty}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.wastageQty}
            </Form.Control.Feedback>
          </Form.Group>
          <Card.Footer className="row justify-content-between w-100 gap-3">
            <Col>
              <Button
                variant="secondary"
                type="button"
                onClick={onCancel}
                className="bg-gray-500 w-100 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 flex-1"
              >
                Cancel
              </Button>
            </Col>{" "}
            <Col>
              {" "}
              <Button
                variant="primary"
                type="submit"
                className="bg-blue-600 w-100 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 flex-1"
              >
                Submit
              </Button>
            </Col>
          </Card.Footer>
        </Form>
      </Card.Body>
    </>
  );
};
export default ConsumptionForm;
