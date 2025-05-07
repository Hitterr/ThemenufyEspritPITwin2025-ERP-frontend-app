import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";

// Page title
import PageTitle from "../../../layouts/PageTitle";

// Widgets (importés mais pas utilisés ici – à inclure selon besoin)
import TopProducts1 from "../../WidgetBasic/TopProducts1";
import TopProducts2 from "../../WidgetBasic/TopProducts2";
import WeeklySales1 from "../../WidgetBasic/WeeklySales1";
import WeeklySales2 from "../../WidgetBasic/WeeklySales2";
import AllSell1 from "../../WidgetBasic/AllSell1";
import AllSell2 from "../../WidgetBasic/AllSell2";

// Bootstrap
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { useEffect } from "react";
import useInvoiceStore from "../../../store/invoiceStore";
import { format } from "date-fns";
export const InvoiceTimeline = () => {
  const params = useParams();
  const idInv = params.id;
  const { fetchInvoiceById, currentInvoice } = useInvoiceStore();
  useEffect(() => {
    if (idInv) fetchInvoiceById(idInv);
  }, [idInv]);
  console.log(currentInvoice);

  if (!currentInvoice) return <h2>Loading .... </h2>;
  return (
    <div className="col-12 ">
      <div className="card">
        <div className="card-header border-0 pb-0">
          <h4 className="card-title">
            Invoice Number : # {currentInvoice?.invoiceNumber}
          </h4>
        </div>
        <div className="card-body p-0">
          <div
            style={{ height: "370px" }}
            id="DZ_W_TimeLine1"
            className="widget-timeline dz-scroll style-1 height370 my-4 px-4"
          >
            <ul className="timeline">
              {currentInvoice?.createdAt && (
                <li>
                  <div className="timeline-badge primary"></div>
                  <Link
                    className="timeline-panel text-muted"
                    to="/widget-basic"
                  >
                    <span>
                      {format(
                        new Date(currentInvoice?.createdAt),
                        "dd-MM-yyyy"
                      )}
                    </span>
                    <h6 className="mb-0">
                      Status <strong className="text-success">Created</strong>.
                    </h6>
                  </Link>
                </li>
              )}
              {currentInvoice?.createdAt && (
                <li>
                  <div className="timeline-badge info"></div>
                  <Link
                    className="timeline-panel text-muted"
                    to="/widget-basic"
                  >
                    <span>
                      {format(
                        new Date(currentInvoice?.createdAt),
                        "dd-MM-yyyy"
                      )}
                    </span>
                    <h6 className="mb-0">
                      New Invoice Created
                      <strong className="text-info"> Pending...</strong>
                    </h6>
                    <p className="mb-0">Not Paid</p>
                  </Link>
                </li>
              )}
              {currentInvoice?.deliveredAt && (
                <li>
                  <div className="timeline-badge danger"></div>
                  <Link
                    className="timeline-panel text-muted"
                    to="/widget-basic"
                  >
                    <span>
                      {" "}
                      {format(
                        new Date(currentInvoice?.deliveredAt),
                        "dd-MM-yyyy"
                      )}
                    </span>
                    <h6 className="mb-0">
                      Order Delivered.
                      <strong className="text-warning"> Delivered</strong>
                    </h6>
                  </Link>
                </li>
              )}
              {currentInvoice?.paidStatus?.toLowerCase() == "paid" && (
                <li>
                  <div className="timeline-badge danger"></div>
                  <Link
                    className="timeline-panel text-muted"
                    to="/widget-basic"
                  >
                    <span>
                      {" "}
                      {format(
                        new Date(currentInvoice?.deliveredAt),
                        "dd-MM-yyyy"
                      )}
                    </span>
                    <h6 className="mb-0">
                      Order Paid.
                      <strong className="text-warning"> Paid</strong>
                    </h6>
                  </Link>
                </li>
              )}
              {currentInvoice?.status &&
                currentInvoice?.status?.toLowerCase() == "cancelled" && (
                  <li>
                    <div className="timeline-badge danger"></div>
                    <Link
                      className="timeline-panel text-muted"
                      to="/widget-basic"
                    >
                      <span>
                        {" "}
                        {format(
                          new Date(currentInvoice?.updatedAt),
                          "dd-MM-yyyy"
                        )}
                      </span>
                      <h6 className="mb-0">
                        Order Canceled.
                        <strong className="text-warning"> Canceled</strong>
                      </h6>
                    </Link>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTimeline;
