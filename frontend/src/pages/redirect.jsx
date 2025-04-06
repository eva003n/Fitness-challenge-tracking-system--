import Loader from "../components/common/Loader";
const Redirect = () => {

  return (
    <div className="grid h-screen bg-slate-50 dark:bg-gray-900 items-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader />
      </div>
    </div>
  );
};

export default Redirect;
