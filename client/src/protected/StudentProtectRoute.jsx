import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const StudentProtectRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Student") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default StudentProtectRoute;
