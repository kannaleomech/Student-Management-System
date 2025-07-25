import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "../redux/slices/authSlice";

function isExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return exp && Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export default function ProtectedRoute() {
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();
  const dispatch = useDispatch();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (isExpired(token)) {
    dispatch(logout());
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
