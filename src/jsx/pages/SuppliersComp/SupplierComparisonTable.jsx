import React, { useMemo, useState, useEffect } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

export default function SupplierComparisonTable({ ingredientId }) {
  const [suppliers, setSuppliers] = useState([]);
  const [tableState, setTableState] = useState({
    currentPage: 1,
    sortKey: "price",
    sortOrder: "asc",
  });
  const rowsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/suppliersComparaison/compare", {
          params: {
            ingredientId,
            sortBy: tableState.sortKey,
            order: tableState.sortOrder,
          },
        });
        if (res.data.success) setSuppliers(res.data.data);
        else setError("API Error occurred.");
      } catch (err) {
        setError("Failed to load suppliers.");
      } finally {
        setLoading(false);
      }
    };
    if (ingredientId) {
      fetchComparison();
    }
  }, [ingredientId, tableState.sortKey, tableState.sortOrder]);

  const paginatedItems = useMemo(() => {
    const start = (tableState.currentPage - 1) * rowsPerPage;
    return suppliers.slice(start, start + rowsPerPage);
  }, [suppliers, tableState.currentPage]);

  const sortByKey = (key) => {
    const sorted = [...suppliers].sort((a, b) => {
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";
      if (typeof aValue === "string" && typeof bValue === "string") {
        return tableState.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return tableState.sortOrder === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }
    });
    setSuppliers(sorted);
    setTableState((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Table className="display w-100">
   <thead className="text-center">
  <tr>
    <th onClick={() => sortByKey("supplierName")} style={{ cursor: "pointer" }}>
      Supplier {tableState.sortOrder === "asc" ? "↑" : "↓"}
    </th>
    <th onClick={() => sortByKey("price")} style={{ cursor: "pointer" }}>
      Price {tableState.sortOrder === "asc" ? "↑" : "↓"}
    </th>
    <th onClick={() => sortByKey("deliveryTime")} style={{ cursor: "pointer" }}>
      Delivery Time {tableState.sortOrder === "asc" ? "↑" : "↓"}
    </th>
  </tr>
</thead>


      <tbody className="text-center">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <tr key={item.supplierId}>
              <td>{item.supplierName}</td>
              <td>{item.price.toFixed(2)} €</td>
              <td>{item.deliveryTime} days</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-muted">
              No suppliers found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
