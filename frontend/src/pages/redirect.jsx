import Loader from "../components/common/Loader";
import { useEffect } from "react";
import { getAuthorizationCode } from "../services";
import { useAuth } from "../context/authProvider";

const Redirect = () => {
  const { redirect } = useAuth();
  redirect();

  return (
    <div className="grid h-screen items-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader />
        <p>Redirecting to to dashboard ...</p>
      </div>
    </div>
  );
};

export default Redirect;
