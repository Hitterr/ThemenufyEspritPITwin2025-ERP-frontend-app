import { Row, Col, Card } from "react-bootstrap";
import { FaBoxOpen, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SummaryCards = ({ stock, totalForecasted, totalMissing }) => {
  return (
    <Row className="mt-4">
      {/* Stock */}
      <Col md={4}>
        <Card className="text-white border-0 shadow-sm p-3" style={{ background: "linear-gradient(to right, #ea7a9a, #fbb1a5)" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">{stock}</h2>
              <p className="mb-0">Current Stock</p>
            </div>
            <div style={{ width: 60, height: 60 }}>
              <CircularProgressbarWithChildren
                value={100}
                styles={buildStyles({
                  pathColor: "#ffffff",
                  trailColor: "rgba(255, 255, 255, 0.3)",
                })}
              >
                <FaBoxOpen size={25} color="#ea7a9a" />
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </Card>
      </Col>

      {/* Forecasted */}
      <Col md={4}>
        <Card className="text-white border-0 shadow-sm p-3" style={{ background: "linear-gradient(to right, #ea7a9a, #fbb1a5)" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">{totalForecasted.toFixed(2)}</h2>
              <p className="mb-0">Total Forecasted</p>
            </div>
            <div style={{ width: 60, height: 60 }}>
              <CircularProgressbarWithChildren
                value={100}
                styles={buildStyles({
                  pathColor: "#ffffff",
                  trailColor: "rgba(255, 255, 255, 0.3)",
                })}
              >
                <FaChartLine size={25} color="#ea7a9a" />
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </Card>
      </Col>

      {/* Missing */}
      <Col md={4}>
        <Card className="text-white border-0 shadow-sm p-3" style={{ background: "linear-gradient(to right, #ea7a9a, #fbb1a5)" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">{totalMissing.toFixed(2)}</h2>
              <p className="mb-0">Total Missing</p>
            </div>
            <div style={{ width: 60, height: 60 }}>
              <CircularProgressbarWithChildren
                value={23}
                styles={buildStyles({
                  pathColor: "#ffffff",
                  trailColor: "rgba(255, 255, 255, 0.3)",
                })}
              >
                <FaExclamationTriangle size={25} color="#ea7a9a" />
              </CircularProgressbarWithChildren>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
