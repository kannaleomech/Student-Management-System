import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin", { replace: true });
  };

  return (
    <header className="border-bottom bg-white">
      <div className="d-flex align-items-center justify-content-between px-3 py-2 m-3">
        <h5 className="mb-0"></h5>

        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">
            Hello, <strong className="text-dark">{user?.name || "User"}</strong>
          </span>
          <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
