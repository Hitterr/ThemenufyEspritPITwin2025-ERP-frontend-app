import React, { useState, useEffect } from "react";
import { Table, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import SupplierComparisonTable from "./SupplierComparisonTable";

export default function InventorySupplierManager() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showComparison, setShowComparison] = useState(null);
  const [bulkField, setBulkField] = useState("minQty");
  const [bulkValue, setBulkValue] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/ingredient");
        if (data.success) setInventory(data.data);
        else console.error("Erreur API:", data.message);
      } catch (error) {
        console.error("Erreur lors de la récupération des stocks:", error);
      }
    };
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.libelle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStock === "all" ||
      (filterStock === "low" && item.quantity < item.minQty) ||
      (filterStock === "critical" && item.quantity === 0);
    return matchesSearch && matchesFilter;
  });

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkEdit = async () => {
    if (!bulkField || bulkValue === "") {
      return alert("Veuillez remplir tous les champs.");
    }

    const payload = {
      ids: selectedItems,
      update: { [bulkField]: Number(bulkValue) },
    };

    try {
      const response = await axios.patch("http://localhost:5000/api/ingredient/bulk", payload);
      if (response.data.success) {
        setInventory((prev) =>
          prev.map((item) =>
            selectedItems.includes(item._id)
              ? { ...item, ...payload.update }
              : item
          )
        );
        setSelectedItems([]);
        setBulkValue("");
        alert("Édition en masse réussie !");
      } else {
        console.error("Erreur API:", response.data.message);
      }
    } catch (error) {
      console.error("Échec de l'édition en masse:", error);
      alert("Erreur lors de l'édition en masse.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestion des Stocks et Fournisseurs</h2>
      {/*filtres */}
      <Row className="mb-4 align-items-center">
        <Col md={3}>
          <div className="position-relative">
            <i className="fa fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-primary"></i>
            <Form.Control
              type="text"
              placeholder="Rechercher un ingrédient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-5 rounded-3"
            />
          </div>
        </Col>

        <Col md={2}>
          <Form.Select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="rounded-3"
          >
            <option value="all">📦 Tous</option>
            <option value="low">🟡 Faible</option>
            <option value="critical">🔴 Critique</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={bulkField}
            onChange={(e) => setBulkField(e.target.value)}
            className="rounded-3"
          >
            <option value="minQty">Min Qty</option>
            <option value="maxQty">Max Qty</option>
            <option value="price">Prix</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="number"
            placeholder="Valeur"
            value={bulkValue}
            onChange={(e) => setBulkValue(e.target.value)}
            className="rounded-3"
          />
        </Col>

        <Col md={3}>
          <Button
            variant="danger"
            className="w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
            onClick={handleBulkEdit}
            disabled={selectedItems.length === 0 || bulkValue === ""}
          >
            <i className="fas fa-save"></i> Appliquer
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead className="table-primary">
          <tr>
            <th>Sélection</th>
            <th>Libellé</th>
            <th>Quantité</th>
            <th>Unité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
              <tr key={item._id}>
                <td>
                  <Form.Check
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelect(item._id)}
                  />
                </td>
                <td>{item.libelle}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="d-flex align-items-center gap-2 px-2 py-1 rounded-2"
                    onClick={() => setShowComparison(item._id)}
                  >
                    <i className="fas fa-balance-scale"></i>
                    <span className="d-none d-md-inline">Comparer</span>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Aucun ingrédient trouvé.</td>
            </tr>
          )}
        </tbody>
      </Table>
      {showComparison && (
        <div className="mt-4">
          <h4>Comparaison des Fournisseurs</h4>
          <SupplierComparisonTable ingredientId={showComparison} />
        </div>
      )}
    </div>
  );
}
