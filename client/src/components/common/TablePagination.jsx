import React, { useMemo } from "react";

export default function TablePagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [5, 10, 20, 50],
  maxPagesToShow = 5,
}) {
  const totalPages = Math.ceil(totalItems / perPage) || 1;

  // Page Numbers
  const pageNumbers = useMemo(() => {
    let start = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    let end = start + maxPagesToShow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages, maxPagesToShow]);

  // Showing Range
  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const showingTo = Math.min(currentPage * perPage, totalItems);



  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3 gap-3">
      {/* Left: Showing Info */}
      <div className="text-muted small text-center text-md-start">
        Showing <strong>{showingFrom}</strong>–<strong>{showingTo}</strong> of{" "}
        <strong>{totalItems}</strong>
      </div>

      {/* Middle: Items per page */}
      <div className="d-flex align-items-center gap-2">
        <label className="mb-0 small text-nowrap">Items per page:</label>
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
        >
          {perPageOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Pagination */}
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(1)}>
              First
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
            >
              Prev
            </button>
          </li>

          {pageNumbers.map((p) => (
            <li
              key={p}
              className={`page-item ${p === currentPage ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => onPageChange(p)}>
                {p}
              </button>
            </li>
          ))}

          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
          <li
            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(totalPages)}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
