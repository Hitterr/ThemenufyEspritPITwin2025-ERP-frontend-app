import React, { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";
import { Col, Row, Button, Form } from "react-bootstrap";
import Logo from "../../../assets/images/logo.png";
import useInvoiceStore from "../../store/invoiceStore";
import useIngredientStore from "../../store/ingredientStore";
import { useParams } from "react-router-dom";
import useSupplierStore from "../../store/supplierStore";
import { authStore } from "../../store/authStore";
import { jsPDF } from "jspdf";
import generatePDF from "./components/InvoicePdf";

export const ShowInvoice = () => {
  const {
    invoices,
    currentInvoice,
    fetchInvoiceById,
    updateInvoiceStatus,
    updatePaidInvoiceStatus,
  } = useInvoiceStore();
  const { ingredients } = useIngredientStore();
  const params = useParams();
  const { currentUser } = authStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  const [status, setStatus] = useState(currentInvoice?.status || "");
  const [paidStatus, setPaidStatus] = useState(
    currentInvoice?.paidStatus || ""
  );

  // Récupération des données de la facture via le paramètre ID
  useEffect(() => {
    if (params.id) {
      fetchInvoiceById(params.id);
    }
  }, [params.id, fetchInvoiceById]);

  useEffect(() => {
    if (currentInvoice) {
      setStatus(currentInvoice.status);
      setPaidStatus(currentInvoice.paidStatus);
    }
  }, [currentInvoice]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateInvoiceStatus(currentInvoice._id, newStatus);
  };

  const handlePaidStatusChange = async (e) => {
    const newPaidStatus = e.target.value;
    if (newPaidStatus !== paidStatus) {
      setPaidStatus(newPaidStatus);
      try {
        const response = await updatePaidInvoiceStatus(
          currentInvoice._id,
          newPaidStatus
        );
        if (response.success) {
          await fetchInvoiceById(currentInvoice._id);
        }
      } catch (error) {
        console.error("Error updating paid status", error);
      }
    }
  };

  if (!currentInvoice._id) {
    return <p>Loading ...</p>;
  }

  return (
    <Fragment>
      <Row className="my-4 gap-y-2">
        <Col xs="12" className="">
          <h1 className="page-title">Invoice Details</h1>
        </Col>
      </Row>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <Row className="justify-content-around">
              <Col xs={8} className="mb-3 p-5">
                <img src={Logo} className="thumbnail w-100" alt="Logo" />
              </Col>
            </Row>

            <div className="card-header">
              <strong>Invoice: #{currentInvoice?.invoiceNumber}</strong>
              <strong className="ms-3">
                {format(new Date(currentInvoice?.createdAt), "dd-MM-yyyy")}
              </strong>
              <div className="mt-2">
                <span
                  className={`badge bg-${
                    currentInvoice?.status === "pending"
                      ? "warning"
                      : currentInvoice?.status === "delivered"
                      ? "success"
                      : "danger"
                  }`}
                >
                  {currentInvoice?.status?.toUpperCase()}
                </span>
              </div>

              {/* Status Dropdown */}
              <Form.Group className="mt-2">
                <Form.Label>Change Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={handleStatusChange}
                  disabled={currentInvoice?.status === "delivered"}
                >
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Control>
              </Form.Group>

              {/* Paid Status Dropdown */}
              <Form.Group className="mt-2">
                <Form.Label>Paid Status</Form.Label>
                <Form.Control
                  as="select"
                  value={paidStatus}
                  onChange={handlePaidStatusChange}
                >
                  <option value="nopaid">Not Paid</option>
                  <option value="paid">Paid</option>
                </Form.Control>
              </Form.Group>
            </div>

            <div className="card-body">
              <Row className="justify-content-between w-100 border-bottom">
                <Col xs={6} md={4} className="mb-3">
                  <h6>From:</h6>
                  <div>
                    <strong>The Menufy</strong>
                  </div>
                  <div>
                    Created By: {currentInvoice?.created_by?.firstName}{" "}
                    {currentInvoice?.created_by?.lastName}
                  </div>
                  <div>Email: {currentInvoice?.created_by?.email}</div>
                  <div>Address:{currentUser?.user?.address || "N/A"}</div>
                  <div>Phone: {currentUser?.user?.phone || "N/A"}</div>
                </Col>
                <Col xs={6} md={4} className="mb-3">
                  <h6>To:</h6>
                  <div>
                    <strong>{currentInvoice?.supplier?.name}</strong>
                  </div>
                  <div>
                    Attn:{" "}
                    {currentInvoice?.supplier?.contact?.representative || "N/A"}
                  </div>
                  <div>{currentInvoice?.supplier?.address?.city || "N/A"}</div>
                  <div>
                    Email: {currentInvoice?.supplier?.contact?.email || "N/A"}
                  </div>
                  <div>
                    Phone: {currentInvoice?.supplier?.contact?.phone || "N/A"}
                  </div>
                </Col>
              </Row>
              <div className="table-responsive mt-4">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="center">#</th>
                      <th>Item</th>
                      <th className="right">Unit Cost</th>
                      <th className="center">Qty</th>
                      <th className="right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice?.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="center">{index + 1}</td>
                        <td className="left">
                          {
                            ingredients.find(
                              (ing) => ing._id === item.ingredient
                            )?.libelle
                          }
                        </td>
                        <td className="right">{item?.price} TND</td>
                        <td className="right">{item?.quantity} UNIT</td>
                        <td className="right">
                          {item?.price * item?.quantity} TND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row">
                <div className="col-lg-4 col-sm-5"> </div>
                <div className="col-lg-4 col-sm-5 ms-auto">
                  <table className="table table-clear">
                    <tbody>
                      <tr>
                        <td className="left">
                          <strong>Subtotal</strong>
                        </td>
                        <td className="right">
                          {currentInvoice?.total?.toFixed(3)} TND
                        </td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong>TVA (19%)</strong>
                        </td>
                        <td className="right">
                          {(currentInvoice?.total * 0.19)?.toFixed(3)} TND
                        </td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong>Total</strong>
                        </td>
                        <td className="right">
                          <strong>
                            {(currentInvoice?.total * 1.19)?.toFixed(3)} TND
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() =>
                  generatePDF(currentInvoice, currentUser, ingredients)
                }
              >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShowInvoice;
