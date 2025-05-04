import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
    <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
  </div>
);

export default LoadingSpinner;
