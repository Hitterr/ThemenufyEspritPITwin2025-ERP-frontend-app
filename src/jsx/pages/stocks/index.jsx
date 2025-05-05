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
import StockFilters from "./components/StockFilters";
import AddStock from "./AddStock";
import EditStock from "./EditStock";
import useStockStore from "../../store/stockStore";
import { BarChart, ChartArea, ChartColumnIncreasing, Eye } from "lucide-react";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 10;
const Stocks = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { stocks, pagination, filteredStocks, fetchStocks, loading } =
    useStockStore();
  // Socket connection for real-time updates
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("stock-update", () => {
      fetchStocks(page);
    });
    socket.on("stock-alert", (data) => {
      toast.warning(
        <div>
          <strong>{data.stock.libelle}</strong>
          <br />
          Current Quantity: {data.stock.quantity} {data.stock.unit}
          <br />
          Min Quantity: {data.stock.minQty} {data.stock.unit}
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
    fetchStocks(page);
    console.log(stocks); // Ajoutez cette ligne pour afficher les données dans la console
  }, [page]);
  // Delete stock mutation
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
        await apiRequest.delete(`/stock/${id}`);
        queryClient.invalidateQueries(["stocks"]);
        Swal.fire("Deleted!", "Stock has been deleted.", "success");
        await fetchStocks(page);
      } catch (error) {
        Swal.fire("Error!", "Failed to delete stock.", "error");
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
              <AddStock />
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
              <StockFilters onClose={() => setShowFilters(false)} />
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
                {filteredStocks.map((stock) => (
                  <tr key={stock._id}>
                    <td>{stock.libelle}</td>
                    <td>{stock?.type?.name || "-"}</td>
                    <td className="text-capitalize">
                      {stock.quantity} {stock.unit}
                    </td>
                    <td>${stock.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          stock.disponibility ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {stock.disponibility ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2 row-cols-3">
                        <Col>
                          {" "}
                          <Link
                            to={`/stock/${stock._id}`}
                            style={{ color: "white" }}
                          >
                            <Button variant="info" size="sm">
                              <Eye size={15} />
                            </Button>
                          </Link>
                        </Col>
                        <Col>
                          {" "}
                          <EditStock idIng={stock._id} />
                        </Col>
                        <Col>
                          {" "}
                          <Button
                            variant="danger"
                            size="sm"
                            title="Delete"
                            onClick={() => handleDelete(stock._id)}
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
export default Stocks;
