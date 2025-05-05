import React from "react";
import { Row, Col, Alert } from "react-bootstrap";
import { FaWeight, FaDollarSign, FaPercentage, FaPizzaSlice } from "react-icons/fa";
import ChartDonught3 from "../../components/Sego/Home/donught";

const WasteOverview = ({ wasteSummary, wastePercentage }) => {
  if (!wasteSummary?.length) return null;

  const totalWaste = wasteSummary.reduce((acc, i) => acc + (i.totalWaste || 0), 0);
  const totalCost = wasteSummary.reduce((acc, i) => acc + (i.totalCost || 0), 0);

  return (
    <>
      <Row className="mb-4">
        <Col md={4}>
          <Card icon={<FaWeight size={30} color="#EA7A9A" />} title="Total Waste Quantity" value={totalWaste} unit="" />
        </Col>
        <Col md={4}>
          <Card icon={<FaDollarSign size={30} color="#EA7A9A" />} title="Total Waste Cost" value={totalCost} unit="TND" />
        </Col>
        <Col md={4}>
          <Card
            icon={<FaPercentage size={30} color="#EA7A9A" />}
            title="Global Waste Percentage"
            value={wastePercentage?.summary?.globalWastePercentage?.toFixed(2) || 0}
            unit="%"
            showChart
          />
        </Col>
      </Row>

      <h4>Stock Item Breakdown</h4>
      <Row>
        {wasteSummary.map((item, idx) => (
          <Col key={idx} md={4} className="mb-4">
            <div
              className="card"
              style={{
                background: `linear-gradient(135deg, #F6B4AF 0%, #FFE6E6 100%)`,
                border: "none",
                borderRadius: "0.5rem",
                boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <FaPizzaSlice className="me-3" color="#EA7A9A" />
                  <h5>{item.libelle || "Unknown"}</h5>
                </div>
                <p><strong>Quantity:</strong> {item.totalWaste || 0} {item.unit}</p>
                <p><strong>Cost:</strong> {item.totalCost || 0} TND</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

const Card = ({ icon, title, value, unit, showChart }) => (
  <div
    className="card text-white"
    style={{
      background: `linear-gradient(135deg, #f58275 0%, rgb(255, 174, 168) 100%)`,
      border: "none",
      borderRadius: "0.5rem",
      boxShadow: "0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease",
    }}
  >
    <div className="card-body d-flex align-items-center">
      <div className="me-3">{icon}</div>
      <div>
        <h2 className="mb-1">{Number(value).toLocaleString()} {unit}</h2>
        <span>{title}</span>
      </div>
      
    </div>
  </div>
);

export default WasteOverview;