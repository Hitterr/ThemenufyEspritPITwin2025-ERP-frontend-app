// @components/TopSuppliersByDelivery.js
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts";
import {
  Spinner,
  Alert,
  Badge,
  Button,
  Modal,
  Table,
  Container,
  Card,
  Col,
  Row,
} from "react-bootstrap";
import { FiRefreshCw, FiAward, FiList } from "react-icons/fi";
import useSupplierStore from "../../../store/supplierStore";

// Define the TopSuppliersByDelivery component
const TopSuppliersByDelivery = () => {
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showRanking, setShowRanking] = useState(false);

  const { getDeliveryStats } = useSupplierStore();

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = new Date(2025, 0, 1);
      const endDate = new Date(2025, 11, 31);
      const stats = await getDeliveryStats(startDate, endDate);
      const chartData = stats
        .map((s) => {
          const avgDeliveryTime = parseFloat(
            s.averageDeliveryTimeDays.toFixed(1)
          );
          const targetDeliveryTime = 5;
          const onTimePercentage =
            avgDeliveryTime <= targetDeliveryTime
              ? 100
              : Math.max(
                  0,
                  100 -
                    ((avgDeliveryTime - targetDeliveryTime) /
                      targetDeliveryTime) *
                      100
                );
          return {
            name: s.supplierName,
            value: avgDeliveryTime,
            totalDeliveries: s.invoiceCount || 0,
            onTimePercentage: parseFloat(onTimePercentage.toFixed(1)),
            defectsRate: 0,
            rank: 0,
          };
        })
        .sort((a, b) => a.value - b.value)
        .map((item, index) => ({ ...item, rank: index + 1 }));
      setSuppliersData(chartData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err.message || "Failed to fetch supplier data. Please try again."
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const getBarColor = (rank) =>
    rank === 1
      ? "#FFD700"
      : rank === 2
      ? "#C0C0C0"
      : rank === 3
      ? "#CD7F32"
      : "#8884d8";

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip p-3 bg-white border rounded shadow-sm">
        <h6 className="fw-bold mb-2">
          {data.name}{" "}
          {data.rank <= 3 && <Badge bg="success">Top {data.rank}</Badge>}
        </h6>
        <p className="mb-1">
          <strong>Delivery:</strong>{" "}
          <Badge bg="primary">{data.value} days</Badge>
        </p>
        <p className="mb-1">
          <strong>On-Time:</strong>{" "}
          <Badge bg={data.onTimePercentage >= 90 ? "success" : "warning"}>
            {data.onTimePercentage}%
          </Badge>
        </p>
        <p className="mb-1">
          <strong>Orders:</strong>{" "}
          <Badge bg="secondary">{data.totalDeliveries}</Badge>
        </p>
      </div>
    );
  };

  return (
    <div>
      <Card.Header>
        <Row>
          <Col xs={12} className="header-title">
            <h3 className="">Supplier Delivery Performance</h3>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body className="">
        <Row xs={12} className="justify-content-around">
          <Col xs={12} md={6}>
            {" "}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowRanking(true)}
              className="w-100"
            >
              <FiList className="me-1" /> View Full Ranking
            </Button>
          </Col>
          <Col xs={12} md={6}>
            {" "}
            <Button
              variant="outline-primary"
              className="w-100"
              size="sm"
              onClick={fetchSuppliers}
              disabled={loading}
            >
              <FiRefreshCw className={`me-1 ${loading ? "spin" : ""}`} />
              {loading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </Col>
        </Row>
        <p className="text-muted my-3">
          {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </p>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading supplier data...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-2"
              onClick={fetchSuppliers}
            >
              Retry
            </Button>
          </Alert>
        )}

        {!loading && !error && suppliersData.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No supplier delivery data available</p>
            <Button variant="primary" size="sm" onClick={fetchSuppliers}>
              Load Data
            </Button>
          </div>
        )}

        {!loading && !error && suppliersData.length > 0 && (
          <>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={suppliersData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
                >
                  <XAxis
                    type="number"
                    axisLine={{ stroke: "#ddd" }}
                    tickLine={{ stroke: "#ddd" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={0}
                    axisLine={{ stroke: "transparent" }}
                    tickLine={{ stroke: "transparent" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Delivery Time (Days)" barSize={20}>
                    {suppliersData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.rank)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4">
              <h5 className="mb-3 d-flex align-items-center">
                <FiAward className="me-2 text-warning" /> Top Performers
              </h5>
              <Row className="flex-wrap overflow-scroll">
                {suppliersData.slice(0, 3).map((supplier, index) => (
                  <Col xs={12} md={6} key={index} className=" mb-3">
                    <div
                      className={`card h-100 border-0 shadow-sm top-performer-card ${
                        index === 0 ? "border-warning border-2" : ""
                      }`}
                    >
                      <div className="card-body text-center">
                        <Badge
                          pill
                          bg={
                            index === 0
                              ? "warning"
                              : index === 1
                              ? "secondary"
                              : "info"
                          }
                          className="mb-2"
                        >
                          #{index + 1} {index === 0 && "Best"}
                        </Badge>
                        <h5 className="card-title">{supplier.name}</h5>
                        <div className="display-4 text-primary">
                          {supplier.value}
                          <small className="fs-6 text-muted"> days</small>
                        </div>
                        <p className="mb-1">
                          <span className="fw-bold">On-Time:</span>{" "}
                          <Badge
                            bg={
                              supplier.onTimePercentage >= 90
                                ? "success"
                                : "warning"
                            }
                          >
                            {supplier.onTimePercentage}%
                          </Badge>
                        </p>
                        <p className="mb-0">
                          <span className="fw-bold">Orders:</span>{" "}
                          <Badge bg="secondary">
                            {supplier.totalDeliveries}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </Card.Body>

      <Modal
        show={showRanking}
        onHide={() => setShowRanking(false)}
        size="xl"
        centered
        className="modal-fullscreen-lg-down"
      >
        <Modal.Header closeButton className="border-bottom-0">
          <Modal.Title className="d-flex align-items-center">
            <FiAward className="me-2 text-warning" /> Supplier Performance
            Ranking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="table-responsive">
            <Table striped hover className="mb-0 modal-table">
              <thead className="table-light">
                <tr>
                  <th>Rank</th>
                  <th>Supplier</th>
                  <th>Avg. Delivery (Days)</th>
                  <th>On-Time %</th>
                  <th>Total Orders</th>
                </tr>
              </thead>
              <tbody>
                {suppliersData.map((supplier) => (
                  <tr key={supplier.rank}>
                    <td>
                      <Badge
                        pill
                        bg={
                          supplier.rank <= 3
                            ? ["warning", "secondary", "info"][
                                supplier.rank - 1
                              ]
                            : "light"
                        }
                        text="dark"
                      >
                        #{supplier.rank}
                      </Badge>
                    </td>
                    <td className="fw-bold">{supplier.name}</td>
                    <td>{supplier.value}</td>
                    <td>
                      <Badge
                        bg={
                          supplier.onTimePercentage >= 90
                            ? "success"
                            : "warning"
                        }
                      >
                        {supplier.onTimePercentage}%
                      </Badge>
                    </td>
                    <td>{supplier.totalDeliveries}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="secondary" onClick={() => setShowRanking(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TopSuppliersByDelivery;
