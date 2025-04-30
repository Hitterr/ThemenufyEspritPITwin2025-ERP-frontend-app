import { useEffect, useState } from "react"; // Added useState for loading state
import { Row, Col } from "react-bootstrap";
import ChartDonught2 from "../../../../jsx/components/Sego/Home/donught2";
import useSupplierStore from "../../../store/supplierStore";

const SupplierStats = ({ showStats }) => {
  const { globalStats, fetchGlobalStats } = useSupplierStore();
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        await fetchGlobalStats();
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [fetchGlobalStats]);

  // Helper to calculate percentage safely
  const calcPercentage = (value, total) => {
    return total ? Math.round((value / total) * 100) : 0;
  };

  // Calculate restaurants linked percentage (assuming max 50 restaurants = 100%)
  const maxRestaurants = 50; // Explicit max for clarity
  const restaurantsLinkedPercentage = calcPercentage(
    globalStats.totalRestaurantsLinked,
    maxRestaurants
  );

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <>
      {showStats && (
        <Row className="gap-4 p-5 justify-content-around">
          {/* Total Suppliers */}
          <Col xs={12} sm={4} lg={3} className="">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#4A90E2"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={100} // Total Suppliers always 100% since it's the total
                />
                <small className="text-black">100%</small>
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
          <Col xs={12} sm={4} lg={3} className="">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#27AE60"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={calcPercentage(globalStats.active, globalStats.total)}
                />
                <small className="text-black">
                  {calcPercentage(globalStats.active, globalStats.total)}%
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
          <Col xs={12} sm={4} lg={3} className="">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#F39C12"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={calcPercentage(globalStats.pending, globalStats.total)}
                />
                <small className="text-black">
                  {calcPercentage(globalStats.pending, globalStats.total)}%
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
          <Col xs={12} sm={4} lg={3} className="">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#E74C3C"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={calcPercentage(
                    globalStats.suspended,
                    globalStats.total
                  )}
                />
                <small className="text-black">
                  {calcPercentage(globalStats.suspended, globalStats.total)}%
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
          <Col xs={12} sm={4} lg={3} className="">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#7F8C8D"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={calcPercentage(
                    globalStats.inactive,
                    globalStats.total
                  )}
                />
                <small className="text-black">
                  {calcPercentage(globalStats.inactive, globalStats.total)}%
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
          <Col xs={12} sm={4} lg={3} className="">
            <div className="media align-items-center">
              <div className="d-inline-block me-3 position-relative donut-chart-sale2">
                <ChartDonught2
                  backgroundColor="#8E44AD"
                  backgroundColor2="#FAFAFA"
                  height="100"
                  width="100"
                  value={restaurantsLinkedPercentage}
                />
                <small className="text-black">
                  {restaurantsLinkedPercentage}%
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
