import React, { Fragment, useEffect, useState } from "react";
import { format } from "date-fns";
import { Col, Row } from "react-bootstrap";
import Logo from "../../../assets/images/logo.png";
import useInvoiceStore from "../../store/invoiceStore";
import useIngredientStore from "../../store/ingredientStore";
import { useParams } from "react-router-dom";

export const ShowInvoice = () => {
  const { invoices, currentInvoice, fetchInvoiceById } = useInvoiceStore();
  const { ingredients } = useIngredientStore();
  const params = useParams();

  useEffect(() => {
    console.log(invoices);
    console.log(currentInvoice);
    console.log(params.id);
    if (params.id) {
      fetchInvoiceById(params.id);
    }
  }, []);
  console.log(currentInvoice);
  if (!currentInvoice._id) {
    return <p>loading ...</p>;
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
                    currentInvoice?.status === "pending" ? "warning" : "success"
                  }`}
                >
                  {currentInvoice?.status?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="card-body">
              <Row className="justify-content-between w-100 border-bottom">
                <Col xs={6} md={4} className="mb-3">
                  <h6>From:</h6>
                  <div>
                    <strong>The Menufy</strong>
                  </div>
                  <div>71-101 Szczecin, Poland</div>
                  <div>Email: info@webz.com.pl</div>
                  <div>Phone: +48 444 666 3333</div>
                  <div>
                    Created By: {currentInvoice?.created_by?.firstName}{" "}
                    {currentInvoice?.created_by?.lastName}
                  </div>
                  <div>Email: {currentInvoice?.created_by?.email}</div>
                </Col>
                <Col xs={6} md={4} className="mb-3">
                  <h6>To:</h6>
                  <div>Supplier ID: {currentInvoice?.supplier}</div>
                  <div>Attn: Daniel Marek</div>
                  <div>43-190 Mikolow, Poland</div>
                  <div>Email: marek@daniel.com</div>
                  <div>Phone: +48 123 456 789</div>
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ShowInvoice;
