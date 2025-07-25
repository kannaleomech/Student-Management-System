import React, { useMemo, useState } from "react";
import {
  useBulkUploadStudents,
  useDeleteStudent,
  useStudents,
} from "../../hooks/useStudent";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useClasses } from "../../hooks/useList";
import { genderOptions, stateCityData } from "../../helper/commonData";
import * as XLSX from "xlsx";
import { useRef } from "react";
import DeleteModal from "../../components/common/DeleteModal";
import TablePagination from "../../components/common/TablePagination";
export default function ListStudents() {
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const debouncedSearch = useDebouncedValue(search, 500);
  const tableRef = useRef(null);
  const handleExport = () => {
    if (!tableRef.current) return;

    const tableClone = tableRef.current.cloneNode(true);

    const headerCells = tableClone.rows[0].cells;
    const columnsToRemove = [];

    Array.from(headerCells).forEach((cell, idx) => {
      const text = cell.innerText.toLowerCase();
      if (text.includes("profile") || text.includes("action")) {
        columnsToRemove.push(idx);
      }
    });

    Array.from(tableClone.rows).forEach((row) => {
      columnsToRemove
        .slice()
        .sort((a, b) => b - a)
        .forEach((colIdx) => {
          if (row.cells[colIdx]) row.deleteCell(colIdx);
        });
    });

    // Convert to Excel
    const wb = XLSX.utils.table_to_book(tableClone, { sheet: "Students" });
    XLSX.writeFile(
      wb,
      `students_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const { data, isLoading, isFetching, isError, error } = useStudents({
    page,
    limit: perPage,
    search: debouncedSearch || undefined,
    classId: selectedClass || undefined,
    gender: selectedGender || undefined,
  });

  const { data: classes, isLoading: loadingClasses } = useClasses();

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
        Failed to load students: {error?.message || "Unknown error"}
      </div>
    );
  }

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleDeleteClick = (student) => {
    console.log("value", student);
    setSelectedStudent(student);
    setShowModal(true);
  };

  const { mutate: deleteStudentMutate, isLoading: isDeleting } =
    useDeleteStudent();

  const handleConfirmDelete = () => {
    if (!selectedStudent) return;
    deleteStudentMutate(selectedStudent.id);
    setShowModal(!showModal);
  };

  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const { mutate: bulkUpload, isLoading: uploading } = useBulkUploadStudents();

  const handleFileChange = () => {
    fileInputRef.current.click();
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    bulkUpload(file, {
      onSuccess: (res) => {
        // res: { inserted, failed, errors: [...] }
        setErrors(res.errors || []);
      },
      onError: (err) => {
        setErrors(err?.response?.data?.errors || []);
      },
    });
  };

  return (
    <>
      {/* Show backend validation errors */}
      {errors.length > 0 && (
        <div
          className="alert alert-warning alert-dismissible fade show mt-3"
          role="alert"
        >
          <h6 className="mb-2">Rows with issues:</h6>
          <ul className="mb-0 small">
            {errors.map((e, i) => (
              <li key={i}>
                <strong>Row {e.row}:</strong> {e.errors.join(", ")}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrors([])} // clear errors on close
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <h4 className="mb-0">
                Students{" "}
                {isFetching && !isLoading && <small>(refreshing...)</small>}
              </h4>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-outline-success"
                  onClick={handleExport}
                >
                  <i className="bi bi-file-earmark-excel me-1"></i> Export
                  Students
                </button>

                {user?.roleId == 1 && (
                  <>
                    <button
                      className={`btn ${
                        uploading ? "btn-warning" : "btn-outline-primary"
                      }`}
                      onClick={handleFileChange}
                      disabled={uploading}
                    >
                      <i className="bi bi-upload me-1"></i>
                      {uploading ? "Uploading..." : "Import Students"}
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".xlsx, .xls"
                      className="d-none"
                      onChange={handleUpload}
                    />

                    <Link to={"/students/add"} className="btn btn-primary">
                      Add Student
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Filters Row */}
            <div className="row g-2 mt-2">
              {/* Search Input */}
              <div className="col-md-3 col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search name , mobile..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              {/* Class Filter */}
              <div className="col-md-2 col-sm-6">
                <select
                  className="form-select"
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Classes</option>
                  {loadingClasses ? (
                    <option value="" disabled>
                      Loading classes...
                    </option>
                  ) : (
                    classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Gender Filter */}
              <div className="col-md-2 col-sm-6">
                <select
                  className="form-select"
                  value={selectedGender}
                  onChange={(e) => {
                    setSelectedGender(e.target.value);
                    setPage(1);
                  }}
                >
                  {genderOptions.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>



              {/* Clear Filters Button */}
              <div className="col-md-1 col-sm-6 d-grid">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearch("");
                    setSelectedClass("");
                    setSelectedGender("");
                    setPage(1);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="py-5 text-center">Loading...</div>
          ) : (
            <>
              <div className="table-responsive">
                <table
                  ref={tableRef}
                  className="table table-hover align-middle"
                >
                  <thead className="table-primary text-white">
                    <tr className="text-capitalize gap-2">
                      <th style={{ width: 80 }}>S.No</th>
                      <th>Profile</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Gender</th>
                      <th>Mobile</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-4">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      pageData.map((s, idx) => (
                        <tr key={s.id}>
                          <td>{(currentPage - 1) * perPage + idx + 1}</td>
                          <td>
                            <img
                              src={
                                s.profile
                                  ? `${
                                      import.meta.env.VITE_APP_Image_URL
                                    }/student/${s.profile}`
                                  : `${
                                      import.meta.env.VITE_APP_Image_URL
                                    }/default/default.png`
                              }
                              alt={s.name}
                              className="rounded"
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td className="text-capitalize">{s.name || "-"}</td>
                          <td>{s.classInfo?.name || "-"}</td>
                          <td>{s.gender || "-"}</td>
                          <td>{s.mobile || "-"}</td>
                          <td>{s.city || "-"}</td>
                          <td>{s.state || "-"}</td>
                          <td>
                            <Link
                              to={`/students/view/${s.id}`}
                              className="btn btn-sm btn-primary me-2"
                            >
                              View
                            </Link>
                            {user?.roleId == 1 && (
                              <>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDeleteClick(s)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
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
        <DeleteModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}
          name={selectedStudent?.name}
          module="Student"
          loading={isDeleting}
        />
      </div>
    </>
  );
}
