import { useSelector } from "react-redux";
import { NavLink, useLocation, matchPath } from "react-router-dom";

function SidebarItem({ to, label, activeWhen }) {
  const location = useLocation();

  const isActive =
    activeWhen?.some((p) =>
      matchPath({ path: p, end: false }, location.pathname)
    ) ?? false;

  const base = "nav-link text-white";
  const activeCls = isActive ? "active bg-primary rounded" : "";

  return (
    <NavLink to={to} className={`${base} ${activeCls}`}>
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  return (
    <aside className="col-auto col-md-3 col-lg-2 bg-dark border-end min-vh-100 p-0 d-none d-md-block">
      <div className="d-flex flex-column h-100">
        {/* Logo Section */}
        <div className="p-3 my-3 text-center border-secondary">
          <img
            src="https://www.praathee.com/Footer/footer_praathee_logo.svg"
            alt="Logo"
            className="img-fluid"
            style={{ maxHeight: "80px" }}
          />
        </div>

        {/* Navigation Links */}
        <nav className="nav flex-column p-2">
          <SidebarItem
            to="/dashboard"
            label="Dashboard"
            activeWhen={["/dashboard"]}
          />
          {user?.roleId == 1 && (
            <SidebarItem
              to="/audit-logs"
              label="AuditLogs"
              activeWhen={["/audit-logs"]}
            />
          )}
          <SidebarItem
            to="/students"
            label="Students"
            activeWhen={["/students/*"]}
          />
        </nav>
      </div>
    </aside>
  );
}
