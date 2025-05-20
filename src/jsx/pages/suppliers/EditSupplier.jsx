import { useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useSupplierStore from "../../store/supplierStore";
import useRestaurantStore from "../../store/RestaurantStore";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editSupplierSchema } from "./validators/editSupplier";

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { updateSupplier, getSupplierById, fetchSuppliers } =
    useSupplierStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();

  const redirectTo = location.state?.redirectTo || "/suppliers";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editSupplierSchema),
    mode: "onChange",
  });

  useEffect(() => {
    fetchRestaurants();
    loadSupplier();
  }, [id, fetchRestaurants]);

  const loadSupplier = async () => {
    try {
      const supplier = await getSupplierById(id);
      if (supplier) {
        const transformedSupplier = {
          ...supplier,
          restaurantId: supplier.restaurantId ? supplier.restaurantId._id : "",
        };
        reset(transformedSupplier);
      } else {
        throw new Error("Supplier not found");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to load supplier data.",
      });
      navigate("/suppliers");
    }
  };

  const onSubmit = async (data) => {
    try {
      const success = await updateSupplier(id, data);
      if (success) {
        await fetchSuppliers();
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Supplier updated successfully",
        });
        navigate(redirectTo);
      } else {
        throw new Error("Failed to update supplier");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to update supplier.",
      });
    }
  };

  const handleCancel = () => {
    navigate(redirectTo);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Edit Supplier</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  {...register("name")}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  {...register("contact.email")}
                  isInvalid={!!errors.contact?.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contact?.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  {...register("contact.phone")}
                  isInvalid={!!errors.contact?.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contact?.phone?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Representative</Form.Label>
                <Form.Control
                  type="text"
                  {...register("contact.representative")}
                  isInvalid={!!errors.contact?.representative}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contact?.representative?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  {...register("status")}
                  isInvalid={!!errors.status}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.status?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Restaurant</Form.Label>
                <Form.Control
                  as="select"
                  {...register("restaurantId")}
                  isInvalid={!!errors.restaurantId}
                >
                  <option value="">None</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.nameRes}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.restaurantId?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                  type="text"
                  {...register("address.street")}
                  isInvalid={!!errors.address?.street}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address?.street?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  {...register("address.city")}
                  isInvalid={!!errors.address?.city}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address?.city?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  {...register("address.state")}
                  isInvalid={!!errors.address?.state}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address?.state?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  {...register("address.postalCode")}
                  isInvalid={!!errors.address?.postalCode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address?.postalCode?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  {...register("address.country")}
                  isInvalid={!!errors.address?.country}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address?.country?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  {...register("contract.startDate")}
                  isInvalid={!!errors.contract?.startDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contract?.startDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  {...register("contract.endDate")}
                  isInvalid={!!errors.contract?.endDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contract?.endDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Contract Terms</Form.Label>
                <Form.Control
                  as="select"
                  {...register("contract.terms")}
                  isInvalid={!!errors.contract?.terms}
                >
                  <option value="NET_30">NET 30</option>
                  <option value="NET_60">NET 60</option>
                  <option value="COD">COD</option>
                  <option value="Custom">Custom</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.contract?.terms?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Minimum Order</Form.Label>
                <Form.Control
                  type="number"
                  {...register("contract.minimumOrder")}
                  isInvalid={!!errors.contract?.minimumOrder}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contract?.minimumOrder?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Special Conditions</Form.Label>
                <Form.Control
                  type="text"
                  {...register("contract.specialConditions")}
                  isInvalid={!!errors.contract?.specialConditions}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.contract?.specialConditions?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Payment Currency</Form.Label>
                <Form.Control
                  type="text"
                  {...register("payment.currency")}
                  isInvalid={!!errors.payment?.currency}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.payment?.currency?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Preferred Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  {...register("payment.preferredMethod")}
                  isInvalid={!!errors.payment?.preferredMethod}
                >
                  <option value="bank">Bank</option>
                  <option value="credit">Credit</option>
                  <option value="cash">Cash</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.payment?.preferredMethod?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Account Details</Form.Label>
                <Form.Control
                  type="text"
                  {...register("payment.accountDetails")}
                  isInvalid={!!errors.payment?.accountDetails}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.payment?.accountDetails?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register("notes")}
                  isInvalid={!!errors.notes}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.notes?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button variant="secondary" type="button" onClick={handleCancel}>
              &lt; {/* Unicode for < */}
            </Button>
            <Button variant="primary" type="submit">
              Update Supplier {/* Unicode for pen icon */}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditSupplier;
