import React from "react";
import TopSuppliersByDelivery from "../../suppliers/components/TopSuppliersByDelivery";
import SupplierStats from "../../suppliers/components/SupplierStats";

const SuppliersDashboard = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Suppliers Dashboard</h1>
      <div className="row">
        <div className="col-xl-6 col-lg-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h4 className="text-black fs-20">Supplier Statistics</h4>
              <p className="fs-13 mb-0 text-black">Overview of supplier performance</p>
            </div>
            <div className="card-body">
              <SupplierStats showStats={true} />
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-12 mb-4">
          <TopSuppliersByDelivery />
        </div>
      </div>
    </div>
  );
};

export default SuppliersDashboard;