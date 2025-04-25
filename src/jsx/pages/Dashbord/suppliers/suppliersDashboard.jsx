import React from "react";
import TopSuppliersByDelivery from "../../suppliers/components/TopSuppliersByDelivery";

const SuppliersDashboard = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Suppliers Dashboard</h1>
      <div className="row">
        <div className="col-xl-6 col-lg-12">
          <TopSuppliersByDelivery />
        </div>
      </div>
    </div>
  );
};

export default SuppliersDashboard;