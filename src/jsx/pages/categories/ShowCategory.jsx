import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

import { FaPencilAlt } from "react-icons/fa";
import { MoveLeft } from "lucide-react";
import { apiRequest } from "../../utils/apiRequest";
import CategoryForm from "./components/CategoryForm";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SubCategoriesTable } from "./components/SubCategoriesTable";
const ShowCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: category, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: async () => (await apiRequest.get("/categories/" + id)).data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiRequest.put("/categories/" + id, data),
    onSuccess: async () => {
      queryClient.invalidateQueries(["category"]);
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const handleSubmit = (data) => {
    console.log(data);
    // Make the API call to update the ingredient
    updateMutation.mutate({ id, data });
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!category) {
    return <div>Ingredient not found</div>;
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">{category.name} Details</Card.Title>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="mb-4">
              <h5 className="text-primary">Basic Information</h5>
              <hr />
              <div className="mb-3">
                <strong>Name:</strong> {category.name}
              </div>
              <div className="mb-3">
                <strong>Description:</strong> {category.description}
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4 row justify-content-start">
          <Col xs={3} lg={1}>
            <Button
              variant="secondary"
              className="w-100"
              onClick={() => navigate("/categories")}
            >
              <MoveLeft />
            </Button>
          </Col>
          <Col xs={3} lg={1}>
            {" "}
            <Button
              variant="warning"
              className="me-2 w-100"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <FaPencilAlt />
            </Button>
          </Col>
        </Row>
        <Row>
          <SubCategoriesTable
            categoryId={category._id}
            subCategories={category?.subCategories}
          />
        </Row>
        <Modal
          show={isModalOpen}
          onHide={() => {
            setIsModalOpen(false);
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{"Edit Category"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CategoryForm
              initialData={category}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsModalOpen(false);
              }}
            />
          </Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  );
};
export default ShowCategory;
