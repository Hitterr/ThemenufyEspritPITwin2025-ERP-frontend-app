import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Spinner, Badge } from "react-bootstrap"; // Notice Badge imported
import { FaEye, FaFilter, FaTrash, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import useInvoiceStore from "../../store/invoiceStore";
import { format } from "date-fns";
import InvoicesPagination from "./components/InvoicesPagination";
import Swal from "sweetalert2";
import { ReceiptText } from "lucide-react";
import InvoiceFilters from "./components/InvoiceFilters";
import * as XLSX from "xlsx";
export const InvoicesPage = () => {
  const {
    invoices,
    filteredInvoices,
    fetchInvoices,
    deleteInvoice,
    loading,
    error,
    removeSpike,
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
  const exportToExcel = () => {
    const flattenedInvoices = invoices.map((inv) => ({
      _id: inv._id,
      invoiceNumber: inv.invoiceNumber,
      created_by_email: inv.created_by?.email || "N/A",
      restaurant_name: inv.restaurant?.nameRes || "N/A",
      supplier_name: inv.supplier?.name || "N/A",
      total: inv.total,
      status: inv.status,
      createdAt: inv.createdAt
        ? format(new Date(inv.createdAt), "dd-MM-yyyy HH:mm:ss")
        : "N/A",
      updatedAt: inv.updatedAt
        ? format(new Date(inv.updatedAt), "dd-MM-yyyy HH:mm:ss")
        : "N/A",
      deliveredAt: inv.deliveredAt
        ? format(new Date(inv.deliveredAt), "dd-MM-yyyy HH:mm:ss")
        : "notdelivered",
      paidStatus: inv.paidStatus,
    }));
    const worksheet = XLSX.utils.json_to_sheet(flattenedInvoices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rinvoices");
    XLSX.writeFile(workbook, "invoicess.xlsx");
  };
  return (
    <>
      <Card>
        <Card.Header>
          <Row className="w-100 gap-2 justify-content-between align-items-center ">
            <Col md={2}>
              <Link to="/invoices/add">
                <Button variant="success" className="w-100">
                  <ReceiptText size={20} />
                </Button>
              </Link>
            </Col>
            <Col md={3} className="text-center">
              <Row>
                <Col xs={4}>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter />
                  </Button>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="info"
                    className="w-100"
                    onClick={exportToExcel}
                  >
                    <i className="fa fa-file-excel fa-sm" />
                  </Button>{" "}
                </Col>
                <Col xs={4}>
                  <Link to="/invoices/stats">
                    <Button variant="secondary" className="w-100">
                      <FaChartBar size={20} />
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
          {showFilters && (
            <InvoiceFilters onClose={() => setShowFilters(false)} />
          )}
        </Card.Header>
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
                    <th>Created At</th>
                    <th>Delivered At</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th>Paid</th>
                    <th>Total</th>
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
                        <td>
                          {inv.deliveredAt
                            ? format(
                                new Date(inv.deliveredAt),
                                "dd-MM-yyyy HH:mm:ss"
                              )
                            : "notdelivered"}
                        </td>
                        <td>{inv.created_by?.email || "N/A"}</td>
                        {/* Status Badge */}
                        <td>
                          <Badge
                            bg={
                              inv.status === "delivered"
                                ? "success"
                                : inv.status === "pending"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {inv.status?.toUpperCase()}
                          </Badge>
                        </td>
                        {/* Paid Badge */}
                        <td>
                          <Badge
                            bg={
                              inv.paidStatus === "paid" ? "success" : "danger"
                            }
                          >
                            {inv.paidStatus === "paid" ? "PAID" : "NOT PAID"}
                          </Badge>
                        </td>
                        <td>${inv.total}</td>
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
                                  fetchInvoices();
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
                      <td colSpan="8" className="text-center">
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
