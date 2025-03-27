import { useAuth } from "../../context/authProvider";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = () => {
  const {user, token} = useAuth()
//  const user = JSON.parse(localStorage.getItem("user"));
  //  const token = localStorage.getItem("token");
  
  //replace removes the browser history so when user is authenticated they cannot use browsers back button to go back
  //outlet represents child routes nested within the parent
  return !user && !token ? <Navigate to="/login" replace /> : <Outlet />;
};

export default PrivateRoute;
