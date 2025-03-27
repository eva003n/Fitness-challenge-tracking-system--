import { useAuth } from "../../context/authProvider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  //read from the global auth context
  const { user } = useAuth();

  /* This component makes sure ttht only authenticated admin users can access this route  */

  return user.role !== "admin" ? <Navigate to="/login" replace /> : <Outlet />;
};

export default ProtectedRoute;
