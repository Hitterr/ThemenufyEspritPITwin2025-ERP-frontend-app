import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Table, Button, Modal, Spinner } from "react-bootstrap";
import CategoryForm from "./components/CategoryForm";
import PageTitle from "../../layouts/PageTitle";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { Eye, Plus, Trash, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories", page, limit],
    queryFn: () =>
      fetch(`${backendUrl}/categories?page=${page}&limit=${limit}`).then(
        (res) => res.json()
      ),
  });
  const createMutation = useMutation({
    mutationFn: (newCategory) =>
      fetch(backendUrl + "/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsModalOpen(false);
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      fetch(`${backendUrl}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsModalOpen(false);
      setEditingCategory(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetch(`${backendUrl}/categories/${id}`, {
        method: "DELETE",
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const handleSubmit = (data) => {
    try {
      if (editingCategory) {
        updateMutation.mutate({ id: editingCategory.id, data });
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {}
  };
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Button variant="success" onClick={() => setIsModalOpen(true)}>
            <Plus />
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesData?.data.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td className="text-end">
                    <Link to={"/categories/" + category._id}>
                      <Button size="sm" variant="info" className="me-2">
                        <Eye size={15} />
                      </Button>
                    </Link>
                    <Button
                      variant="warning"
                      className="me-2"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaPencilAlt size={15} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteMutation.mutate(category._id)}
                    >
                      <FaTrash size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              variant="outline-primary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-muted">
              Page {page} of {categoriesData?.pagination.totalPages}
            </span>
            <Button
              variant="outline-primary"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= categoriesData?.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </Card.Body>
      </Card>
      <Modal
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoryForm
            initialData={editingCategory || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingCategory(null);
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CategoriesPage;
