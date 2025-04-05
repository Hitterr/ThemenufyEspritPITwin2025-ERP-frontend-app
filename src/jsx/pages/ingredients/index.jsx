import { useEffect, useState } from "react";
import useIngredientStore from "../../store/ingredientStore";
import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaPencilAlt, FaPlus, FaTrash, FaFilter } from "react-icons/fa";
import IngredientFilters from "./components/IngredientFilters";
import IngredientPagination from "./components/IngredientPagination";
import io from "socket.io-client";
const Ingredients = () => {
  const { filteredIngredients, fetchIngredients, deleteIngredient } = useIngredientStore();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  useEffect(() => {
    loadIngredients();
    // Initialize socket connection
    const socket = io("http://localhost:5000");
    // Socket connection status handlers
    socket.on("connect", () => {
      console.log("Socket connected");
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    // Listen for ingredient alerts
    socket.on("ingredient-alert", (data) => {
      console.log("Ingredient alert received:", data);
      loadIngredients(); // Refresh the ingredients list
      // Show alert notification
      Swal.fire({
        icon: "warning",
        title: "Low Stock Alert!",
        html: `
          <strong>${data.ingredient.libelle}</strong><br>
          Current Quantity: ${data.ingredient.quantity} ${data.ingredient.unit}<br>
          Min Quantity: ${data.ingredient.minQty} ${data.ingredient.unit}<br>
          ${data.message}
        `,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
    });
    // Cleanup socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);
  const loadIngredients = async () => {
    await fetchIngredients();
    setLoading(false);
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await deleteIngredient(id);
        if (success) {
          Swal.fire("Deleted!", "Ingredient has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete ingredient.", "error");
        }
      }
    });
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIngredients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Update the return statement to include pagination and use currentItems
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="primary" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter className="me-1" /> Filters
        </Button>
        <Link to="/ingredients/add">
          <Button variant="success">
            <FaPlus />
          </Button>
        </Link>
      </div>
      {showFilters && <IngredientFilters onClose={() => setShowFilters(false)} />}
      <Card>
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
                {currentItems.map((ingredient) => (
                  <tr key={ingredient._id}>
                    <td>{ingredient.libelle}</td>
                    <td>{ingredient.type}</td>
                    <td>
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
                      <div className="d-flex justify-content-center gap-2">
                        <Link
                          to={`/ingredients/${ingredient._id}`}
                          className="btn btn-sm btn-info"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/ingredients/edit/${ingredient._id}`}
                          className="btn btn-sm btn-secondary"
                          title="Edit"
                        >
                          <FaPencilAlt />
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          title="Delete"
                          onClick={() => handleDelete(ingredient._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {filteredIngredients.length > 0 ? (
            <IngredientPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          ) : (
            <div className="text-center py-3">No ingredients found</div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
export default Ingredients;
