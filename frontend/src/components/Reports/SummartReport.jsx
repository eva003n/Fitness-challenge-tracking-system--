import Logo from "../common/logo";
import { useAuth } from "../../context/authProvider";
import { getWholeNumber } from "../../../utils";
import Avatar from "../common/avatar";

const getTotal = (metrics) => {
  return metrics.reduce((acc, metric) => getWholeNumber(acc + metric.total), 0);
};

const UserSummaryReport = ({ metrics, ref }) => {
  const { user } = useAuth();

  return (
    <div ref={ref} className="w-[20rem] max-w-[48rem] rounded-lg bg-slate-100 p-6 shadow-lg dark:bg-gray-900">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b pb-4">
        {/* User Details (Top Left) */}
        <div className="flex items-center gap-4">
          <Avatar />
          <div className="text-gray-400">
            <h2 className="text-xl font-bold text-center w-full">User Summary Report</h2>
            <p>Name: {user.name || user.email}</p>
            {/* <p className="text-gray-600">Age: {user.age} years</p> */}
            <p>User ID: {user._id}</p>
          </div>
        </div>

        {/* Logo (Top Right) */}
        <div>
          <Logo />
        </div>
      </div>

      {/* Metrics Section (Centered) */}
      <div className="mt-6 grid grid-cols-2 gap-6  text-gray-600">
        <div className="rounded-lg bg-blue-200 p-4">
          <h3 className="text-lg font-semibold">Calories Burned</h3>
          <p className="text-2xl font-bold">
            {getTotal(metrics.calories)} kcal
          </p>
        </div>
        <div className="rounded-lg bg-green-100 p-4">
          <h3 className="text-lg font-semibold">Avg Heart Rate</h3>
          <p className="text-2xl font-bold">
            {getTotal(metrics.heartRate)} BPM
          </p>
        </div>
        <div className="rounded-lg bg-yellow-100 p-4">
          <h3 className="text-lg font-semibold">Distance Covered</h3>
          <p className="text-2xl font-bold">{getTotal(metrics.distance)} km</p>
        </div>
        <div className="rounded-lg bg-red-100 p-4">
          <h3 className="text-lg font-semibold">Steps Taken</h3>
          <p className="text-2xl font-bold">{getTotal(metrics.steps)} steps</p>
        </div>
      </div>
    </div>
  );
};

// Sample Data for Testing

export default UserSummaryReport;
