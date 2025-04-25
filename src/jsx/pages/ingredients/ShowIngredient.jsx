import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useIngredientStore from "../../store/ingredientStore";

const ShowIngredient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getIngredientById } = useIngredientStore();
  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIngredient();
  }, [id]);

  const loadIngredient = async () => {
    const data = await getIngredientById(id);
    if (data) {
      setIngredient(data);
    } else {
      navigate("/ingredients");
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
        <Card.Title className="mb-0">{ingredient.type.name} Details</Card.Title>
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
                <strong>Type:</strong> {ingredient.type.name}
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

        <Row className="mt-4 row justify-content-between ">
          <Col xs={3}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => navigate("/ingredients")}
            >
              Back to List
            </Button>
          </Col>
          <Col xs={3}>
            <Button
              variant="primary"
              className="w-100"
              onClick={() => navigate(`/ingredients/edit/${ingredient._id}`)}
            >
              Edit Ingredient
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ShowIngredient;
