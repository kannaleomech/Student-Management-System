import React, { useState } from "react";
import { useAuditLogs } from "../../hooks/useAuditLogs";
import TablePagination from "../../components/common/TablePagination";
import { formatDateTime } from "../../helper/formatDate";

const ListLogs = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const { data, isLoading, isFetching, isError, error } = useAuditLogs({
    page,
    limit: perPage,
  });
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.currentPage || page;
  const pageData = data?.data || [];

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  if (isError) {
    return (
      <div className="alert alert-danger">
        Error fetching Audit Logs: {error.message}
      </div>
    );
  }
  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h4 className="mb-0">
                Audit Logs{" "}
                {isFetching && !isLoading && <small>(refreshing...)</small>}
              </h4>
            </div>
          </div>

          {isLoading ? (
            <div className="py-5 text-center">Loading...</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-primary text-white">
                    <tr className="text-capitalize gap-2">
                      <th style={{ width: 80 }}>S.No</th>
                      <th>User</th>
                      <th>Module</th>
                      <th>Changes</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-4">
                          No auditLogs found
                        </td>
                      </tr>
                    ) : (
                      pageData.map((s, idx) => (
                        <tr key={s.id}>
                          <td>{(currentPage - 1) * perPage + idx + 1}</td>
                          <td className="text-capitalize">{s?.user?.name || "-"}</td>
                          <td>{s.module || "-"}</td>
                          <td>{s.action || "-"}</td>
                          <td>{formatDateTime(s.createdAt) || "-"} </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <TablePagination
                currentPage={currentPage}
                totalItems={total}
                perPage={perPage}
                onPageChange={goToPage}
                onPerPageChange={(value) => {
                  setPerPage(value);
                  setPage(1);
                }}
                perPageOptions={[1, 2, 3, 5, 10, 20, 50]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListLogs;
