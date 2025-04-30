import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Button, Modal } from "react-bootstrap";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TurnoverTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/inventory/turnover")
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, []);

  const handleAdjustPar = async (id, min, max) => {
    const newMin = prompt("Nouveau minQty :", min);
    const newMax = prompt("Nouveau maxQty :", max);
    if (!newMin || !newMax) return;

    try {
      await axios.patch(`http://localhost:5000/api/stock/${id}`, {
        minQty: Number(newMin),
        maxQty: Number(newMax),
      });
      alert("Par ajusté.");
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleShowGraph = async (id, name) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/inventory/turnover/history/${id}`
      );
      setChartData(res.data.data);
      setSelectedStock(name);
      setShowChart(true);
    } catch (err) {
      console.error("Erreur lors du chargement du graphique:", err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      {data.some((d) => d.turnoverRate < 0.2 || d.holdingCostPerDay > 50) && (
        <Alert variant="warning">
          ⚠️ Certains ingrédients ont une faible rotation ou un coût de stockage
          élevé.
        </Alert>
      )}

      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Quantité</th>
            <th>Min / Max</th>
            <th>Prix</th>
            <th>Rotation</th>
            <th>Coût/jour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((i) => (
            <tr key={i._id}>
              <td>{i.name}</td>
              <td>{i.quantity}</td>
              <td>
                {i.minQty} / {i.maxQty}
              </td>
              <td>{i.price} €</td>
              <td>{i.turnoverRate}</td>
              <td>{i.holdingCostPerDay} €</td>
              <td className="d-flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleAdjustPar(i._id, i.minQty, i.maxQty)}
                >
                  Ajuster Par
                </Button>
                <Button
                  size="sm"
                  variant="outline-info"
                  onClick={() => handleShowGraph(i._id, i.name)}
                >
                  📊 Courbe
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de graphique */}
      <Modal
        show={showChart}
        onHide={() => setShowChart(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📈 Courbe de consommation : {selectedStock}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalQty"
                stroke="#007bff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Modal.Body>
      </Modal>
    </>
  );
}
