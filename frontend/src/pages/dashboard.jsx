import { Flame, Footprints, HeartPulse, CircleCheckBig } from "lucide-react";
import { useState, useEffect } from "react";
import PieChartCompoenent from "../components/charts/PieChart";

import StatsCard from "../components/business/StatsCard";
import LineChartComponent from "../components/charts/LineChart";
import { motion } from "motion/react";
import ChallengeCard from "../components/Dashboard/ChallengeCard";
import StatsArea from "../components/Dashboard/StatsArea";
import { getAnalytics, getUserChallengeSummary } from "../services";
import { useAuth } from "../context/authProvider";
import Loader from "../components/common/Loader";
import Container from "../components/common/Container";
import ProgressChart from "../components/Dashboard/ProgressChart";
import WorkoutsSummary from "../components/Dashboard/WorkoutsSummary";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const { user } = useAuth();
  let response = null;
  useEffect(() => {
    const getChallengeSummary = async () => {
      try {
        setIsLoading(true);
        // await  getUserChallengeSummary(user._id),
        const response = await getAnalytics(user._id);

        if (response.success) {
          setIsLoading(false);
          setData(response.data);
        }
      } catch (e) {
        console.log(e.message);
        setIsLoading(false);
      }
    };
    getChallengeSummary();
  }, []);

  return (
    <Container>
      <article className="grid w-full gap-4 md:grid-cols-[2fr_1fr]">
        <div className="grid gap-4">
          <StatsArea
            analytics={
              data &&
              data.challengeSummary[0] &&
              data.challengeSummary[0].metrics
            }
            data={data && data}
            isLoading={isLoading}
          />

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProgressChart isLoading={isLoading} />
          </motion.div>
        </div>
        {/* Challenge summary */}
        <section
          className={`flex flex-col gap-4 text-gray-400 ${isLoading && "animate-pulse"}`}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[17.75rem] rounded-lg bg-slate-100 p-4 dark:bg-gray-800/50"
          >
            {!isLoading && (
              <h2 className="text-1xl px-4 font-bold text-gray-500 dark:text-gray-200">
                Your activity
              </h2>
            )}

            <WorkoutsSummary
              isLoading={isLoading}
              summary={
                data && data.workoutSummary.length > 0 && data.workoutSummary
              }
            />
          </motion.div>

          <ChallengeCard
            className="bg-slate-200 dark:bg-gray-800"
            isLoading={isLoading}
            analytics={
              data &&
              data.challengeSummary[0] &&
              data.challengeSummary[0].currentChallenges
            }
          />
        </section>
      </article>
    </Container>
  );
};
//"#8884d8"
export default Dashboard;
