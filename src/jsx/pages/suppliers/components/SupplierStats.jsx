import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import ChartDonught2 from "../../../../jsx/components/Sego/Home/donught2";
import useSupplierStore from "../../../store/supplierStore";

const SupplierStats = ({ showStats }) => {
  const { globalStats } = useSupplierStore();

  return (
    <>
      {showStats && (
        <Row className="mb-4">
          {/* Total Suppliers */}
          <Col xs={12} sm={2} className="mb-sm-0 mb-3">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#4A90E2"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={Math.min((globalStats.total / 100) * 100, 100)}
                />
                <small className="text-black">
                  {globalStats.total}%
                </small>
              </div>
              <div>
                <h4 className="fs-28 font-w600 text-black mb-0">
                  {globalStats.total}
                </h4>
                <span>Total Suppliers</span>
              </div>
            </div>
          </Col>
          
          {/* Active Suppliers */}
          <Col xs={12} sm={2} className="mb-sm-0 mb-3">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#27AE60"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={Math.min((globalStats.active / globalStats.total) * 100 || 0, 100)}
                />
                <small className="text-black">
                  {Math.round((globalStats.active / globalStats.total) * 100) || 0}%
                </small>
              </div>
              <div>
                <h4 className="fs-28 font-w600 text-black mb-0">
                  {globalStats.active}
                </h4>
                <span>Active Suppliers</span>
              </div>
            </div>
          </Col>

          {/* Pending Suppliers */}
          <Col xs={12} sm={2} className="mb-sm-0 mb-3">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#F39C12"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={Math.min((globalStats.pending / globalStats.total) * 100 || 0, 100)}
                />
                <small className="text-black">
                  {Math.round((globalStats.pending / globalStats.total) * 100) || 0}%
                </small>
              </div>
              <div>
                <h4 className="fs-28 font-w600 text-black mb-0">
                  {globalStats.pending}
                </h4>
                <span>Pending Suppliers</span>
              </div>
            </div>
          </Col>

          {/* Suspended Suppliers */}
          <Col xs={12} sm={2} className="mb-sm-0 mb-3">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#E74C3C"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={Math.min((globalStats.suspended / globalStats.total) * 100 || 0, 100)}
                />
                <small className="text-black">
                  {Math.round((globalStats.suspended / globalStats.total) * 100) || 0}%
                </small>
              </div>
              <div>
                <h4 className="fs-28 font-w600 text-black mb-0">
                  {globalStats.suspended}
                </h4>
                <span>Suspended Suppliers</span>
              </div>
            </div>
          </Col>

          {/* Inactive Suppliers */}
          <Col xs={12} sm={2} className="mb-sm-0 mb-3">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#7F8C8D"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={Math.min((globalStats.inactive / globalStats.total) * 100 || 0, 100)}
                />
                <small className="text-black">
                  {Math.round((globalStats.inactive / globalStats.total) * 100) || 0}%
                </small>
              </div>
              <div>
                <h4 className="fs-28 font-w600 text-black mb-0">
                  {globalStats.inactive}
                </h4>
                <span>Inactive Suppliers</span>
              </div>
            </div>
          </Col>

          {/* Restaurants Linked */}
          <Col xs={12} sm={2} className="mb-sm-0 mb-3">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#8E44AD"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={Math.min((globalStats.totalRestaurantsLinked / 50) * 100, 100)}
                />
                <small className="text-black">
                  {Math.round((globalStats.totalRestaurantsLinked / 50) * 100)}%
                </small>
              </div>
              <div>
                <h4 className="fs-28 font-w600 text-black mb-0">
                  {globalStats.totalRestaurantsLinked}
                </h4>
                <span>Restaurants Linked</span>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default SupplierStats;