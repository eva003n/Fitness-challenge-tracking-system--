import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authProvider";


const PublicRoute = () => {
  //first check if the user is an admin
  const { user, role} = useAuth();
  if(user && user.role === "admin"){
    return <Navigate to="/admin/dashboard" replace />
  }
// otherwise check for normal user
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  //if non satisfied keep user on the public routes
  else{
    return <Outlet />;

  }


};

export default PublicRoute;
