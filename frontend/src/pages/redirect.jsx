import { useEffect } from "react";
import Loader from "../components/common/Loader";

import { useAuth } from "../context/authProvider";

const Redirect = () => {
  const { redirect } = useAuth();
useEffect(() => {
  redirect();
},[])

  return (
    <div className="grid h-screen bg-slate-50 dark:bg-gray-900 items-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader />
        <p className="text-slate-100">Redirecting to to dashboard ...</p>
      </div>
    </div>
  );
};

export default Redirect;
