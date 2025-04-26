import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaCarrot, FaSortNumericUp } from "react-icons/fa";
import Swal from "sweetalert2";
const ConsumptionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantId: "",
    ingredientId: "",
    qty: "",
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
      await axios.post(
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
      setFormData({ restaurantId: "", ingredientId: "", ordreId:"",qty: "" });
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
    <div className="container mx-auto p-4">
      <Card className="shadow-lg rounded-lg max-w-lg mx-auto bg-white">
        <Card.Header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <Card.Title className="text-xl font-bold flex items-center">
            <FaUtensils className="mr-2" /> Record Consumption
          </Card.Title>
        </Card.Header>
        <Card.Body className="p-6">
          {message && (
            <Alert variant={message.includes("Error") ? "danger" : "success"}
              className="mb-4"
            >
              {message}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="font-semibold flex items-center">
                <FaUtensils className="mr-2 text-blue-500" /> Restaurant ID
              </Form.Label>
              <Form.Control
                type="text"
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                placeholder="Enter restaurant ID"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.restaurantId}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.restaurantId}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="font-semibold flex items-center">
                <FaCarrot className="mr-2 text-blue-500" /> Ingredient ID
              </Form.Label>
              <Form.Control
                type="text"
                name="ingredientId"
                value={formData.ingredientId}
                onChange={handleChange}
                placeholder="Enter ingredient ID"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.ingredientId}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.ingredientId}
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
                onChange={handleChange}
                placeholder="Enter ingredient ID"
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
            <div className="flex gap-3">
              <Button
                variant="primary"
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 flex-1"
              >
                Submit
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate("/storage")}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 flex-1"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
export default ConsumptionForm;