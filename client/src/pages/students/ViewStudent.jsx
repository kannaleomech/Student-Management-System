import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudent } from "../../hooks/useStudent";
import { useSelector } from "react-redux";
import { formatDate } from "../../helper/formatDate";

export default function ViewStudent() {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const { data: student, isLoading } = useStudent(id);
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container my-4">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="row g-0">
          {/* Student Image */}
          <div className="col-md-4 d-flex flex-column justify-content-center align-items-center bg-light p-4">
            <img
              src={
                student.profile
                  ? `${import.meta.env.VITE_APP_Image_URL}/student/${
                      student.profile
                    }`
                  : `${import.meta.env.VITE_APP_Image_URL}/default/default.png`
              }
              alt={student.name}
              className="img-fluid rounded-circle border"
              style={{ maxHeight: "180px", objectFit: "cover" }}
            />
            <h5 className="mt-3">{student.name}</h5>
            <p className="text-muted mb-0">{student.classInfo?.name}</p>
          </div>

          {/* Student Details */}
          <div className="col-md-8">
            <div className="card-body">
              {/* Title + Buttons Row */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="card-title text-primary mb-0">
                  Student Details
                </h3>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/students")}
                  >
                    Back
                  </button>
                  {user?.roleId == 1 && (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/students/edit/${id}`)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Student Details List */}
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Name:</strong> {student.name}
                </li>
                <li className="list-group-item">
                  <strong>Class:</strong> {student.classInfo?.name}
                </li>
                <li className="list-group-item">
                  <strong>Gender:</strong> {student.gender}
                </li>
                <li className="list-group-item">
                  <strong>Mobile:</strong> {student.mobile || "-"}
                </li>
                <li className="list-group-item">
                  <strong>State:</strong> {student.state || "-"}
                </li>
                <li className="list-group-item">
                  <strong>City:</strong> {student.city || "-"}
                </li>
                <li className="list-group-item">
                  <strong>Created At:</strong> {formatDate(student.createdAt)}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
