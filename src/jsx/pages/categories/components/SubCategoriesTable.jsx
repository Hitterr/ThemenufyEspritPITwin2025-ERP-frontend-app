import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, X } from "lucide-react";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { apiRequest } from "../../../utils/apiRequest";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CategoryForm from "./CategoryForm";

export const SubCategoriesTable = ({ subCategories = [], categoryId }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({
    name: "",
    description: "",
  });
  const queryClient = useQueryClient();
  const removeSubCategory = useMutation({
    mutationFn: async (id) => {
      console.log(categoryId, id);
      await apiRequest.put(`/categories/sub-category`, {
        categoryId: categoryId,
        subCategoryId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["category"]);
      navigate("/categories/" + categoryId); // Redirect to the categories list after deletion
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const addSubCategory = useMutation({
    mutationFn: async (data) => {
      await apiRequest.post(`/categories/sub-category`, {
        categoryId: categoryId,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["category"]);
      navigate("/categories/" + categoryId); // Redirect to the categories list after deletion
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (data) => {
    console.log(data);
    addSubCategory.mutate(data);
  };
  return (
    <Card className="my-4">
      <Card.Header>
        <h4> Sub-Categories </h4>
        <Button
          className="btn btn-sm btn-success ms-2"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <Plus size={20} />
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table className="table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories?.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <Link to={"/categories/" + category._id}>
                      <Button className="btn btn-sm btn-primary">
                        <Pencil size={20} />
                      </Button>
                    </Link>
                    <Button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => {
                        removeSubCategory.mutate(category._id);
                      }}
                    >
                      <X size={20} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
      <Modal
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{"New Sub Category"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoryForm
            initialData={newSubCategory}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};
