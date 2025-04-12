import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { challengeCompletionRate } from "../../services";
import { getWholeNumber } from "../../utils";



const CHALLENGEcOMPLETIONRATE = [
  { title: "30-Day Step Challenge", rate: 80 },
  { title: "10K Running Challenge", rate: 70 },
  { title: "Strength Training Bootcamp", rate: 50 },
  { title: "Yoga Flexibility Challenge", rate: 83 },
  { title: "Weight Loss Sprint", rate: 70 },
  { title: "HIIT Challenge", rate: 50 },
  { title: "Mindfulness & Meditation", rate: 80 },
];

const ChallengeRate = () => {
    const [data, setData] = useState(null);
  useEffect(() => {
    
      const getRate = async () => {
        try {
            const response = await challengeCompletionRate();
        if (response.success) {
          const formattedData = response && response.data.rates[0].completionRate.map((dataPoint) => ({
            title: ` ${dataPoint.title}`,
            rate: getWholeNumber(dataPoint.completion),
          }));
          setData(formattedData);

        }
        } catch (e) {
            console.log(e.message);
        }
      };
    
    getRate();
  }, []);
  return (
    <div className="rounded-md bg-slate-100 dark:bg-gray-800/30 p-4 text-gray-400">
      <p className="mb-2 grow text-center text-[1.2rem] font-normal sm:text-left">
        Challenge completion rate
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={CHALLENGEcOMPLETIONRATE ||data && data}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rate" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChallengeRate;
