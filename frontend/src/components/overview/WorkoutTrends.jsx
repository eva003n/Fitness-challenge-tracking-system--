import { useEffect, useState } from "react";
import PieChartCompoenent from "../charts/PieChart";
import { getWorkoutSummary } from "../../services";
import { getWholeNumber } from "../../utils";

const WORKOUTS = [
  {
    workout: "Yoga",
    value: 100,
  },
  {
    workout: "Running",
    value: 50,
  },
  {
    workout: "Strength",
    value: 300,
  },
  {
    workout: "Walking",
    value: 200,
  },
];

const WorkoutTrends = () => {
    const [data, setData] = useState(null)
    useEffect(() => {
const getSummary = async() => {
const response = await getWorkoutSummary()
if(response.success) {
    const formattedData = response.data.map((dataPoint) => ({
        workout: dataPoint.type,
        value: getWholeNumber(dataPoint.percentagePerWorkout)
    }))
 setData(formattedData)

 }
    

}
  getSummary()
    },[])
  return (
    <div className="rounded-md bg-slate-100 dark:bg-gray-800/30 p-4 text-gray-400">
    <p className="mb-2 grow text-[1.2rem] font-normal text-center sm:text-left">
          Workout trends
        </p>

      <PieChartCompoenent data={data && data || WORKOUTS} />
    </div>
  )
}

export default WorkoutTrends