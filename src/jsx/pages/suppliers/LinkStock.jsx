import { Card, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useSupplierStore from "../../store/supplierStore";
import useStockStore from "../../store/stockStore";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { linkStockSchema } from "./validators/linkStock";
import { useEffect } from "react";

const LinkStock = () => {
  const navigate = useNavigate();
  const { id: supplierId } = useParams();
  const { linkStock, fetchSuppliers } = useSupplierStore();
  const { stocks, fetchStocks } = useStockStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(linkStockSchema),
    mode: "onChange",
    defaultValues: {
      stockId: "",
      pricePerUnit: 0,
      leadTimeDays: 1,
    },
  });

  useEffect(() => {
    fetchStocks();
  }, []);

  const onSubmit = async (data) => {
    try {
      const success = await linkStock(supplierId, data);
      if (success) {
        await fetchSuppliers(); // Refresh the supplier list
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Stock linked successfully",
        });
        navigate(`/suppliers/${supplierId}`);
      } else {
        throw new Error("Failed to link stock");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to link stock";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
      });
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Link Stock to Supplier</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              as="select"
              {...register("stockId")}
              isInvalid={!!errors.stockId}
            >
              <option value="">Select an stock</option>
              {stocks.map((stock) => (
                <option key={stock._id} value={stock._id}>
                  {stock.libelle}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.stockId?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price per Unit</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              {...register("pricePerUnit")}
              isInvalid={!!errors.pricePerUnit}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pricePerUnit?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lead Time (Days)</Form.Label>
            <Form.Control
              type="number"
              {...register("leadTimeDays")}
              isInvalid={!!errors.leadTimeDays}
            />
            <Form.Control.Feedback type="invalid">
              {errors.leadTimeDays?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(`/suppliers/${supplierId}`)}
            >
              &lt;
            </Button>
            <Button variant="primary" type="submit">
              Link Stock
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LinkStock;
