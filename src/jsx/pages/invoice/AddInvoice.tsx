import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  cost: number;
  amount: number;
}

const AddInvoice: React.FC = () => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 0, cost: 0, amount: 0 },
  ]);
  const [clientInfo, setClientInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [invoiceInfo, setInvoiceInfo] = useState({
    invoiceNumber: "",
    date: "",
    notes: "",
  });

  // Calculate subtotal, tax, and total
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // Assuming 10% tax
  const shipping = 0; // Can be made dynamic if needed
  const discount = 0; // Can be made dynamic if needed
  const total = subtotal + tax + shipping - discount;

  // Add new invoice item row
  const addInvoiceItem = () => {
    const newItem = {
      id: invoiceItems.length + 1,
      description: "",
      quantity: 0,
      cost: 0,
      amount: 0,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  // Remove invoice item row
  const removeInvoiceItem = (id: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
    }
  };

  // Update invoice item
  const updateInvoiceItem = (
    id: number,
    field: string,
    value: string | number
  ) => {
    const updatedItems = invoiceItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate amount if quantity or cost changes
        if (field === "quantity" || field === "cost") {
          updatedItem.quantity =
            field === "quantity" ? Number(value) : item.quantity;
          updatedItem.cost = field === "cost" ? Number(value) : item.cost;
          updatedItem.amount = updatedItem.quantity * updatedItem.cost;
        }

        return updatedItem;
      }
      return item;
    });

    setInvoiceItems(updatedItems);
  };

  // Handle client info changes
  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientInfo({ ...clientInfo, [name]: value });
  };

  // Handle invoice info changes
  const handleInvoiceInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceInfo({ ...invoiceInfo, [name]: value });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="invoice-header bg-white p-4">
                  <div className="row align-items-center">
                    <div className="col-sm-6">
                      <div className="brand-logo mb-3">
                        <h1 className="text-4xl font-bold">Invoice</h1>
                      </div>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                      <div className="company-info">
                        <h3 className="mb-2">Your Company Name</h3>
                        <p className="mb-1">Your Company Address</p>
                        <p>City, State Pin</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="invoice-details p-4">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Invoice No:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="invoiceNumber"
                          value={invoiceInfo.invoiceNumber}
                          onChange={handleInvoiceInfoChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Date:</label>
                        <input
                          type="date"
                          className="form-control"
                          name="date"
                          value={invoiceInfo.date}
                          onChange={handleInvoiceInfoChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="billing-info bg-light p-3 mb-4">
                    <h4 className="mb-3">BILLING INFORMATION</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Name:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={clientInfo.name}
                            onChange={handleClientInfoChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Address:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={clientInfo.address}
                            onChange={handleClientInfoChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Phone:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={clientInfo.phone}
                            onChange={handleClientInfoChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email:</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={clientInfo.email}
                            onChange={handleClientInfoChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="invoice-items mb-4">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="bg-light">
                          <tr>
                            <th>DESCRIPTION</th>
                            <th>QUANTITY</th>
                            <th>COST</th>
                            <th>AMOUNT</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceItems.map((item, index) => (
                            <tr
                              key={item.id}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-light"
                              }
                            >
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={item.description}
                                  onChange={(e) =>
                                    updateInvoiceItem(
                                      item.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateInvoiceItem(
                                      item.id,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.cost}
                                  onChange={(e) =>
                                    updateInvoiceItem(
                                      item.id,
                                      "cost",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>${item.amount.toFixed(2)}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => removeInvoiceItem(item.id)}
                                  disabled={invoiceItems.length === 1}
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end mb-3">
                      <button
                        className="btn btn-primary"
                        onClick={addInvoiceItem}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="notes bg-light p-3">
                        <h5>Notes:</h5>
                        <textarea
                          className="form-control"
                          rows={4}
                          name="notes"
                          value={invoiceInfo.notes}
                          onChange={handleInvoiceInfoChange}
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="invoice-summary">
                        <div className="d-flex justify-content-between mb-2">
                          <span>SUB TOTAL</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>DISCOUNT</span>
                          <span>${discount.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>TAX</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>SHIPPING</span>
                          <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between font-weight-bold">
                          <span className="font-weight-bold">TOTAL</span>
                          <span className="font-weight-bold">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="invoice-footer bg-light p-4 mt-4">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="contact-info">
                        <p>
                          <i className="fa fa-envelope me-2"></i>{" "}
                          yourmailaddress@mail.com
                        </p>
                        <p>
                          <i className="fa fa-phone me-2"></i> 123-456-7890
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <p>© Your Company Name</p>
                    </div>
                  </div>
                </div>

                <div className="invoice-actions p-4 border-top">
                  <div className="text-end">
                    <button className="btn btn-primary me-2">
                      Save Invoice
                    </button>
                    <button className="btn btn-success me-2">
                      Send Invoice
                    </button>
                    <button className="btn btn-info">Print Invoice</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddInvoice;
