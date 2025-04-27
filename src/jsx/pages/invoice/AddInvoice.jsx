import React, { Fragment, useEffect } from "react";
import { format } from "date-fns";
import { ArrowRight, Trash } from "lucide-react";
import { Button, Col, FormSelect, Row } from "react-bootstrap";
import { authStore } from "../../store/authStore";
import AddInvoiceItem from "./components/AddInvoiceItem";
import useInvoiceStore from "../../store/invoiceStore";
import Logo from "../../../assets/images/logo.png";
import Swal from "sweetalert2";
import useIngredientStore from "../../store/ingredientStore";
import { addInvoiceSchema } from "./validators/addInvoiceSchema";
import useSupplierStore from "../../store/supplierStore";
import { useNavigate } from "react-router-dom";

export const AddInvoice = () => {
  const [supplier, setSupplier] = React.useState(null);
  const { currentUser } = authStore();
  const { ingredients } = useIngredientStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const {
    currentInvoice,
    invoices,
    createInvoice,
    setInvoiceSupplier,
    setInvoiceRestaurant,
    deleteInvoiceItem,
  } = useInvoiceStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.user?.restaurant?._id) {
      setInvoiceRestaurant(currentUser?.user?.restaurant?._id);
    }
    fetchSuppliers();
  }, []);

  const handleChangeSupplier = (e) => {
    setSupplier(e.target.value);
    setInvoiceSupplier(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      addInvoiceSchema.validateSync(currentInvoice, {
        abortEarly: false,
      });
      await createInvoice(currentInvoice);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Invoice created successfully",
      });
      navigate("/invoices");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.inner[0].message,
      });
    }
  };

  const selectedSupplier = suppliers.find((s) => s._id === supplier);

  return (
    <Fragment>
      <Row className="my-4 gap-y-2">
        <Col xs="12">
          <h1 className="page-title">Add Invoice</h1>
        </Col>
        <Row className="gap-x-3 w-100 justify-content-between">
          <Col xs="12" sm={10}>
            <FormSelect
              onChange={handleChangeSupplier}
              className="h-full"
              required
            >
              <option value={""}>Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </FormSelect>
          </Col>
          <Col xs="12" sm={1}>
            <Button color="success" onClick={handleSubmit}>
              <ArrowRight size={20} />
            </Button>
          </Col>
        </Row>
      </Row>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <Row className="justify-content-around">
              <Col xs={8} className="mb-3 p-5">
                <img src={Logo} className="thumbnail w-100" />
              </Col>
            </Row>
            <div className="card-header">
              <strong> Invoice : {"#12345678"}</strong>{" "}
              <strong>{format(new Date(), "dd/MM/yyyy")}</strong>
            </div>
            <div className="card-body">
              <Row className="justify-content-between w-100 border-bottom">
                <Col xs={6} md={4} className="mb-3">
                  <h6>From:</h6>
                  <div>
                    <strong>
                      {currentUser?.user?.restaurant?.nameRes ||
                        "Restaurant Name"}
                    </strong>
                    <div>
                      Created By:{" "}
                      {currentUser?.user?.firstName || "current User"}
                      {currentInvoice?.created_by?.lastName}
                    </div>
                  </div>
                  <div>
                    {currentUser?.user?.restaurant?.address ||
                      "Address not available"}
                  </div>
                  <div>Email: {currentUser?.user?.email || "N/A"}</div>
                  <div>Phone: {currentUser?.user?.phone || "N/A"}</div>
                </Col>
                <Col xs={6} md={4} className="mb-3">
                  <h6>To:</h6>
                  {selectedSupplier ? (
                    <>
                      <div>{selectedSupplier.name}</div>
                      <div>
                        Attn:{" "}
                        {selectedSupplier.contact?.representative || "N/A"}
                      </div>
                      <div>
                        {selectedSupplier.address?.postalCode || ""}{" "}
                        {selectedSupplier.address?.city || ""},{" "}
                        {selectedSupplier.address?.country || "N/A"}
                      </div>
                      <div>
                        Email: {selectedSupplier.contact?.email || "N/A"}
                      </div>
                      <div>
                        Phone: {selectedSupplier.contact?.phone || "N/A"}
                      </div>
                    </>
                  ) : (
                    <div>Select a supplier</div>
                  )}
                </Col>
              </Row>
              <div className="table-responsive">
                <Row>
                  <Col xs={12} sm={5} className="my-3">
                    <AddInvoiceItem />
                  </Col>
                </Row>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="center">#</th>
                      <th>Item</th>
                      <th className="right">Unit Cost</th>
                      <th className="center">Qty</th>
                      <th className="right">Total</th>
                      <th className="right">Remove</th>
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
                          {(item?.price * item?.quantity).toFixed(3)} TND
                        </td>
                        <td className="right">
                          <Button
                            variant="danger"
                            onClick={() => deleteInvoiceItem(item.ingredient)}
                          >
                            <Trash size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Invoice Totals */}
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
                          {currentInvoice?.items
                            ?.reduce(
                              (acc, item) => acc + item?.price * item?.quantity,
                              0
                            )
                            .toFixed(3)}
                        </td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong>VAT (19%)</strong>
                        </td>
                        <td className="right">
                          {currentInvoice?.items
                            ?.reduce(
                              (acc, item) =>
                                acc + item?.price * item?.quantity * 0.19,
                              0
                            )
                            .toFixed(3)}
                        </td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong>Total</strong>
                        </td>
                        <td className="right">
                          {currentInvoice?.items
                            ?.reduce(
                              (acc, item) =>
                                acc + item?.price * item?.quantity * 1.19,
                              0
                            )
                            .toFixed(3)}
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

export default AddInvoice;
