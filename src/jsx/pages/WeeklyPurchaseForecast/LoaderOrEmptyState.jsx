import { Spinner } from "react-bootstrap";

const LoaderOrEmptyState = ({ loading, weeklyData }) => {
  if (loading) return <div className="text-center"><Spinner animation="border" /></div>;
  if (weeklyData.length === 0) return <p className="text-center text-muted">No data available.</p>;
  return null;
};

export default LoaderOrEmptyState;
