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

  // Fonction pour générer le PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    const marginLeft = 10; // gauche pour "From"
    const marginRight = 110; // droite pour "To"
    const startY = 100; // position Y de départ
    const lineHeight = 10; // espace entre les lignes

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Adding Logo
    doc.addImage(Logo, "PNG", 10, 10, 50, 50);

    // Title and Invoice Info
    doc.text(`Invoice: #${currentInvoice?.invoiceNumber}`, 10, 60);
    doc.text(
      `Date: ${format(new Date(currentInvoice?.createdAt), "dd-MM-yyyy")}`,
      10,
      70
    );
    doc.text(`Status: ${currentInvoice?.status?.toUpperCase()}`, 10, 80);
    doc.text(
      `Paid Status: ${currentInvoice?.paidStatus?.toUpperCase()}`,
      10,
      90
    );

    // Sender and Recipient Info
    doc.setFontSize(12);

    // Partie "From"
    doc.setFont(undefined, "bold");
    doc.text("From:", marginLeft, startY);
    doc.setFont(undefined, "normal");
    doc.text("The Menufy", marginLeft, startY + lineHeight);
    doc.text(
      `Created By: ${currentInvoice?.created_by?.firstName || ""} ${
        currentInvoice?.created_by?.lastName || ""
      }`,
      marginLeft,
      startY + 2 * lineHeight
    );
    doc.text(
      `Email: ${currentInvoice?.created_by?.email || ""}`,
      marginLeft,
      startY + 3 * lineHeight
    );
    doc.text(
      `Phone: ${currentUser?.user?.phone || "N/A"}`,
      marginLeft,
      startY + 4 * lineHeight
    );

    // Partie "To"
    doc.setFont(undefined, "bold");
    doc.text("To:", marginRight, startY);
    doc.setFont(undefined, "normal");
    doc.text(
      `${currentInvoice?.supplier?.name || ""}`,
      marginRight,
      startY + lineHeight
    );
    doc.text(
      `Attn: ${currentInvoice?.supplier?.contact?.representative || "N/A"}`,
      marginRight,
      startY + 2 * lineHeight
    );
    doc.text(
      `${currentInvoice?.supplier?.address?.city || "N/A"}`,
      marginRight,
      startY + 3 * lineHeight
    );
    doc.text(
      `Email: ${currentInvoice?.supplier?.contact?.email || "N/A"}`,
      marginRight,
      startY + 4 * lineHeight
    );
    doc.text(
      `Phone: ${currentInvoice?.supplier?.contact?.phone || "N/A"}`,
      marginRight,
      startY + 5 * lineHeight
    );

    // Table headers
    const tableStartY = startY + 6 * lineHeight + 10; // Un peu d'espace après "From" et "To"
    doc.setFont(undefined, "bold");
    doc.text("Item", 10, tableStartY);
    doc.text("Unit Cost", 100, tableStartY);
    doc.text("Quantity", 140, tableStartY);
    doc.text("Total", 180, tableStartY);
    doc.setFont(undefined, "normal");

    // Sort the items by ingredient name
    const sortedItems = currentInvoice?.items?.sort((a, b) => {
      const ingredientA = ingredients.find((ing) => ing._id === a.ingredient);
      const ingredientB = ingredients.find((ing) => ing._id === b.ingredient);
      if (ingredientA && ingredientB) {
        return ingredientA.libelle.localeCompare(ingredientB.libelle);
      }
      return 0;
    });

    // Items
    sortedItems?.forEach((item, index) => {
      const ingredient = ingredients.find((ing) => ing._id === item.ingredient);
      const y = tableStartY + 10 + index * 10;
      doc.text(`${ingredient?.libelle || "Unknown"}`, 10, y);
      doc.text(`${item?.price} TND`, 100, y);
      doc.text(`${item?.quantity}`, 140, y);
      doc.text(`${(item?.price * item?.quantity).toFixed(3)} TND`, 180, y);
    });

    // Total Calculations
    const totalStartY = tableStartY + 10 + (sortedItems?.length || 0) * 10 + 10;
    const subtotal = currentInvoice?.total?.toFixed(3);
    const vat = (currentInvoice?.total * 0.19)?.toFixed(3);
    const total = (currentInvoice?.total * 1.19)?.toFixed(3);

    doc.text(`Subtotal: ${subtotal} TND`, 10, totalStartY);
    doc.text(`VAT (19%): ${vat} TND`, 10, totalStartY + 10);
    doc.text(`Total: ${total} TND`, 10, totalStartY + 20);

    // Save PDF
    doc.save(`Invoice_${currentInvoice?.invoiceNumber}.pdf`);
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
                          <strong>VAT (19%)</strong>
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

              <Button variant="primary" onClick={generatePDF}>
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
