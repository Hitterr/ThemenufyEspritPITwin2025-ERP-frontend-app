import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaTrash, FaFilter } from "react-icons/fa";
import Swal from "sweetalert2";
import io from "socket.io-client";
import { useEffect } from "react";
import { apiRequest } from "../../utils/apiRequest";
import IngredientFilters from "./components/IngredientFilters";
import AddIngredient from "./AddIngredient";
import EditIngredient from "./EditIngredient";
import useIngredientStore from "../../store/ingredientStore";
import { BarChart, ChartArea, ChartColumnIncreasing, Eye } from "lucide-react";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 10;
const Ingredients = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const {
    ingredients,
    pagination,
    filteredIngredients,
    fetchIngredients,
    loading,
  } = useIngredientStore();
  // Socket connection for real-time updates
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("ingredient-update", () => {
      fetchIngredients(page);
    });
    socket.on("ingredient-alert", (data) => {
      toast.warning(
        <div>
          <strong>{data.ingredient.libelle}</strong>
          <br />
          Current Quantity: {data.ingredient.quantity} {data.ingredient.unit}
          <br />
          Min Quantity: {data.ingredient.minQty} {data.ingredient.unit}
          <br />
          {data.message}
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    });
    return () => socket.disconnect();
  }, []);
  useEffect(() => {
    fetchIngredients(page);
    console.log(ingredients); // Ajoutez cette ligne pour afficher les données dans la console
  }, [page]);
  // Delete ingredient mutation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await apiRequest.delete(`/ingredient/${id}`);
        queryClient.invalidateQueries(["ingredients"]);
        Swal.fire("Deleted!", "Ingredient has been deleted.", "success");
        await fetchIngredients(page);
      } catch (error) {
        Swal.fire("Error!", "Failed to delete ingredient.", "error");
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Card>
        <Card.Header className="d-flex flex-wrap  justify-content-between align-items-center">
          <Row
            xs={12}
            className="justify-content-between align-items-center  mb-3 w-100"
          >
            <Col xs={5} sm={3} lg={1}>
              <AddIngredient />
            </Col>

            <Col xs={5} sm={5} lg={2}>
              <Row>
                <Col xs={6}>
                  <Link to={"/stock-analysis"}>
                    <Button variant="secondary" className="w-100">
                      <ChartColumnIncreasing size={20} />
                    </Button>{" "}
                  </Link>
                </Col>
                <Col xs={6}>
                  {" "}
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter size={20} />
                  </Button>
                </Col>
              </Row>{" "}
            </Col>
            {showFilters && (
              <IngredientFilters onClose={() => setShowFilters(false)} />
            )}
          </Row>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table className="table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-center" style={{ width: "150px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map((ingredient) => (
                  <tr key={ingredient._id}>
                    <td>{ingredient.libelle}</td>
                    <td>{ingredient?.type?.name || "-"}</td>
                    <td className="text-capitalize">
                      {ingredient.quantity} {ingredient.unit}
                    </td>
                    <td>${ingredient.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          ingredient.disponibility ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {ingredient.disponibility ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2 row-cols-3">
                        <Col>
                          {" "}
                          <Link
                            to={`/stock/${ingredient._id}`}
                            style={{ color: "white" }}
                          >
                            <Button variant="info" size="sm">
                              <Eye size={15} />
                            </Button>
                          </Link>
                        </Col>
                        <Col>
                          {" "}
                          <EditIngredient idIng={ingredient._id} />
                        </Col>
                        <Col>
                          {" "}
                          <Button
                            variant="danger"
                            size="sm"
                            title="Delete"
                            onClick={() => handleDelete(ingredient._id)}
                          >
                            <FaTrash size={15} />
                          </Button>
                        </Col>
                      </div>
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
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
export default Ingredients;
