import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaCarrot, FaDollarSign, FaBoxes } from "react-icons/fa";
import Swal from "sweetalert2";
import usePriceHistoryStore from "../../store/usePriceHistoryStore";
const PriceHistoryForm = ({ restaurantId = "", onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { createPriceHistory } = usePriceHistoryStore();
  const [formData, setFormData] = useState({
    restaurantId: restaurantId,
    stockId: "",
    invoiceId: "",
    supplierId: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (!value.toString().trim() && name !== "supplierId") {
      newErrors[name] = `${name.replace(/Id$/, " ID")} is required`;
    } else if (name === "price" && (isNaN(value) || parseFloat(value) <= 0)) {
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["restaurantId", "stockId", "invoiceId", "price"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field].toString().trim()) {
        newErrors[field] = `${field.replace(/Id$/, " ID")} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    setMessage("");

    try {
      const { success, error } = await createPriceHistory({
        stockId: formData.stockId,
        restaurantId: formData.restaurantId,
        price: parseFloat(formData.price),
        invoiceId: formData.invoiceId,
        supplierId: formData.supplierId || null,
      });

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
          stockId: "",
          invoiceId: "",
          supplierId: "",
          price: "",
        });
        if (onSuccess) onSuccess();
      } else {
        throw new Error(error);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create price history";
      setMessage(`Error: ${errorMsg}`);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
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
                onBlur={handleBlur}
                placeholder="Enter restaurant ID"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.restaurantId}
                required
                disabled={!!restaurantId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.restaurantId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="font-semibold flex items-center">
                <FaCarrot className="mr-2 text-blue-500" /> Stock ID
              </Form.Label>
              <Form.Control
                type="text"
                name="stockId"
                value={formData.stockId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter stock ID"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.stockId}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.stockId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="font-semibold flex items-center">
                <FaUtensils className="mr-2 text-blue-500" /> Invoice ID
              </Form.Label>
              <Form.Control
                type="text"
                name="invoiceId"
                value={formData.invoiceId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter invoice ID"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.invoiceId}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.invoiceId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="font-semibold flex items-center">
                <FaBoxes className="mr-2 text-blue-500" /> Supplier ID
                (Optional)
              </Form.Label>
              <Form.Control
                type="text"
                name="supplierId"
                value={formData.supplierId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter supplier ID"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                isInvalid={!!errors.supplierId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.supplierId}
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
                onBlur={handleBlur}
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
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
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
