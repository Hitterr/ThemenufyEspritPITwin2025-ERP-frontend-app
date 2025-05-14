import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useInvoiceStore from "../../../store/invoiceStore";
import { addInvoiceItemSchema } from "../validators/addInvoiceItemSchema";
import { addInvoiceSchema } from "../validators/addInvoiceSchema";

import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { Carrot, Plus } from "lucide-react";
import useStockStore from "../../../store/stockStore";
import { apiRequest } from "../../../utils/apiRequest";
const SMART_INVOICE_API = "http://127.0.0.1:5000/api/detect_spike";
const AddInvoiceItem = () => {
  const [show, setShow] = useState(false);
  const { fetchStocks, stocks } = useStockStore();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const { addInvoiceItem, addSpike } = useInvoiceStore();
  useEffect(() => {
    fetchStocks();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addInvoiceItemSchema),
    mode: "onChange",
    defaultValues: {
      stock: "",
      quantity: 0,
      price: 0,
    },
  });
  const onSubmit = async (data) => {
    try {
      const { data: detectionResult } = await apiRequest.post(
        SMART_INVOICE_API,
        {
          stockId: data.stock,
          price: data.price,
        }
      );
      if (detectionResult && detectionResult.isSpike == true) {
        addSpike(data.stock);
      }
      console.log(detectionResult);
    } catch (error) {
      console.error(error);
    }
    try {
      addInvoiceItem(data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Stock added successfully",
      });
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add stock" + error.message,
      });
    }
  };
  return (
    <>
      <Row xs={12} className="">
        <Col xs={12} sm={6}>
          <Button variant="primary" className="p-2" onClick={handleShow}>
            <Plus size={20} /> <Carrot size={20} />
          </Button>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Select
                    type="text"
                    {...register("stock")}
                    isInvalid={!!errors.libelle}
                  >
                    <option value="">Select an stock</option>
                    {stocks.length > 0 &&
                      stocks.map((ing) => (
                        <option value={ing._id} key={ing._id}>
                          {ing.libelle}
                        </option>
                      ))}
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {errors.stock?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    {...register("quantity")}
                    isInvalid={!!errors.quantity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    {...register("price")}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-around gap-2">
              <Col xs={12} sm={5}>
                <Button variant="primary" type="submit" className="w-100">
                  Add Stock
                </Button>
              </Col>
              <Col xs={12} sm={5}>
                <Button
                  variant="secondary"
                  type="button"
                  className="w-100"
                  onClick={() => handleClose()}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default AddInvoiceItem;
