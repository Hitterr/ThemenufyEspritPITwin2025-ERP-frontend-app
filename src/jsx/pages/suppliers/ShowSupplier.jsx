import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useSupplierStore from "../../store/supplierStore";
import Swal from "sweetalert2";
import { Stepper, Step } from 'react-form-stepper';
import BulkUpdateFormStep from './components/BulkUpdateFormStep';
import BulkUpdateStatsStep from './components/BulkUpdateStatsStep';

const ShowSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSupplierById, unlinkIngredient, bulkUpdateSupplierIngredients } = useSupplierStore();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); // 0: Main view, 1: Bulk update form, 2: Bulk update stats
  const [bulkUpdateData, setBulkUpdateData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [bulkUpdateStats, setBulkUpdateStats] = useState({
    updatedCount: 0,
    avgPriceAfterUpdate: 0,
    avgLeadTimeAfterUpdate: 0,
    totalPriceChange: 0,
    totalLeadTimeChange: 0,
  });

  useEffect(() => {
    loadSupplier();
  }, [id]);

  const loadSupplier = async () => {
    const data = await getSupplierById(id);
    console.log("Fetched supplier data:", data);
    if (data) {
      setSupplier(data);
      const ingredientsData = (data.ingredients || []).map(ing => ({
        ingredientId: ing._id,
        pricePerUnit: ing.pricePerUnit || 0,
        leadTimeDays: ing.leadTimeDays || 1,
      }));
      setBulkUpdateData(ingredientsData);
      setOriginalData(ingredientsData);
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
        await loadSupplier();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to unlink the ingredient.",
        });
      }
    }
  };

  const handleBulkUpdateChange = (index, field, value) => {
    const updatedData = [...bulkUpdateData];
    updatedData[index] = { ...updatedData[index], [field]: Number(value) };
    setBulkUpdateData(updatedData);
  };

  const handleBulkUpdateSubmit = async () => {
    if (bulkUpdateData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Ingredients",
        text: "There are no ingredients to update.",
      });
      return;
    }

    const success = await bulkUpdateSupplierIngredients(id, bulkUpdateData);
    if (success) {
      const updatedCount = bulkUpdateData.length;
      const avgPriceAfterUpdate = (bulkUpdateData.reduce((sum, ing) => sum + ing.pricePerUnit, 0) / updatedCount).toFixed(2);
      const avgLeadTimeAfterUpdate = (bulkUpdateData.reduce((sum, ing) => sum + ing.leadTimeDays, 0) / updatedCount).toFixed(2);
      const totalPriceChange = bulkUpdateData.reduce((sum, ing, index) => sum + (ing.pricePerUnit - originalData[index].pricePerUnit), 0).toFixed(2);
      const totalLeadTimeChange = bulkUpdateData.reduce((sum, ing, index) => sum + (ing.leadTimeDays - originalData[index].leadTimeDays), 0).toFixed(2);

      setBulkUpdateStats({
        updatedCount,
        avgPriceAfterUpdate,
        avgLeadTimeAfterUpdate,
        totalPriceChange,
        totalLeadTimeChange,
      });

      setStep(2);
      await loadSupplier();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update ingredients.",
      });
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
              <div className="mb-2">
                <Button
                  variant="warning"
                  onClick={() => setStep(1)}
                  disabled={!(supplier.ingredients && supplier.ingredients.length > 0)}
                >
                  Bulk Update Ingredients
                </Button>
              </div>
              {step === 0 ? (
                supplier.ingredients && supplier.ingredients.length > 0 ? (
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
                )
              ) : (
                <div className="form-wizard">
                  <style>
                    {`
                      .nav-wizard .react-form-stepper__step--active div,
                      .nav-wizard .react-form-stepper__step--complete div {
                        background: linear-gradient(to right, #FF7A7A, #FFC07A) !important;
                        color: white !important;
                        border: none !important;
                      }
                      .nav-wizard .react-form-stepper__step div {
                        background: #e0e0e0 !important;
                        color: #666 !important;
                        border: none !important;
                      }
                      .nav-wizard .react-form-stepper__line {
                        background: #e0e0e0 !important;
                      }
                      .nav-wizard .react-form-stepper__step--complete .react-form-stepper__line {
                        background: linear-gradient(to right, #FF7A7A, #FFC07A) !important;
                      }
                    `}
                  </style>
                  <Stepper className="nav-wizard" activeStep={step - 1} label={false}>
                    <Step className="nav-link" onClick={() => setStep(1)} />
                    <Step className="nav-link" onClick={() => setStep(2)} />
                  </Stepper>
                  {step === 1 && (
                    <BulkUpdateFormStep
                      bulkUpdateData={bulkUpdateData}
                      supplier={supplier}
                      handleBulkUpdateChange={handleBulkUpdateChange}
                      onNext={handleBulkUpdateSubmit}
                      onCancel={() => setStep(0)}
                    />
                  )}
                  {step === 2 && (
                    <BulkUpdateStatsStep
                      bulkUpdateStats={bulkUpdateStats}
                      onPrev={() => setStep(1)}
                      onBack={() => setStep(0)}
                    />
                  )}
                </div>
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