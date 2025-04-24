import { Pagination } from "react-bootstrap";

const SupplierPagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPaginationItems = () => {
    const items = [];

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
    );

    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        1
      </Pagination.Item>
    );

    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis1" />);
    }

    for (
      let page = Math.max(2, currentPage - 1);
      page <= Math.min(totalPages - 1, currentPage + 1);
      page++
    ) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis2" />);
    }

    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    );

    return items;
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <Pagination>{renderPaginationItems()}</Pagination>
    </div>
  );
};

export default SupplierPagination;