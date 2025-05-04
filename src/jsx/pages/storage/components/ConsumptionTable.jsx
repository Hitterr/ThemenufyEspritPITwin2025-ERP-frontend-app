import React from 'react';
import { FaStore, FaCarrot, FaUtensils, FaCalendarAlt } from 'react-icons/fa';

const ConsumptionTable = ({ consumptions }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="bg-light">
          <tr>
            <th className="ps-4" style={{ width: "25%" }}>
              <div className="d-flex align-items-center">
                <FaStore className="text-primary me-2" /> Restaurant
              </div>
            </th>
            <th style={{ width: "25%" }}>
              <div className="d-flex align-items-center">
                <FaCarrot className="text-success me-2" /> Stock
              </div>
            </th>
            <th style={{ width: "25%" }}>
              <div className="d-flex align-items-center">
                <FaUtensils className="text-warning me-2" /> Order
              </div>
            </th>
            <th style={{ width: "15%" }}>Quantity</th>
            <th style={{ width: "10%" }}>
              <div className="d-flex align-items-center">
                <FaCalendarAlt className="text-info me-2" /> Date
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {consumptions.map((consumption) => (
            <ConsumptionRow key={consumption._id} consumption={consumption} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ConsumptionRow = ({ consumption }) => {
  return (
    <tr className="hover-bg-light">
      <td className="ps-4">
        <div className="d-flex align-items-center">
          <div className="icon-shape icon-sm bg-primary bg-opacity-10 text-primary rounded-circle me-3">
            <FaStore />
          </div>
          <div>
            <h6 className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>
              {consumption.restaurantId?.nameRes || "Unknown"}
            </h6>
            <small className="text-muted">
              ID: {consumption.restaurantId?._id || "N/A"}
            </small>
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="icon-shape icon-sm bg-success bg-opacity-10 text-success rounded-circle me-3">
            <FaCarrot />
          </div>
          <div>
            <h6 className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>
              {consumption.stockId?.libelle || "Unknown"}
            </h6>
            <small className="text-muted">
              {consumption.stockId?.category || "N/A"}
            </small>
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="icon-shape icon-sm bg-warning bg-opacity-10 text-warning rounded-circle me-3">
            <FaUtensils />
          </div>
          <div>
            <h6 className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>
              Order #{consumption.ordreId?.orderNb || "Unknown"}
            </h6>
            <small className="text-muted">
              {consumption.ordreId
                ? new Date(consumption.ordreId.date).toLocaleDateString()
                : "N/A"}
            </small>
          </div>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="progress flex-grow-1 me-2" style={{ height: "6px" }}>
            <div
              className="progress-bar bg-warning"
              role="progressbar"
              style={{ width: `${Math.min(100, consumption.qty)}%` }}
            />
          </div>
          <span className="fw-bold">
            {consumption.qty} {consumption.stockId?.unit || "units"}
          </span>
        </div>
      </td>
      <td>
        <div className="d-flex flex-column">
          <span className="fw-bold">
            {new Date(consumption.createdAt).toLocaleDateString()}
          </span>
          <small className="text-muted">
            {new Date(consumption.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        </div>
      </td>
    </tr>
  );
};

export default ConsumptionTable;