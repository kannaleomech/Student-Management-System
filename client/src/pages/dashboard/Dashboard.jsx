import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { useDashboardStats } from "../../hooks/useDashboard";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { data, isLoading, isError } = useDashboardStats();

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (isError) return <div className="alert alert-danger">Failed to load dashboard</div>;
  if (!data) return null;

  const { totalStudents, studentsPerClass = [], genderRatio = [] } = data;

  const totalClasses = studentsPerClass.length;

  // ---- Pie chart data ----
  const pieData = {
    labels: genderRatio.map(g => g.gender),
    datasets: [
      {
        data: genderRatio.map(g => g.count),
        backgroundColor: ["#0d6efd", "#dc3545", "#6c757d"], // male/female/other
        borderWidth: 1
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 fw-bold">📊 Dashboard Overview</h3>

      {/* Row 1: Chart + Stats */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body row align-items-center">
          {/* Total Students */}
          <div className="col-md-4 text-center">
            <h6 className="text-muted mb-2">Total Students</h6>
            <h2 className="text-primary fw-bold">{totalStudents}</h2>
          </div>

          {/* Total Classes */}
          <div className="col-md-4 text-center">
            <h6 className="text-muted mb-2">Total Classes</h6>
            <h2 className="text-success fw-bold">{totalClasses}</h2>
          </div>

          {/* Gender Pie */}
          <div className="col-md-4 text-center">
            {genderRatio.length ? (
              <div style={{ maxWidth: 200, margin: "0 auto" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <div className="text-muted">No gender data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Class Cards */}
      <h5 className="fw-semibold mb-3">Classes & Student Counts</h5>
      <div className="row g-3">
        {studentsPerClass.length > 0 ? (
          studentsPerClass.map((cls, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <div className="card class-card border-0 shadow-sm text-center p-3 h-100">
                <h6 className="text-secondary mb-1">{cls.className}</h6>
                <h3 className="fw-bold text-success">{cls.count}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted">
            No class data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
