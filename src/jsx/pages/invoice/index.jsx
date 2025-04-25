import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Spinner } from "react-bootstrap";
import { FaEye, FaFilter, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import useInvoiceStore from "../../store/invoiceStore";
import { format } from "date-fns";
import InvoicesPagination from "./components/InvoicesPagination";
import Swal from "sweetalert2";
import { ReceiptText } from "lucide-react";
import InvoiceFilters from "./components/InvoiceFilters";

export const InvoicesPage = () => {
  const {
    invoices,
    filteredInvoices,
    fetchInvoices,
    deleteInvoice,
    loading, // Add loading from the store
    error, // Add error from the store
  } = useInvoiceStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // State to toggle filters
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const invoicesToDisplay =
    filteredInvoices.length > 0 ? filteredInvoices : invoices;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoicesToDisplay.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(invoicesToDisplay.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <h1 className="page-title">Invoices</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/invoices/add">
          <Button variant="success">
            <ReceiptText size={20} />
          </Button>
        </Link>
        <Button variant="primary" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter className="me-1" /> Filters
        </Button>
      </div>

      {showFilters && <InvoiceFilters onClose={() => setShowFilters(false)} />}

      <Card>
        <Card.Body>
          <div className="table-responsive">
            {loading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">
                Failed to load invoices. Please try again.
              </div>
            ) : (
              <Table className="table-hover">
                <thead>
                  <tr>
                    <th># Invoice Number</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Created By</th>
                    <th className="text-center" style={{ width: "150px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.length > 0 ? (
                    currentInvoices.map((inv) => (
                      <tr key={inv._id}>
                        <td>{inv.invoiceNumber}</td>
                        <td>{format(inv.createdAt, "dd-MM-yyyy HH:mm:ss")}</td>
                        <td>{inv.status}</td>
                        <td>${inv.total}</td>
                        <td>{inv.created_by?.email || "N/A"}</td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Link
                              to={`/invoices/${inv._id}`}
                              className="btn btn-sm btn-info"
                              title="View"
                            >
                              <FaEye />
                            </Link>
                            <Button
                              variant="danger"
                              size="sm"
                              title="Delete"
                              onClick={async () => {
                                const result = await Swal.fire({
                                  title: "Are you sure?",
                                  text: "You won't be able to revert this!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, delete it!",
                                });

                                if (result.isConfirmed) {
                                  await deleteInvoice(inv._id);
                                  Swal.fire({
                                    title: "Deleted!",
                                    text: "The invoice has been deleted.",
                                    icon: "success",
                                  });
                                }
                              }}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>
          <Row className="justify-content-around">
            <Col xs={10} sm={6}>
              <InvoicesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
