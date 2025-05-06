import { Card } from "react-bootstrap";

const ForecastHeader = () => (
  <Card className="p-3 mb-4 bg-light border-0 shadow-sm">
    <h5 className="mb-2">📊 Weekly Purchase Forecast Dashboard</h5>
    <p className="text-muted mb-2">
      This table displays purchase forecasts for the upcoming weeks.
    </p>
  </Card>
);

export default ForecastHeader;
