import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useSupplierStore from "../../store/supplierStore";
import Swal from "sweetalert2";

const ShowSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSupplierById, unlinkIngredient } = useSupplierStore();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplier();
  }, [id]);

  const loadSupplier = async () => {
    const data = await getSupplierById(id);
    console.log("Fetched supplier data:", data);
    if (data) {
      setSupplier(data);
    } else {
      navigate("/suppliers");
    }
    setLoading(false);
  };

  const handleUnlinkIngredient = async (ingredientId, ingredientName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to unlink ${ingredientName} from this supplier?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unlink it!",
    });

    if (result.isConfirmed) {
      const success = await unlinkIngredient(id, ingredientId);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `${ingredientName} has been unlinked from the supplier.`,
        });
        await loadSupplier(); // Refresh the supplier data
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to unlink the ingredient.",
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!supplier) return <div>Supplier not found</div>;

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">Supplier Details</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Basic Information</h5>
              <div className="mb-3">
                <strong>Name:</strong> {supplier.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {supplier.contact.email}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {supplier.contact.phone || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Representative:</strong> {supplier.contact.representative || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    supplier.status === "active"
                      ? "bg-success"
                      : supplier.status === "pending"
                      ? "bg-warning"
                      : supplier.status === "suspended"
                      ? "bg-danger"
                      : "bg-secondary"
                  }`}
                >
                  {supplier.status}
                </span>
              </div>
              <div className="mb-3">
                <strong>Restaurant:</strong>{" "}
                {supplier.restaurantId ? supplier.restaurantId.nameRes : "N/A"}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Address Information</h5>
              <div className="mb-3">
                <strong>Street:</strong> {supplier.address.street || "N/A"}
              </div>
              <div className="mb-3">
                <strong>City:</strong> {supplier.address.city || "N/A"}
              </div>
              <div className="mb-3">
                <strong>State:</strong> {supplier.address.state || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Postal Code:</strong> {supplier.address.postalCode || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Country:</strong> {supplier.address.country || "N/A"}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Contract Information</h5>
              <div className="mb-3">
                <strong>Start Date:</strong>{" "}
                {new Date(supplier.contract.startDate).toLocaleDateString()}
              </div>
              <div className="mb-3">
                <strong>End Date:</strong>{" "}
                {supplier.contract.endDate
                  ? new Date(supplier.contract.endDate).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="mb-3">
                <strong>Terms:</strong> {supplier.contract.terms || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Minimum Order:</strong>{" "}
                {supplier.contract.minimumOrder || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Special Conditions:</strong>{" "}
                {supplier.contract.specialConditions || "N/A"}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Payment Information</h5>
              <div className="mb-3">
                <strong>Currency:</strong> {supplier.payment.currency || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Preferred Method:</strong>{" "}
                {supplier.payment.preferredMethod || "N/A"}
              </div>
              <div className="mb-3">
                <strong>Account Details:</strong>{" "}
                {supplier.payment.accountDetails || "N/A"}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-4">
              <h5 className="text-primary">Additional Information</h5>
              <div className="mb-3">
                <strong>Notes:</strong> {supplier.notes || "N/A"}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-4">
              <h5 className="text-primary">Linked Ingredients</h5>
              {supplier.ingredients && supplier.ingredients.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price per Unit</th>
                      <th>Lead Time (Days)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.ingredients.map((ingredient) => (
                      <tr key={ingredient._id}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.pricePerUnit || "N/A"}</td>
                        <td>{ingredient.leadTimeDays || "N/A"}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleUnlinkIngredient(ingredient._id, ingredient.name)}
                          >
                            Unlink
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No ingredients linked to this supplier.</p>
              )}
            </div>
          </Col>
        </Row>
        <div className="mt-4">
          <Button
            variant="primary"
            className="me-2"
            onClick={() => navigate(`/suppliers/edit/${supplier._id}`)}
          >
            Edit Supplier
          </Button>
          <Button
            variant="success"
            className="me-2"
            onClick={() => navigate(`/suppliers/${supplier._id}/link-ingredient`)}
          >
            Link Ingredient
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/suppliers")}
          >
            Back to List
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ShowSupplier;