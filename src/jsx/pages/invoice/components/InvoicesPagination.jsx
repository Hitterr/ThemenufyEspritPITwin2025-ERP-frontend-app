import { Button } from "react-bootstrap";

const InvoicesPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="d-flex justify-content-between mt-3">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </Button>
      <span>Page {currentPage} of {totalPages}</span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default InvoicesPagination;