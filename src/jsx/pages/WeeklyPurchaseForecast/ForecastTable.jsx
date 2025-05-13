import React, { useState } from "react";
import { Card, Table, Pagination } from "react-bootstrap";
import { formatDate } from "../../utils/formatDate";

const ForecastTable = ({ weeklyData, unit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(weeklyData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = weeklyData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title className="mb-0">Weekly Forecast Details</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table className="table-hover">
            <thead>
              <tr>
                <th>Week (Start)</th>
                <th>Predicted Quantity</th>
                <th>Missing Quantity</th>
                <th>Urgency Status</th>
                <th>Quantity to Order</th>
                <th>Estimated Cost</th>
                <th>Variance vs Stock</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((data, index) => (
                <tr key={index}>
                  <td>{formatDate(data.week)}</td>
                  <td>{data.predictedQty} {unit}</td>
                  <td>{data.missingQty} {unit}</td>
                  <td>
                    <span
                      className={`badge ${data.isUrgent ? "bg-danger" : "bg-success"}`}
                    >
                      {data.isUrgent ? "Urgent" : "Not Urgent"}
                    </span>
                  </td>
                  <td>{data.quantityToOrder} {unit}</td>
                  <td>{data.estimatedCost} TND</td>
                  <td style={{ color: data.varianceVsStock < 0 ? "red" : "green" }}>
                    {data.varianceVsStock} {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {totalPages > 1 && (
  <div className="d-flex justify-content-between align-items-center mt-3 px-3">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      style={{
        backgroundColor: "#F37C6C",
        color: "white",
        border: "none",
        padding: "8px 20px",
        borderRadius: "10px",
        cursor: currentPage === 1 ? "not-allowed" : "pointer",
        opacity: currentPage === 1 ? 0.5 : 1,
      }}
    >
      Prev
    </button>

    <span style={{ fontWeight: 500 }}>
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      style={{
        backgroundColor: "#F37C6C",
        color: "white",
        border: "none",
        padding: "8px 20px",
        borderRadius: "10px",
        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        opacity: currentPage === totalPages ? 0.5 : 1,
      }}
    >
      Next
    </button>
  </div>
)}


      </Card.Body>
    </Card>
  );
};

export default ForecastTable;
