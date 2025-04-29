import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useIngredientStore from "../../store/ingredientStore";
import { FaPencilAlt } from "react-icons/fa";
import { MoveLeft } from "lucide-react";
import EditIngredient from "./EditIngredient";
const ShowIngredient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIngredientById, ingredients } = useIngredientStore();
  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadIngredient();
  }, [id, ingredients]);
  const loadIngredient = () => {
    const data = ingredients.find((ing) => ing._id === id);
    if (data) {
      setIngredient(data);
    } else {
      navigate("/stock");
    }
    setLoading(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!ingredient) {
    return <div>Ingredient not found</div>;
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">{ingredient.libelle} Details</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Basic Information</h5>
              <hr />
              <div className="mb-3">
                <strong>Name:</strong> {ingredient.libelle}
              </div>
              <div className="mb-3">
                <strong>Type:</strong> {ingredient?.type?.name || "-"}
              </div>
              <div className="mb-3">
                <strong>Price:</strong> ${ingredient.price}
              </div>
              <div className="mb-3">
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    ingredient.disponibility ? "badge-success" : "badge-danger"
                  }`}
                >
                  {ingredient.disponibility ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Quantity Management</h5>
              <hr />
              <div className="mb-3">
                <strong>Current Quantity:</strong> {ingredient.quantity}{" "}
                {ingredient.unit}
              </div>
              <div className="mb-3">
                <strong>Minimum Quantity:</strong> {ingredient.minQty}{" "}
                {ingredient.unit}
              </div>
              <div className="mb-3">
                <strong>Maximum Quantity:</strong> {ingredient.maxQty}{" "}
                {ingredient.unit}
              </div>
              <div className="mb-3">
                <span
                  className={`badge ${
                    ingredient.quantity > ingredient.minQty
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {ingredient.quantity > ingredient.minQty
                    ? "Stock OK"
                    : "Low Stock"}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4 row justify-content-start ">
          <Col lg={2} sm={4} xs={6}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => navigate("/stock")}
            >
              <MoveLeft size={20} />
            </Button>
          </Col>
          <Col lg={2} sm={4} xs={6}>
            <EditIngredient idIng={id} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default ShowIngredient;
