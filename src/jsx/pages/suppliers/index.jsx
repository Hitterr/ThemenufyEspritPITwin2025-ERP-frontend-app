import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEye, FaPencilAlt, FaPlus, FaTrash, FaFilter } from "react-icons/fa";
import useSupplierStore from "../../store/supplierStore";
import SupplierFilters from "./components/SupplierFilters";
import SupplierPagination from "./components/SupplierPagination";
import SupplierStats from "./components/SupplierStats";
import Swal from "sweetalert2";

const Suppliers = () => {
  const {
    filteredSuppliers,
    fetchSuppliers,
    deleteSupplier,
    pagination,
    setFilterCriteria,
    globalStats
  } = useSupplierStore();

  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    await fetchSuppliers();
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
        const success = await deleteSupplier(id);
        if (success) {
          await loadSuppliers();
          setFilterCriteria({ page: 1 });
          Swal.fire("Deleted!", "Supplier has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete supplier.", "error");
        }
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    setFilterCriteria({ page: pageNumber });
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Suppliers</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/suppliers/add">
            <Button variant="success">
              <FaPlus /> Add Supplier
            </Button>
          </Link>
          <div className="d-flex gap-2">
            <Button variant="info" onClick={toggleStats}>
              {showStats ? "Hide Stats" : "Show Stats"}
            </Button>
            <Button variant="primary" onClick={() => setShowFilters(!showFilters)}>
              <FaFilter className="me-1" /> Filters
            </Button>
          </div>
        </div>

        <SupplierStats showStats={showStats} />

        {showFilters && <SupplierFilters onClose={() => setShowFilters(false)} />}
        
        <div className="table-responsive">
          <Table className="table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Restaurant</th>
                <th className="text-center" style={{ width: "150px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        supplier.status === "active"
                          ? "bg-success"
                          : supplier.status === "pending"
                          ? "bg-warning"
                          : supplier.status === "suspended"
                          ? "bg-danger"
                          : supplier.status === "inactive"
                          ? "bg-secondary"
                          : "bg-secondary"
                      }`}
                    >
                      {supplier.status}
                    </span>
                  </td>
                  <td>{supplier.restaurantId ? supplier.restaurantId.nameRes : "N/A"}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Link
                        to={`/suppliers/${supplier._id}`}
                        className="btn btn-sm btn-info"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/suppliers/edit/${supplier._id}`}
                        className="btn btn-sm btn-secondary"
                        title="Edit"
                      >
                        <FaPencilAlt />
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        title="Delete"
                        onClick={() => handleDelete(supplier._id)}
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
        
        {filteredSuppliers.length > 0 ? (
          <SupplierPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="text-center py-3">No suppliers found</div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Suppliers;