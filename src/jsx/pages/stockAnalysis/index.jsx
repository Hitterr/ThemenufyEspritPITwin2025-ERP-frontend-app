import ChartDonught3 from "../../components/Sego/Analytics/DoughnutChart3";
import { Card, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import ActivityLineChart from "../../components/Sego/Home/ActivityLineChart";
import { useState, useEffect } from "react";
import { apiRequest } from "../../utils/apiRequest";
import {
  Box,
  Boxes,
  CircleDollarSign,
  Coins,
  DollarSign,
  Eye,
  FileWarning,
  Pencil,
  PencilIcon,
  Table2,
  TriangleAlert,
  X,
} from "lucide-react";
import ApexBar2 from "../../components/charts/apexcharts/Bar2";
import StockPerCategory from "./components/StockPerCategory";
export const StockAnalysis = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest
      .get("/stock/stats")
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data);
        } else {
          throw new Error("Failed to fetch stats");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">Error: {error}</div>;
  }

  return (
    <Card className="stock-analysis p-5">
      <Card.Header className="d-flex align-items-center mb-4">
        <h1 className="mb-0">Stock Analysis</h1>
        <div className="ms-auto">
          <Link to="/stock" className="btn btn-secondary">
            <Boxes />
          </Link>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          {/* Overview Stats */}
          <Col xl={4} lg={6} md={6}>
            <div className="card bg-info  shadow">
              <div className="card-body ">
                <div className="media align-items-center">
                  <div className="media-body me-2">
                    <h2 className="text-white font-w600 fs-2 ">
                      {stats?.totalStocks || 0}
                    </h2>
                    <span className="text-white">Total Stock Count</span>
                  </div>
                  <div className="d-inline-block position-relative donut-chart-sale">
                    <ChartDonught3
                      backgroundColor="#FFFFFF"
                      backgroundColor2="#72D9F1"
                      height="100"
                      width="100"
                      value={100}
                    />
                    <small className="text-primary">
                      <Box size={40} color="#fff" />
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Low stock count */}
          <Col xl={4} lg={6} md={6}>
            <div className="card bg-warning shadow">
              <div className="card-body">
                <div className="media align-items-center">
                  <div className="media-body me-2">
                    <h2 className="text-white font-w600 fs-2 ">
                      {stats?.lowStockCount || 0}
                    </h2>
                    <span className="text-white">Low Stock Count </span>
                  </div>
                  <div className="d-inline-block position-relative donut-chart-sale">
                    <ChartDonught3
                      backgroundColor="#FFFFFF"
                      backgroundColor2="#FC9A83"
                      height="100"
                      width="100"
                      value={(stats?.lowStockCount / stats?.totalStocks) * 100}
                    />
                    <small className="text-primary">
                      <TriangleAlert size={40} color="#fff" />
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          {/* Out of stock count */}
          <Col xl={4} lg={6} md={6}>
            <div className="card bg-danger shadow">
              <div className="card-body">
                <div className="media align-items-center">
                  <div className="media-body me-2">
                    <h2 className="text-white font-w600 fs-2 ">
                      {stats?.outOfStockCount || 0}
                    </h2>
                    <span className="text-white">Out of Stock Count </span>
                  </div>
                  <div className="d-inline-block position-relative donut-chart-sale">
                    <ChartDonught3
                      backgroundColor="#FFFFFF"
                      backgroundColor2="#F77FA9"
                      height="100"
                      width="100"
                      value={
                        (stats?.outOfStockCount / stats?.totalStocks) * 100
                      }
                    />
                    <small className="text-primary">
                      <X size={40} color="#fff" />
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          {/* Stock Value Chart */}
          <Col xl={7}>
            <Card>
              <Card.Header>
                <Card.Title>Stock Value by Category</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  {stats?.stockValuePerCategory.map((cat, index) => (
                    <div key={index} className="text-center">
                      <h4>{cat.category}</h4>
                      <p>${new Intl.NumberFormat().format(cat.value)}</p>
                    </div>
                  ))}
                </div>
                <StockPerCategory data={stats?.stockPerCategory} />
              </Card.Body>
            </Card>
          </Col>

          {/* Most Expensive */}
          <Col xl={5}>
            <Card>
              <Card.Header>
                <Card.Title>Most Expensive</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.mostExpensive.map((item, index) => (
                      <tr key={index}>
                        <td>{item.libelle}</td>
                        <td>{item.price.toFixed(3)}</td>
                        <td>
                          <Link
                            to={`/stock/${item._id}`}
                            className="btn btn-info btn-sm"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          {/* Low Stock Alert */}
          <Col xl={6}>
            <Card>
              <Card.Header>
                <Card.Title>Low Stock Alert</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Current Qty</th>
                      <th>Min Qty</th>
                      <th>Unit</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockList.map((item, index) => (
                      <tr key={index}>
                        <td>{item.libelle}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.quantity === 0 ? "bg-danger" : "bg-warning"
                            }`}
                          >
                            {item.quantity}
                          </span>
                        </td>
                        <td>{item.minQty}</td>
                        <td>{item.unit}</td>
                        <td>
                          <Link
                            to={`/stock/${item._id}`}
                            className="btn btn-warning btn-sm"
                          >
                            <PencilIcon size={15} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Recently Updated */}
          <Col xl={6}>
            <Card>
              <Card.Header>
                <Card.Title>Recently Updated Items</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Last Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentlyUpdated.map((item, index) => (
                      <tr key={index}>
                        <td>{item.libelle}</td>
                        <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                        <td>
                          <Link
                            to={`/stock/${item._id}`}
                            className="btn btn-info btn-sm"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StockAnalysis;
