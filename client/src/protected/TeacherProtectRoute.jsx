import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const TeacherProtectRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Teacher") {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default TeacherProtectRoute;
