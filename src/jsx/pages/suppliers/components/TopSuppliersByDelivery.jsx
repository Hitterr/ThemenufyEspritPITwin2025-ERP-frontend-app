import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  Tooltip, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Cell,
  Legend
} from "recharts";
import { Spinner, Alert, Badge, Button, Modal, Table } from "react-bootstrap";
import { FiRefreshCw, FiAward, FiList } from "react-icons/fi";

const TopSuppliersByDelivery = () => {
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showRanking, setShowRanking] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = new Date(2025, 0, 1);
      const endDate = new Date(2025, 11, 31);
      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      const response = await axios.get("http://localhost:5000/api/supplier/delivery-stats", {
        params: { startDate: startDateStr, endDate: endDateStr },
      });

      const suppliers = response.data.data || [];
      
      const chartData = suppliers
        .filter(supplier => typeof supplier.averageDeliveryTimeDays === "number")
        .map(supplier => ({
          name: supplier.supplierName,
          value: parseFloat(supplier.averageDeliveryTimeDays.toFixed(1)),
          totalDeliveries: supplier.totalDeliveries || 0,
          onTimePercentage: supplier.onTimePercentage ? parseFloat(supplier.onTimePercentage.toFixed(1)) : 0,
          defectsRate: supplier.defectsRate ? parseFloat(supplier.defectsRate.toFixed(1)) : 0,
          rank: 0
        }))
        .sort((a, b) => a.value - b.value)
        .map((item, index) => ({
          ...item,
          rank: index + 1
        }));

      setSuppliersData(chartData);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch supplier delivery stats. Please try again.");
      console.error("Error fetching supplier delivery stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const getBarColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#8884d8'; // Default
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip p-3 bg-white border rounded shadow-sm">
          <h6 className="fw-bold mb-2">
            {data.name} {data.rank <= 3 && <Badge bg="success">Top {data.rank}</Badge>}
          </h6>
          <p className="mb-1">
            <span className="fw-bold">Delivery Time: </span>
            <Badge bg="primary">{data.value} days</Badge>
          </p>
          <p className="mb-1">
            <span className="fw-bold">On-Time Rate: </span>
            <Badge bg={data.onTimePercentage >= 90 ? 'success' : 'warning'}>
              {data.onTimePercentage}%
            </Badge>
          </p>
          <p className="mb-1">
            <span className="fw-bold">Defects Rate: </span>
            <Badge bg={data.defectsRate <= 2 ? 'success' : 'danger'}>
              {data.defectsRate}%
            </Badge>
          </p>
          <p className="mb-0">
            <span className="fw-bold">Total Orders: </span>
            <Badge bg="secondary">{data.totalDeliveries}</Badge>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom-0">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h4 className="mb-1 text-primary">Supplier Delivery Performance</h4>
            <p className="text-muted mb-0">
              {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
          <div>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => setShowRanking(true)}
              className="me-2"
            >
              <FiList className="me-1" />
              View Full Ranking
            </Button>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={fetchSuppliers}
              disabled={loading}
            >
              <FiRefreshCw className={`me-1 ${loading ? 'spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
      </div>
      <div className="card-body pt-0">
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
          <div>
            <div style={{ height: '500px', overflowY: 'auto' }}>
              <ResponsiveContainer width="100%" height={suppliersData.length * 25}>
                <BarChart
                  data={suppliersData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
                  layout="vertical"
                >
                  <XAxis 
                    type="number" 
                    axisLine={{ stroke: '#ddd' }}
                    tickLine={{ stroke: '#ddd' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={0}
                    axisLine={{ stroke: 'transparent' }}
                    tickLine={{ stroke: 'transparent' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Delivery Time (Days)"
                    barSize={20}
                  >
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
                <FiAward className="me-2 text-warning" />
                Top Performers
              </h5>
              <div className="row">
                {suppliersData.slice(0, 3).map((supplier, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <div className={`card h-100 border-0 shadow-sm ${index === 0 ? 'border-warning border-2' : ''}`}>
                      <div className="card-body text-center">
                        <Badge 
                          pill 
                          bg={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'info'} 
                          className="mb-2"
                        >
                          #{index + 1} {index === 0 && 'Best'}
                        </Badge>
                        <h5 className="card-title">{supplier.name}</h5>
                        <div className="display-4 text-primary">
                          {supplier.value}
                          <small className="fs-6 text-muted"> days</small>
                        </div>
                        <p className="mb-1">
                          <span className="fw-bold">On-Time: </span>
                          <Badge bg={supplier.onTimePercentage >= 90 ? 'success' : 'warning'}>
                            {supplier.onTimePercentage}%
                          </Badge>
                        </p>
                        <p className="mb-0">
                          <span className="fw-bold">Defects: </span>
                          <Badge bg={supplier.defectsRate <= 2 ? 'success' : 'danger'}>
                            {supplier.defectsRate}%
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Ranking Modal */}
      <Modal
        show={showRanking}
        onHide={() => setShowRanking(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiAward className="me-2" />
            Supplier Performance Ranking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Supplier</th>
                  <th>Avg. Delivery (Days)</th>
                  <th>On-Time %</th>
                  <th>Defects %</th>
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
                          supplier.rank === 1 ? 'warning' : 
                          supplier.rank === 2 ? 'secondary' : 
                          supplier.rank === 3 ? 'info' : 'light'
                        }
                        text="dark"
                      >
                        #{supplier.rank}
                      </Badge>
                    </td>
                    <td className="fw-bold">{supplier.name}</td>
                    <td>{supplier.value}</td>
                    <td>
                      <Badge bg={supplier.onTimePercentage >= 90 ? 'success' : 'warning'}>
                        {supplier.onTimePercentage}%
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={supplier.defectsRate <= 2 ? 'success' : 'danger'}>
                        {supplier.defectsRate}%
                      </Badge>
                    </td>
                    <td>{supplier.totalDeliveries}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRanking(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TopSuppliersByDelivery;