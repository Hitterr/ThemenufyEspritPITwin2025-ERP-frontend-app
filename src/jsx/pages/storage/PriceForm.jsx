// src/components/PriceHistoryForm.jsx
import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUtensils,
  FaCarrot,
  FaDollarSign,
  FaBoxes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import usePriceHistoryStore from "../../store/usePriceHistoryStore";

const PriceHistoryForm = ({ restaurantId = "", onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { createPriceHistory } = usePriceHistoryStore();
  const [formData, setFormData] = useState({
    restaurantId: restaurantId,
    supplierId: "",
    ingredientId: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (!value.toString().trim()) {
      newErrors[name] = `${name.replace(/Id$/, " ID")} is required`;
    } else if (name === "price" && (isNaN(value) || value <= 0)) {
      newErrors[name] = "Price must be a positive number";
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
      if (!formData[key].toString().trim()) {
        newErrors[key] = `${key.replace(/Id$/, " ID")} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { success, error } = await createPriceHistory(
        formData.ingredientId,
        formData.restaurantId,
        parseFloat(formData.price),
        formData.supplierId
      );
      if (success) {
        setMessage("Price history created successfully!");
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Price history recorded successfully",
          timer: 2000,
        });
        setFormData({
          restaurantId: restaurantId,
          supplierId: "",
          ingredientId: "",
          price: "",
        });
        setErrors({});
        if (onSuccess) onSuccess();
        else navigate("/Prices");
      } else {
        throw new Error(error);
      }
    } catch (error) {
      const errorMsg = error.message || "Failed to create price history";
      setMessage(`Error: ${errorMsg}`);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate("/Prices");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg rounded-lg max-w-lg mx-auto bg-white">
        <Card.Header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <Card.Title className="text-xl font-bold flex items-center">
            <FaDollarSign className="mr-2" /> Record Price History
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
                disabled={!!restaurantId} // Disable if restaurantId is provided
              />
              <Form.Control.Feedback type="invalid">
                {errors.restaurantId}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="font-semibold flex items-center">
                <FaBoxes className="mr-2 text-blue-500" /> Supplier ID
              </Form.Label>
              <Form.Control
                type="text"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                placeholder="Enter supplier ID"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.supplierId}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.supplierId}
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
                <FaDollarSign className="mr-2 text-blue-500" /> Price
              </Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.price}
                required
                step="0.01"
                min="0"
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
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
                onClick={handleCancel}
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

export default PriceHistoryForm;