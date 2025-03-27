import LineChartComponent from "../charts/LineChart";
import { useAuth } from "../../context/authProvider";
import { useState, useEffect } from "react";
import { getUsersOverAllActivitySummary } from "../../services";
import { months } from "../../../contants";
import { getMonth, getYear, getDate } from "../../services/formatDate";
import Select from "../common/Select";

const ProgressChart = ({ isLoading }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => {
    const getProgress = async () => {
      try {
        const response = await getUsersOverAllActivitySummary(user._id);
        if (response.success) {
          const formattedData = response.data.map((dataPoint) => ({
            date: `${months[getMonth(dataPoint._id)]} ${getDate(dataPoint._id)}`,
            Calories: dataPoint.totalCalories,
            Heartrate: dataPoint.avgHeartRate,
            Distance: dataPoint.totalDistance,
            Steps: dataPoint.totalSteps,
          }));

          setData(formattedData);
        }
      } catch (e) {
        console.log(e.message);
      }
    };
    getProgress();
  }, []);

  return (
    <section
      className={`rounded-lg bg-slate-200 px-2 py-4 sm:px-4 dark:bg-gray-800/50 ${isLoading && "animate-pulse"}`}
    >
      <div className="flex items-start gap-4">
        {!isLoading && (
          <h2 className="text-1xl p-4 font-bold text-gray-600 dark:text-gray-200">
            Your progress
          </h2>
        )}
      </div>
      <div className={`min-h-[18.75rem]`}>
        {!isLoading && <LineChartComponent data={!isLoading && data && data} />}
      </div>
    </section>
  );
};

export default ProgressChart;
