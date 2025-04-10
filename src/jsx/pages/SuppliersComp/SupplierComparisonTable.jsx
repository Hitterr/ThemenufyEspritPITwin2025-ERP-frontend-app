import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function SupplierComparisonTable({ ingredientId }) {
  const [suppliers, setSuppliers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "price", direction: "asc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/suppliers/compare", {
          params: { ingredientId, sortBy: sortConfig.key, order: sortConfig.direction },
        });
        if (res.data.success) setSuppliers(res.data.data);
        else setError("Erreur API");
      } catch (err) {
        setError("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [ingredientId, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) return <Spinner animation="border" />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Table striped bordered hover className="text-center shadow-sm">
      <thead className="table-primary text-white">
  <tr>
    <th onClick={() => handleSort("supplierName")} style={{ cursor: "pointer" }}>
      <i className="fas fa-building me-2 text-info"></i>
      <span className="text-dark">Fournisseur</span>
      {sortConfig.key === "supplierName" ? (
        sortConfig.direction === "asc" ? (
          <i className="fas fa-sort-up ms-2 text-secondary" />
        ) : (
          <i className="fas fa-sort-down ms-2 text-secondary" />
        )
      ) : (
        <i className="fas fa-sort ms-2 text-muted" />
      )}
    </th>

    <th onClick={() => handleSort("price")} style={{ cursor: "pointer" }}>
      <i className="fas fa-euro-sign me-2 text-success"></i>
      <span className="text-dark">Prix</span>
      {sortConfig.key === "price" ? (
        sortConfig.direction === "asc" ? (
          <i className="fas fa-sort-up ms-2 text-secondary" />
        ) : (
          <i className="fas fa-sort-down ms-2 text-secondary" />
        )
      ) : (
        <i className="fas fa-sort ms-2 text-muted" />
      )}
    </th>

    <th onClick={() => handleSort("deliveryTime")} style={{ cursor: "pointer" }}>
      <i className="fas fa-truck me-2 text-warning"></i>
      <span className="text-dark">Délai</span>
      {sortConfig.key === "deliveryTime" ? (
        sortConfig.direction === "asc" ? (
          <i className="fas fa-sort-up ms-2 text-secondary" />
        ) : (
          <i className="fas fa-sort-down ms-2 text-secondary" />
        )
      ) : (
        <i className="fas fa-sort ms-2 text-muted" />
      )}
    </th>
  </tr>
</thead>


      <tbody>
        {suppliers.length > 0 ? (
          suppliers.map((s) => (
            <tr key={s.supplierId}>
              <td>{s.supplierName}</td>
              <td>{s.price.toFixed(2)} €</td>
              <td>{s.deliveryTime} j</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-muted">Aucun fournisseur trouvé.</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
